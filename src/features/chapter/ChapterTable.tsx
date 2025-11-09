import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import type { Chapter } from './chapter';

interface ChaptersTableProps {
  chapters: Chapter[];
  isLoading: boolean;
  onEdit: (chapter: Chapter) => void;
  onDelete: (id: string) => void;
}

export const ChaptersTable: React.FC<ChaptersTableProps> = ({ chapters, isLoading, onEdit, onDelete }) => {
  const columns = [
    { title: 'Tên Chương', dataIndex: 'chapterName', key: 'chapterName' },
    
    { title: 'Khối Lớp', dataIndex: 'gradeName', key: 'gradeName' },
    
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: Chapter) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa chương này?" onConfirm={() => onDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={chapters} rowKey="id" loading={isLoading} pagination={false} />;
};