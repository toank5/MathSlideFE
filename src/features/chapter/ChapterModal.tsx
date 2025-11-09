import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import type { Chapter, ChapterDto } from "./chapter";
import { GradeSelect } from "../grade/GradeSelect";

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Chapter | ChapterDto) => void;
  editingChapter: Chapter | null;
  isLoading: boolean;
}

export const ChapterModal: React.FC<ChapterModalProps> = ({ isOpen, onClose, onSubmit, editingChapter, isLoading }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<Chapter>();
  const isEditing = !!editingChapter;

  useEffect(() => {
    if (isOpen) {
      reset(editingChapter || { chapterName: "", gradeID: "" });
    }
  }, [isOpen, editingChapter, reset]);

  const handleFormSubmit = (data: Chapter) => {
    const finalData = isEditing ? { ...editingChapter, ...data } : data;
    onSubmit(finalData);
  };

  return (
    <Modal title={isEditing ? "Chỉnh sửa chương" : "Thêm chương mới"} open={isOpen} onCancel={onClose} footer={null} destroyOnClose>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Item label="Tên chương" required validateStatus={errors.chapterName ? "error" : ""} help={errors.chapterName?.message}>
          <Controller name="chapterName" control={control} rules={{ required: "Tên chương là bắt buộc" }} render={({ field }) => <Input {...field} />} />
        </Form.Item>
        <Form.Item label="Khối lớp" required validateStatus={errors.gradeID ? "error" : ""} help={errors.gradeID?.message}>
          <Controller name="gradeID" control={control} rules={{ required: "Khối lớp là bắt buộc" }} render={({ field }) => <GradeSelect {...field} />} />
        </Form.Item>
        <Form.Item className="text-right">
          <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditing ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </Form.Item>
      </form>
    </Modal>
  );
};