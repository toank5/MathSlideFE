import React, { useState, forwardRef, useEffect, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable,
  pointerWithin,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, CollisionDetection, Active } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { InlineMath } from 'react-katex';
import { flushSync } from 'react-dom';
// import { nanoid } from '@reduxjs/toolkit';

// Local Imports - Giả định các file này nằm đúng vị trí
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { TOOLBAR_SECTIONS } from '../../../constants/slideEditorConstants';
import {
  setPresentation,
  setActiveSlide,
  reorderSlides,
  addSlide,
  addComponent,
  removeComponent,
  updateComponentProperties,
  setSlideComponents,
  removeSlide,
  updatePresentationTitle,
  undo, // Import undo
  redo, // Import redo
} from '../slices/slideEditorSlice';
import type { Slide, CanvasComponent, ComponentProperties, ContextMenuState, Presentation } from '../types/types';
import { useParams } from 'react-router-dom';
import { presentationApi } from '../api/presentationApi';

// --- Constants for Thumbnail Scaling --- //
const CANVAS_WIDTH = 1280; 
const CANVAS_HEIGHT = 720;
const THUMBNAIL_WIDTH = 128; 
const THUMBNAIL_HEIGHT = 72; // Changed from 80 to 72 to match 16:9 aspect ratio

// --- REUSABLE COMPONENTS --- //

const CanvasItemRenderer = ({ item, style }: { item: CanvasComponent, style?: React.CSSProperties }) => {
    const textClasses = `w-full h-full p-1 ${item.properties.isBold ? 'font-bold' : ''} ${item.properties.isItalic ? 'italic' : ''} ${item.properties.isUnderline ? 'underline' : ''}`;
    
    switch (item.componentType) {
        case 'text': 
            return <div style={style} className={`${textClasses}`}>{item.properties.content}</div>;
        case 'image':
            return <img src={item.properties.content} alt="" style={style} className="object-cover w-full h-full" />;
        case 'shape':
          { const shapeStyle: React.CSSProperties = {
                ...style,
                backgroundColor: item.properties.backgroundColor,
                maskImage: `url("data:image/svg+xml,${encodeURIComponent(item.properties.content)}")`,
                maskRepeat: 'no-repeat',
                maskSize: '100% 100%',
                WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(item.properties.content)}")`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: '100% 100%',
            };
            return <div style={shapeStyle} className="w-full h-full"></div> }
        case 'formula': 
            return <div style={style} className="w-full h-full flex items-center justify-center p-1"><InlineMath math={item.properties.content} /></div>;
        default: 
            return null;
    }
}

const SlidePreview = ({ components }: { components: CanvasComponent[] }) => {
    const scale = Math.min(THUMBNAIL_WIDTH / CANVAS_WIDTH, THUMBNAIL_HEIGHT / CANVAS_HEIGHT);
    const scaledWidth = CANVAS_WIDTH * scale;
    const scaledHeight = CANVAS_HEIGHT * scale;
    const offsetX = (THUMBNAIL_WIDTH - scaledWidth) / 2;
    const offsetY = (THUMBNAIL_HEIGHT - scaledHeight) / 2;

    return (
        <div
            className="absolute pointer-events-none bg-gray-50 shadow-inner"
            style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                top: `${offsetY}px`,
                left: `${offsetX}px`,
                overflow: 'hidden',
            }}
        >
            {[...components].sort((a, b) => a.zIndex - b.zIndex).map(item => {
                const itemStyle: React.CSSProperties = {
                    position: 'absolute',
                    transform: `translate3d(${item.properties.x}px, ${item.properties.y}px, 0) rotate(${item.properties.rotation || 0}deg)`,
                    width: `${item.properties.width}px`,
                    height: `${item.properties.height}px`,
                    color: item.properties.color,
                    fontSize: `${item.properties.fontSize}px`,
                    zIndex: item.zIndex,
                };
                return <CanvasItemRenderer key={item.id} item={item} style={itemStyle} />;
            })}
        </div>
    );
};

const SlideThumbnail = forwardRef<HTMLDivElement, { slide: Slide; active?: boolean; } & React.HTMLAttributes<HTMLDivElement>>
  (({ slide, active, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={`w-32 flex-shrink-0 cursor-pointer group ${active ? '' : 'p-1'}`}>
        <div className={`w-full h-[72px] bg-white rounded-md shadow-md flex items-center justify-center text-sm relative overflow-hidden border-2 ${active ? 'border-blue-500' : 'border-transparent'} transition-all`}>
            <SlidePreview components={slide?.components ?? []} />
        </div>
        <p className="text-xs text-center mt-1 text-gray-600 truncate group-hover:text-blue-600">
            Trang {slide?.pageNumber ?? ''}
        </p>
      </div>
    );
  }
);

