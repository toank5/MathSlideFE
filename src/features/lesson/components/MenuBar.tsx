import React from 'react';
import type { Editor } from '@tiptap/react';
// <<< 1. IMPORT CÁC ICON CẦN DÙNG
import {
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
} from 'react-icons/fa';

export const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-menu-bar">
      {/* <<< 2. THAY THẾ TEXT BẰNG COMPONENT ICON */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <FaListUl />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <FaListOl />
      </button>
    </div>
  );
};