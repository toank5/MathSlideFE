import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { presentationApi } from '@/featurers/slideEditor/api/presentationApi';
import type { Presentation, CanvasComponent } from '@/featurers/slideEditor/types/types';
import { InlineMath } from 'react-katex';

// --- Constants for Canvas Scaling --- //
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

// --- Reusable Component Renderer (Copied from SlideEditorPage) --- //
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


const PresentationPage = () => {
    const { id } = useParams<{ id: string }>();
    const presentationContainerRef = useRef<HTMLDivElement>(null);
    const [presentationScale, setPresentationScale] = useState(1);
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            presentationApi.getShowslide(id)
                .then(data => {
                    setPresentation(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch presentation:", err);
                    setError("Không thể tải bài giảng.");
                    setLoading(false);
                });
        }
        // Add KaTeX CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, [id]);

    useEffect(() => {
        const calculateScale = () => {
          if (presentationContainerRef.current) {
            const { width, height } = presentationContainerRef.current.getBoundingClientRect();
            const scale = Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT);
            setPresentationScale(scale);
          }
        };
        
        if (!presentation) return;
    
        const resizeObserver = new ResizeObserver(calculateScale);
        const container = presentationContainerRef.current;
    
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

    const slides = presentation?.slides.sort((a, b) => a.pageNumber - b.pageNumber) ?? [];
    const currentSlide = slides[currentSlideIndex];

    const goToNextSlide = useCallback(() => {
        setCurrentSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
    }, [slides.length]);

    const goToPrevSlide = useCallback(() => {
        setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                goToPrevSlide();
            } else if (event.key === 'ArrowRight') {
                goToNextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [goToNextSlide, goToPrevSlide]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Đang tải...</div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center bg-gray-900 text-red-500">{error}</div>;
    }

    if (!presentation || !currentSlide) {
        return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Không tìm thấy bài giảng.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Slide Display Area */}
            <main className="flex-1 flex items-center justify-center p-4 overflow-hidden" ref={presentationContainerRef}>
                <div
                    style={{
                        width: CANVAS_WIDTH * presentationScale,
                        height: CANVAS_HEIGHT * presentationScale,
                    }}
                >
                    <div 
                        className="bg-white overflow-hidden"
                        style={{
                            width: CANVAS_WIDTH,
                            height: CANVAS_HEIGHT,
                            transform: `scale(${presentationScale})`,
                            transformOrigin: 'top left',
                        }}
                    >
                        {currentSlide.components.sort((a, b) => a.zIndex - b.zIndex).map(item => {
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
                </div>
            </main>

            {/* Controls */}
            <footer className="p-4 flex items-center justify-between bg-black bg-opacity-30">
                <div className="text-lg font-semibold">
                    {presentation.title}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={goToPrevSlide}
                        disabled={currentSlideIndex === 0}
                        className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                        Trang trước
                    </button>
                    <span className="text-lg">
                        {currentSlideIndex + 1} / {slides.length}
                    </span>
                    <button
                        onClick={goToNextSlide}
                        disabled={currentSlideIndex === slides.length - 1}
                        className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                        Trang sau
                    </button>
                </div>
                
            </footer>
        </div>
    );
};

export default PresentationPage;