const SortableSlide = ({ slide, active }: { slide: Slide, active: boolean }) => {
  const dispatch = useAppDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id, data: { type: 'SLIDE', slide } });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => dispatch(setActiveSlide(slide.id))}>
       <SlideThumbnail slide={slide} active={active} />
    </div>
  );
};

const DraggableToolbarItem = ({ item }: { item: any }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: item.id, data: { type: 'TOOLBAR_ITEM', item } });
  const renderContent = () => {
    if (item.componentType === 'shape') {
      return (
        <div
          className="w-6 h-6 pointer-events-none"
          dangerouslySetInnerHTML={{ __html: item.icon }}
        ></div>
      );
    }
    return <CanvasItemRenderer item={item} style={{ width: '100%', height: '100%' }} />;
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 flex justify-center items-center border rounded-md hover:bg-gray-200 cursor-grab text-sm"
    >
      {renderContent()}
    </div>
  );
};

const CanvasItem = ({ item, selected, onClick, onContextMenu }: { item: CanvasComponent; selected: boolean; onClick: () => void; onContextMenu: (event: React.MouseEvent<HTMLDivElement>, itemId: string) => void; }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: item.id, data: { type: 'CANVAS_ITEM', item } });
    const style: React.CSSProperties = {
      position: 'absolute',
      transform: `translate3d(${item.properties.x}px, ${item.properties.y}px, 0) rotate(${item.properties.rotation || 0}deg)`,
      width: `${item.properties.width}px`,
      height: `${item.properties.height}px`,
      color: item.properties.color,
      fontSize: `${item.properties.fontSize}px`,
      opacity: isDragging ? 0 : 1,
      zIndex: item.zIndex,
    };
    const combinedProps = { ...attributes, ...listeners, onClick, onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => onContextMenu(e, item.id) };
    return (
      <div ref={setNodeRef} style={style} {...combinedProps} className={`p-1 border-2 ${selected ? 'border-blue-500' : 'border-transparent'} hover:border-blue-300 cursor-move`}>
        <CanvasItemRenderer item={item} style={{width: '100%', height: '100%'}} />
      </div>
    );
};

