// --- BE-Aligned Types --- //

// Các thuộc tính đã được parse từ chuỗi JSON của BE
export interface ComponentProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  rotation: number;
  fontSize: number;
  color: string;
  backgroundColor: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

// Đại diện cho một Component từ BE
export interface CanvasComponent {
  id: string; // Guid
  slideId: string; // Guid
  componentType: 'text' | 'image' | 'formula' | string;
  properties: ComponentProperties; // FE sẽ parse chuỗi JSON từ BE
  zIndex: number;
}

// Đại diện cho một Slide từ BE
export interface Slide {
  id: string; // Guid
  presentationId: string; // Guid
  pageNumber: number;
  components: CanvasComponent[];
}

// Đại diện cho một Presentation từ BE
export interface Presentation {
    id: string; // Guid
    title: string;
    userId: string; // Guid
    lessonId: string; // Guid
    slides: Slide[];
}


// --- Redux State --- //

export interface PresentState {
  presentation: Presentation | null;
  activeSlideId: string | null;
  saveStatus: 'idle' | 'saving' | 'succeeded' | 'failed';
}

export interface SlideEditorState {
  past: PresentState[];
  present: PresentState;
  future: PresentState[];
}


// --- UI-Specific Types --- //

// Kiểu dữ liệu cho các mục trên thanh công cụ
export interface ToolbarItem {
  id: 'text' | 'image' | 'formula';
  label: string;
  content: string;
}

// Kiểu dữ liệu cho Context Menu
export interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    itemId: string | null;
}
