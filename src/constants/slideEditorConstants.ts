import type { ComponentProperties } from "../featurers/slideEditor/types/types";

// Định nghĩa các loại Text có sẵn
export const TEXT_ITEMS = [
    {
        id: 'text-title',
        label: 'Tiêu đề',
        componentType: 'text',
        properties: {
            content: 'Thêm tiêu đề',
            fontSize: 48,
            isBold: true,
            width: 400,
            height: 70,
        } as Partial<ComponentProperties>,
    },
    {
        id: 'text-subtitle',
        label: 'Tiêu đề phụ',
        componentType: 'text',
        properties: {
            content: 'Thêm tiêu đề phụ',
            fontSize: 32,
            isBold: false,
            width: 350,
            height: 50,
        } as Partial<ComponentProperties>,
    },
    {
        id: 'text-body',
        label: 'Nội dung',
        componentType: 'text',
        properties: {
            content: 'Thêm nội dung văn bản...', 
            fontSize: 18,
            isBold: false,
            width: 300,
            height: 100,
        } as Partial<ComponentProperties>,
    },
];

// Định nghĩa các hình khối có sẵn (dưới dạng SVG)
export const SHAPE_ITEMS = [
    {
        id: 'shape-rect',
        label: 'Hình chữ nhật',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect width="100" height="100" fill="#a5b4fc"/></svg>`,
            width: 150,
            height: 100,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-circle',
        label: 'Hình tròn',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><circle cx="50" cy="50" r="50" fill="#a5b4fc"/></svg>`,
            width: 150,
            height: 150,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-triangle',
        label: 'Hình tam giác',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L22 21 H2 Z"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M50 0 L100 100 H0 Z" fill="#a5b4fc"/></svg>`,
            width: 150,
            height: 130,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-line',
        label: 'Đường thẳng',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="11" width="20" height="2" rx="1"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 4" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><rect width="100" height="4" fill="#a5b4fc"/></svg>`,
            width: 200,
            height: 50,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-oval',
        label: 'Hình Elip',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="11" ry="8"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><ellipse cx="50" cy="30" rx="50" ry="30" fill="#a5b4fc"/></svg>`,
            width: 200,
            height: 120,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-right-triangle',
        label: 'Tam giác vuông',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22 V2 H22 Z"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0 100 V0 H100 Z" fill="#a5b4fc"/></svg>`,
            width: 150,
            height: 150,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-hexagon',
        label: 'Hình lục giác',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L22 7 V17 L12 22 L2 17 V7 Z"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 86.6" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M50 0 L100 25 V75 L50 100 L0 75 V25 Z" fill="#a5b4fc"/></svg>`,
            width: 150,
            height: 130,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-star',
        label: 'Hình sao',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 l3.09 6.26 L22 9.27 l-5 4.87 1.18 6.88 L12 17.77 l-6.18 3.25 L7 14.14 2 9.27 l6.91-1.01 L12 2z"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M50 0 L61.8 38.2 H100 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 H38.2 Z" fill="#a5b4fc"/></svg>`,
            width: 150,
            height: 150,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-arrow',
        label: 'Mũi tên',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2 10 H16 L16 7 L22 12 L16 17 L16 14 H2 Z"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0 20 H70 V0 L100 30 L70 60 V40 H0 Z" fill="#a5b4fc"/></svg>`,
            width: 200,
            height: 120,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
    {
        id: 'shape-trapezoid',
        label: 'Hình thang',
        componentType: 'shape',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20 L6 4 H18 L22 20 Z"/></svg>`,
        properties: {
            content: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M10 100 L30 0 H70 L90 100 Z" fill="#a5b4fc"/></svg>`,
            width: 180,
            height: 100,
            backgroundColor: '#a5b4fc'
        } as Partial<ComponentProperties>,
    },
];

// Định nghĩa các công thức mẫu
export const FORMULA_ITEMS = [
    { id: 'formula-fraction', label: 'Phân số', componentType: 'formula', properties: { content: '\\frac{a}{b}', fontSize: 24, width: 100, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-sqrt', label: 'Căn bậc hai', componentType: 'formula', properties: { content: '\\sqrt{x}', fontSize: 24, width: 100, height: 60 } as Partial<ComponentProperties> },
     { id: 'formula-integral', label: 'Tích phân', componentType: 'formula', properties: { content: '\\int_{a}^{b} x^2 dx', fontSize: 24, width: 120, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-sum', label: 'Tổng sigma', componentType: 'formula', properties: { content: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}', fontSize: 24, width: 120, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-power', label: 'Lũy thừa', componentType: 'formula', properties: { content: 'x^n', fontSize: 24, width: 80, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-nth-root', label: 'Căn bậc n', componentType: 'formula', properties: { content: '\\sqrt[n]{x}', fontSize: 24, width: 100, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-limit', label: 'Giới hạn', componentType: 'formula', properties: { content: '\\lim_{x \\to a} f(x)', fontSize: 24, width: 120, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-derivative', label: 'Đạo hàm', componentType: 'formula', properties: { content: '\\frac{dy}{dx}', fontSize: 24, width: 100, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-log', label: 'Logarit', componentType: 'formula', properties: { content: '\\log_{b}(x)', fontSize: 24, width: 100, height: 60 } as Partial<ComponentProperties> },
    { id: 'formula-pythagoras', label: 'Định lý Pytago', componentType: 'formula', properties: { content: 'a^2 + b^2 = c^2', fontSize: 24, width: 150, height: 50 } as Partial<ComponentProperties> },
    { id: 'formula-matrix', label: 'Ma trận', componentType: 'formula', properties: { content: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', fontSize: 24, width: 100, height: 80 } as Partial<ComponentProperties> },
    { id: 'formula-binomial', label: 'Tổ hợp', componentType: 'formula', properties: { content: '\\binom{n}{k}', fontSize: 24, width: 80, height: 80 } as Partial<ComponentProperties> },
    { id: 'formula-vector', label: 'Vector', componentType: 'formula', properties: { content: '\\vec{v}', fontSize: 24, width: 80, height: 50 } as Partial<ComponentProperties> },
    { id: 'formula-quadratic', label: 'Nghiệm bậc hai', componentType: 'formula', properties: { content: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}', fontSize: 24, width: 220, height: 80 } as Partial<ComponentProperties> },
];


// Gom nhóm các section của toolbar
export const TOOLBAR_SECTIONS = [
    {
        title: 'Văn bản',
        items: TEXT_ITEMS,
    },
    {
        title: 'Hình khối & Ảnh',
        items: SHAPE_ITEMS,
    },
    {
        title: 'Công thức',
        items: FORMULA_ITEMS,
    },
];
