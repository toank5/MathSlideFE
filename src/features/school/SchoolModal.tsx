import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import type { School, SchoolDto } from "./school";
import { useEffect } from "react";

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: School | SchoolDto) => void;
  editingSchool: School | null;
  isLoading: boolean;
}

export const SchoolModal: React.FC<SchoolModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingSchool,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<School>({
    defaultValues: editingSchool || {
      schoolName: "",
      schoolCode: "",
      address: "",
    },
  });

  const isEditing = !!editingSchool;

  useEffect(() => {
    if (isOpen) {
      reset(editingSchool || { schoolName: "", schoolCode: "", address: "" });
    }
  }, [isOpen, editingSchool, reset]);

  const handleFormSubmit = (data: School) => {
    const finalData = isEditing ? { ...editingSchool, ...data } : data;
    onSubmit(finalData);
  };

  return (
    <Modal
      title={
        isEditing ? "Chỉnh sửa thông tin trường học" : "Thêm trường học mới"
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Item
          label="Tên trường"
          required
          validateStatus={errors.schoolName ? "error" : ""}
          help={errors.schoolName?.message}
        >
          <Controller
            name="schoolName"
            control={control}
            rules={{ required: "Tên trường là bắt buộc" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Mã trường"
          required
          validateStatus={errors.schoolCode ? "error" : ""}
          help={errors.schoolCode?.message}
        >
          <Controller
            name="schoolCode"
            control={control}
            rules={{ required: "Mã trường là bắt buộc" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item label="Địa chỉ">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input {...field} value={field.value ?? ""} />
            )}
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
