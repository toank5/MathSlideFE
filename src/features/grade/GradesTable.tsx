import React from "react";
import { Table, Button, Space, Popconfirm, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Grade } from "./grade";

interface GradesTableProps {
  grades: Grade[];
  isLoading: boolean;
  onEdit: (grade: Grade) => void;
  onDelete: (id: string) => void;
}

export const GradesTable: React.FC<GradesTableProps> = ({
  grades,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<Grade> = [
    {
      title: "Thứ tự",
      dataIndex: "displayOrder",
      key: "displayOrder",
      width: 100,
      align: "center",
    },
    {
      title: "Tên khối lớp",
      dataIndex: "gradeName",
      key: "gradeName",
    },
    {
      title: "Ảnh nền",
      dataIndex: "backgroundUrl",
      key: "backgroundUrl",
      render: (url: string | null) =>
        url ? (
          <Image
            src={url}
            alt="Ảnh nền"
            width={80}
            height={50}
            style={{ objectFit: "cover", borderRadius: 4 }}
            preview={false}
          />
        ) : (
          <span style={{ color: "#999" }}>Chưa có</span>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: any, record: Grade) => (
        <Space size="middle">
          <Button type="link" onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa khối lớp này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<Grade>
      columns={columns}
      dataSource={grades}
      rowKey={(record) => record.id}
      loading={isLoading}
      pagination={false}
      bordered
    />
  );
};
