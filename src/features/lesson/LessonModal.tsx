import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useForm, Controller, useWatch } from "react-hook-form";
import type { Lesson, LessonDto } from "./lesson";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { MenuBar } from "./components/MenuBar";
import { GradeSelect } from "../grade/GradeSelect";
import { ChapterSelect } from "../chapter/ChapterSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearChaptersForSelection,
  fetchChaptersByGrade,
} from "../chapter/chapterSlice";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Lesson | LessonDto) => void;
  editingLesson: Lesson | null;
  isLoading: boolean;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingLesson,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<Lesson>();

  const { chapterList } = useAppSelector((state) => state.chapters);
  const isEditing = !!editingLesson;
  const dispatch = useAppDispatch();
  const gradeID = watch("gradeID");

  useEffect(() => {
    if (isOpen) {
      if (isEditing && editingLesson) {
        const chapter = chapterList.find(c => c.id === editingLesson.chapterID);
        
        if (chapter) {
          const lessonDataForForm = {
            ...editingLesson,
            gradeID: chapter.gradeID,
          };
          reset(lessonDataForForm);
        } else {
          reset(editingLesson);
        }
      } else {
        reset({ lessonName: '', requirements: '', gradeID: undefined, chapterID: undefined });
      }
    }
  }, [isOpen, isEditing, editingLesson, reset, chapterList]);

  useEffect(() => {
    if (!isEditing) {
      setValue('chapterID', ''); 
      dispatch(clearChaptersForSelection());
    }
  }, [gradeID, setValue, dispatch, isEditing]);

  const handleFormSubmit = (data: Lesson) => {
    onSubmit(data);
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Item
          label="Tên bài học"
          required
          validateStatus={errors.lessonName ? "error" : ""}
          help={errors.lessonName?.message}
        >
          <Controller
            name="lessonName"
            control={control}
            rules={{ required: "Tên bài học là bắt buộc" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item label="Yêu cầu">
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <TiptapEditor value={field.value || ""} onChange={field.onChange} />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Khối lớp"
          required
          validateStatus={errors.gradeID ? "error" : ""}
          help={errors.gradeID?.message}
          style={{ marginTop: "30px" }}
        >
          <Controller
            name="gradeID"
            control={control}
            rules={{ required: "Khối lớp là bắt buộc" }}
            render={({ field }) => <GradeSelect {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Chương"
          required
          validateStatus={errors.chapterID ? "error" : ""}
          help={errors.chapterID?.message}
          style={{ marginTop: "10px" }}
        >
          <Controller
            name="chapterID"
            control={control}
            rules={{ required: "Chương là bắt buộc" }}
            render={({ field }) => <ChapterSelect {...field} gradeId={gradeID} />}
          />
        </Form.Item>

        <Form.Item className="text-right">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditing ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </Form.Item>
      </form>
    </Modal>
  );
};

const TiptapEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const CustomDocument = Document.extend({
    content: "block+",
  });

  const editor = useEditor({
    extensions: [
      CustomDocument,
      Paragraph,
      Text,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      ListItem,
    ],
    editorProps: {
      attributes: {
        class: "rich-text-content",
        spellcheck: "false",
      },
    },
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
