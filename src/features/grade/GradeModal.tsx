import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, InputNumber } from "antd";
import { useForm, Controller } from "react-hook-form";
import type { Grade, GradeDto } from "./grade";
import { UploadOutlined } from "@ant-design/icons";

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Grade | GradeDto) => void;
  editingGrade: Grade | null;
  isLoading: boolean;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGrade,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GradeDto>();
  const [fileList, setFileList] = useState<any[]>([]);
  const isEditing = !!editingGrade;

  useEffect(() => {
    if (isOpen) {
      if (editingGrade) {
        reset(editingGrade);
        if (editingGrade.backgroundUrl) {
          setFileList([
            {
              uid: "-1",
              name: editingGrade.backgroundFileName || "background.png",
              status: "done",
              url: editingGrade.backgroundUrl,
            },
          ]);
        }
      } else {
        reset({ gradeName: "", displayOrder: 0, backgroundImage: null });
        setFileList([]);
      }
    }
  }, [isOpen, editingGrade, reset]);

  const handleFormSubmit = (data: GradeDto) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      data.backgroundImage = fileList[0].originFileObj;
    }

    const finalData = isEditing ? { ...editingGrade, ...data } : data;
    onSubmit(finalData);
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa thông tin lớp" : "Thêm lớp mới"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Item
          label="Tên lớp"
          required
          validateStatus={errors.gradeName ? "error" : ""}
          help={errors.gradeName?.message}
        >
          <Controller
            name="gradeName"
            control={control}
            rules={{ required: "Tên lớp là bắt buộc" }}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Thứ tự"
          required
          validateStatus={errors.displayOrder ? "error" : ""}
          help={errors.displayOrder?.message}
        >
          <Controller
            name="displayOrder"
            control={control}
            rules={{
              required: "Thứ tự là bắt buộc",
              min: { value: 1, message: "Phải >= 1" },
            }}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={1}
                style={{ width: "100%" }}
                value={field.value ?? 1}
                onChange={(val) => field.onChange(val ?? 1)}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Ảnh nền">
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {isEditing && !fileList.length && editingGrade?.backgroundUrl && (
            <img
              src={editingGrade.backgroundUrl}
              alt="Ảnh nền cũ"
              style={{ maxWidth: 100, marginTop: 10 }}
            />
          )}
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