const ContextMenu = ({ menuState, onAction }: { menuState: ContextMenuState; onAction: (action: string) => void }) => {
    if (!menuState.visible) return null;
    return (
        <div style={{ top: menuState.y, left: menuState.x }} className="absolute z-50 bg-white shadow-lg rounded-md py-1 w-40">
            <button onClick={() => onAction('bring-to-front')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Lên trên cùng</button>
            <button onClick={() => onAction('send-to-back')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Xuống dưới cùng</button>
        </div>
    );
};

const DroppableCanvas = ({ id, children, className, onClick }: { id: string, children: React.ReactNode, className: string, onClick: (e: React.MouseEvent) => void }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={className} onClick={onClick}>
            {children}
        </div>
    );
};


// --- MAIN EDITOR COMPONENT --- //
const SlideEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
    const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  const presentation = useAppSelector((state) => state.slideEditor.present.presentation);
  const activeSlideId = useAppSelector((state) => state.slideEditor.present.activeSlideId);
  const canUndo = useAppSelector((state) => state.slideEditor.past.length > 0);
  const canRedo = useAppSelector((state) => state.slideEditor.future.length > 0);
  const saveStatus = useAppSelector((state) => state.slideEditor.present.saveStatus);

  const slides = presentation?.slides ?? [];
  const canvasItems = presentation?.slides.find(s => s.id === activeSlideId)?.components ?? [];

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<Active | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, itemId: null });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="text-sm text-gray-500">Đang lưu...</span>;
      case 'succeeded':
        return <span className="text-sm text-green-600">Đã lưu tất cả thay đổi</span>;
      case 'failed':
        return <span className="text-sm text-red-600">Lưu thất bại!</span>;
      default:
        return null; // 'idle'
    }
  };

  useEffect(() => {
    if (id) {
      presentationApi.get(id)
        .then(data => {
          dispatch(setPresentation(data));
        })
        .catch(err => {
          console.error("Failed to fetch presentation:", err);
        });
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);
    return () => {
        document.head.removeChild(link);
    };
  }, [id, dispatch]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
        const targetNodeName = (event.target as HTMLElement).nodeName;
        if (targetNodeName === 'INPUT' || targetNodeName === 'TEXTAREA') return;

        // Xử lý Undo/Redo
        if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
            event.preventDefault();
            dispatch(undo());
        }
        if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
            event.preventDefault();
            dispatch(redo());
        }

        if (event.key === 'Delete') {
            if (selectedItemId) {
                dispatch(removeComponent({ componentId: selectedItemId }));
                setSelectedItemId(null);
            } else if (activeSlideId) {
                dispatch(removeSlide({ slideId: activeSlideId }));
            }
        }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedItemId, activeSlideId, dispatch]);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
    if (contextMenu.visible) window.addEventListener('click', handleClickOutside, { once: true });
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  useEffect(() => {
    const calculateScale = () => {
      if (canvasContainerRef.current) {
        const { width } = canvasContainerRef.current.getBoundingClientRect();
        setCanvasScale(width / CANVAS_WIDTH);
      }
    };
    if (!presentation) return;

    const resizeObserver = new ResizeObserver(calculateScale);
    const container = canvasContainerRef.current;

    if (container) {
      resizeObserver.observe(container);
    }
    
    calculateScale();
    
    window.addEventListener('resize', calculateScale);

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      window.removeEventListener('resize', calculateScale);
    };
  }, [presentation]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const customCollisionDetection: CollisionDetection = (args) => {
    if (activeItem?.data.current?.type === 'SLIDE') {
      return closestCenter(args);
    }
    return pointerWithin(args);
  };

  const handleDragStart = (event: DragStartEvent) => setActiveItem(event.active);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    const activeType = active.data.current?.type;
    setActiveItem(null);
    if (!over) return;

    if (activeType === 'SLIDE' && over.data.current?.type === 'SLIDE' && active.id !== over.id) {
      dispatch(reorderSlides({ activeId: active.id as string, overId: over.id as string }));
    }
    else if (activeType === 'TOOLBAR_ITEM' && over.id === 'canvas' && activeSlideId) {
        const { item } = active.data.current!;
        const maxZIndex = canvasItems.length > 0 ? Math.max(...canvasItems.map(i => i.zIndex)) : 0;

        // Tọa độ của item đang được kéo (DragOverlay) tại thời điểm thả
        const translatedRect = active.rect.current.translated;

        if (!translatedRect) return; // Thoát nếu không có tọa độ

        // Tính toán vị trí thả bên trong canvas
        // Tọa độ này là tọa độ của góc trên bên trái của overlay so với canvas
        const dropX = translatedRect.left - over.rect.left;
        const dropY = translatedRect.top - over.rect.top;

        // Để căn giữa component vào vị trí con trỏ, bạn có thể trừ đi một nửa chiều rộng/cao của item
        const finalX = (dropX / canvasScale) - (item.properties.width / 2);
        const finalY = (dropY / canvasScale) - (item.properties.height / 2);
        
        const newComponent: CanvasComponent = {
            id: crypto.randomUUID(),
            slideId: activeSlideId,
            componentType: item.componentType,
            zIndex: maxZIndex + 1,
            properties: {
                // Sử dụng tọa độ đã được tính toán chính xác
                x: finalX,
                y: finalY,
                rotation: 0,
                color: '#000000',
                backgroundColor: 'transparent',
                isBold: false, isItalic: false, isUnderline: false,
                ...item.properties,
            },
        };
        dispatch(addComponent(newComponent));
    }
    else if (activeType === 'CANVAS_ITEM' && activeSlideId) {
        const component = canvasItems.find(c => c.id === active.id);
        if (component) {
          flushSync(() => {
            dispatch(updateComponentProperties({
              componentId: active.id as string,
              properties: {
                x: component.properties.x + (delta.x / canvasScale),
                y: component.properties.y + (delta.y / canvasScale),
              }
            }));
          });
        }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeSlideId) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const maxZIndex = canvasItems.length > 0 ? Math.max(...canvasItems.map(i => i.zIndex)) : 0;
        const newComponent: CanvasComponent = {
            id: crypto.randomUUID(),
            slideId: activeSlideId,
            componentType: 'image',
            zIndex: maxZIndex + 1,
            properties: {
                content: e.target?.result as string, x: 100, y: 100, width: 300, height: 200, rotation: 0, fontSize: 16, color: '#000000', backgroundColor: 'transparent', isBold: false, isItalic: false, isUnderline: false,
            }
        };
        dispatch(addComponent(newComponent));
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedItemId(itemId);
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, itemId });
  };

  const handleContextMenuAction = (action: string) => {
    const { itemId } = contextMenu;
    if (!itemId || !activeSlideId) return;
    const sortedItems = [...canvasItems].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sortedItems.findIndex(item => item.id === itemId);
    if (currentIndex === -1) return;

    if (action === 'bring-to-front') sortedItems.push(sortedItems.splice(currentIndex, 1)[0]);
    else if (action === 'send-to-back') sortedItems.unshift(sortedItems.splice(currentIndex, 1)[0]);
    
    const updatedComponents = sortedItems.map((item, index) => ({ ...item, zIndex: index + 1 }));
    dispatch(setSlideComponents({ slideId: activeSlideId, components: updatedComponents }));
  };

  const handleAddNewSlide = () => {
    if (presentation) dispatch(addSlide({ id: crypto.randomUUID() }));
  };
  
  const selectedComponentData = canvasItems.find(item => item.id === selectedItemId);

  const updateSelectedComponentProperties = (properties: Partial<ComponentProperties>) => {
    if (!selectedItemId) return;
    dispatch(updateComponentProperties({ componentId: selectedItemId, properties }));
  }

  if (!presentation) {
    return <div className="flex h-screen items-center justify-center">Đang tải bài giảng...</div>;
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={customCollisionDetection}>
      <div className="flex flex-col h-screen bg-gray-200 font-sans text-gray-800">
        <header className="bg-white shadow-md p-2 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input type="text" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} onBlur={() => { if (titleValue.trim()) dispatch(updatePresentationTitle(titleValue)); setIsEditingTitle(false); }} onKeyDown={(e) => { if (e.key === 'Enter') { if (titleValue.trim()) dispatch(updatePresentationTitle(titleValue)); setIsEditingTitle(false); } }} className="text-lg font-bold border-b-2 border-blue-500 focus:outline-none" autoFocus />
              ) : (
                <h1 className="text-lg font-bold cursor-pointer hover:bg-gray-100 p-1 rounded" onClick={() => { setTitleValue(presentation.title); setIsEditingTitle(true); }}>{presentation.title}</h1>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Hiển thị trạng thái lưu ở đây */}
              <div className="w-48 text-right">
                {renderSaveStatus()}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => dispatch(undo())} disabled={!canUndo} className="px-3 py-1 text-sm bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Undo</button>
                <button onClick={() => dispatch(redo())} disabled={!canRedo} className="px-3 py-1 text-sm bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Redo</button>
                <button onClick={() => window.open(`/present/${id}`, '_blank')} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Chia sẻ
                </button>
              </div>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-60 bg-white p-3 flex flex-col shadow-lg overflow-y-auto space-y-6">
            {TOOLBAR_SECTIONS.map(section => (
                <div key={section.title}>
                    <h2 className="text-sm font-semibold mb-3 text-gray-600 uppercase">{section.title}</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {section.items.map(item => <DraggableToolbarItem key={item.id} item={item} />)}
                        {section.title === 'Hình khối & Ảnh' && (
                            <>
                                <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageUpload} />
                                <button onClick={() => imageInputRef.current?.click()} className="p-2 text-center border rounded-md hover:bg-gray-200 text-sm">
                                    Tải ảnh lên
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
          </aside>

          <main className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-gray-200">
            <div className="w-full max-w-screen-lg mx-auto" ref={canvasContainerRef}>
                <div className="relative aspect-video bg-white rounded-lg shadow-inner overflow-hidden" id="canvas-container">
                    <div style={{
                        width: CANVAS_WIDTH,
                        height: CANVAS_HEIGHT,
                        transform: `scale(${canvasScale})`,
                        transformOrigin: 'top left',
                    }}>
                        <DroppableCanvas id="canvas" className="absolute inset-0 w-full h-full" onClick={(e) => { if (e.target === e.currentTarget) setSelectedItemId(null); } }>
                            {[...canvasItems].sort((a,b) => a.zIndex - b.zIndex).map(item => (
                                <CanvasItem key={item.id} item={item} selected={item.id === selectedItemId} onClick={() => setSelectedItemId(item.id)} onContextMenu={handleContextMenu} />
                            ))}
                        </DroppableCanvas>
                    </div>
                </div>
            </div>
          </main>

          <aside className="w-72 bg-white p-4 shadow-lg overflow-y-auto">
            <h2 className="text-sm font-semibold mb-4 text-gray-600">THUỘC TÍNH</h2>
            {selectedComponentData ? (
                <div className="space-y-4">
                    {/* Generic Properties */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500">Rộng</label>
                        <input type="range" className="mt-1 block w-full" min="20" max="1280" value={selectedComponentData.properties.width} onChange={e => updateSelectedComponentProperties({ width: parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500">Cao</label>
                        <input type="range" className="mt-1 block w-full" min="20" max="720" value={selectedComponentData.properties.height} onChange={e => updateSelectedComponentProperties({ height: parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500">Độ xoay</label>
                        <input type="range" className="mt-1 block w-full" min="0" max="360" value={selectedComponentData.properties.rotation} onChange={e => updateSelectedComponentProperties({ rotation: parseInt(e.target.value) })} />
                    </div>

                    {(selectedComponentData.componentType === 'text' || selectedComponentData.componentType === 'formula') && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Nội dung</label>
                                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm" value={selectedComponentData.properties.content} onChange={e => updateSelectedComponentProperties({ content: e.target.value })} rows={3}/>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Cỡ chữ</label>
                                <input type="range" className="mt-1 block w-full" min="8" max="120" value={selectedComponentData.properties.fontSize} onChange={e => updateSelectedComponentProperties({ fontSize: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Màu</label>
                                <input type="color" className="mt-1 block w-full h-8 p-0 border-none cursor-pointer" value={selectedComponentData.properties.color} onChange={e => updateSelectedComponentProperties({ color: e.target.value })} />
                            </div>
                        </>
                    )}

                    {selectedComponentData.componentType === 'text' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Định dạng</label>
                        <div className="mt-1 grid grid-cols-3 gap-2">
                          <button onClick={() => updateSelectedComponentProperties({ isBold: !selectedComponentData.properties.isBold })} className={`px-3 py-1 text-sm font-bold rounded-md ${selectedComponentData.properties.isBold ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>B</button>
                          <button onClick={() => updateSelectedComponentProperties({ isItalic: !selectedComponentData.properties.isItalic })} className={`px-3 py-1 text-sm italic rounded-md ${selectedComponentData.properties.isItalic ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>I</button>
                          <button onClick={() => updateSelectedComponentProperties({ isUnderline: !selectedComponentData.properties.isUnderline })} className={`px-3 py-1 text-sm underline rounded-md ${selectedComponentData.properties.isUnderline ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>U</button>
                        </div>
                      </div>
                    )}
                    {selectedComponentData.componentType === 'shape' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Màu nền</label>
                            <input type="color" className="mt-1 block w-full h-8 p-0 border-none cursor-pointer" value={selectedComponentData.properties.backgroundColor} onChange={e => updateSelectedComponentProperties({ backgroundColor: e.target.value })} />
                        </div>
                    )}
                    
                </div>
            ) : (
                <p className="text-xs text-gray-500 text-center mt-8">Chọn một đối tượng để chỉnh sửa.</p>
            )}
        </aside>
        </div>

        <footer className="bg-gray-100 p-3 shadow-inner border-t border-gray-300">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                <SortableContext items={slides.map(s => s.id)} strategy={horizontalListSortingStrategy}>
                    {slides.map((slide) => (
                        <SortableSlide key={slide.id} slide={slide} active={slide.id === activeSlideId} />
                    ))}
                </SortableContext>
                <button onClick={handleAddNewSlide} className="w-32 h-20 flex-shrink-0 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center text-gray-500">
                    + Thêm trang
                </button>
            </div>
        </footer>
      </div>

      <DragOverlay>
        {activeItem?.data.current?.type === 'SLIDE' && activeItem.data.current.slide && (
          <SlideThumbnail slide={activeItem.data.current.slide as Slide} active />
        )}
        {activeItem?.data.current?.type === 'CANVAS_ITEM' && (
          activeItem.data.current.item && <CanvasItem item={activeItem.data.current.item as CanvasComponent} selected={true} onClick={() => {}} onContextMenu={() => {}} />
        )}
        {activeItem?.data.current?.type === 'TOOLBAR_ITEM' && (
          <div className="p-2 bg-white rounded-lg opacity-90 shadow-lg">
            <span className="text-sm font-medium text-gray-700">{activeItem.data.current.item.label}</span>
          </div>
        )}
      </DragOverlay>
      <ContextMenu menuState={contextMenu} onAction={handleContextMenuAction} />
    </DndContext>
  );
};

export default SlideEditorPage;