import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import type { School } from './school';

interface SchoolsTableProps {
  schools: School[];
  isLoading: boolean;
  onEdit: (school: School) => void;
  onDelete: (id: string) => void;
}

export const SchoolsTable: React.FC<SchoolsTableProps> = ({ schools, isLoading, onEdit, onDelete }) => {
  const columns = [
    { title: 'Tên trường', dataIndex: 'schoolName', key: 'schoolName' },
    { title: 'Mã trường', dataIndex: 'schoolCode', key: 'schoolCode' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: School) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa trường này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={schools} rowKey="id" loading={isLoading} pagination={false} />;
};