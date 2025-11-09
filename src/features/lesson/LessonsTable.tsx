import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Modal } from "antd";
import type { Lesson } from "./lesson";
import { Link, useNavigate } from "react-router-dom";

interface EnrichedLesson extends Lesson {
  chapterName: string;
  gradeName: string;
}

interface LessonsTableProps {
  lessons: EnrichedLesson[];
  isLoading: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

export const LessonsTable: React.FC<LessonsTableProps> = ({
  lessons,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState("");

  const showRequirementModal = (htmlContent: string) => {
    setSelectedRequirement(htmlContent);
    setIsRequirementModalOpen(true);
  };

  const handleRequirementModalClose = () => {
    setIsRequirementModalOpen(false);
    setSelectedRequirement("");
  };


  const handleCreatePresentation = (lessonId: string) => {
    console.log("Tạo presentation cho lesson:", lessonId);
  };

  const columns = [
    { title: "Tên bài học", dataIndex: "lessonName", key: "lessonName" },
    { title: 'Khối lớp', dataIndex: 'gradeName', key: 'gradeName' },
    { title: 'Chương', dataIndex: 'chapterName', key: 'chapterName' },
    {
      title: "Yêu cầu",
      dataIndex: "requirements",
      key: "requirements",
      render: (text: string | null) => {
        if (!text || text.trim() === '<p></p>' || text.trim() === '') {
            return <span>Không có</span>;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const plainText = tempDiv.textContent || tempDiv.innerText || "";
        const previewText = plainText.substring(0, 50);

        if (plainText.length > 50) {
          return (
            <span 
              onClick={() => showRequirementModal(text)} 
              style={{ color: '#1677ff', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {`${previewText}... Xem thêm`}
            </span>
          );
        }

        return (
          <div 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: text }} 
          />
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Lesson) => (
        <Space size="middle">
          {record.presentationCount > 0 ? (
            <Link to={`/slide-editor/${record.firstPresentationId}`}>
              <Button type="default">Xem Slide</Button>
            </Link>
          ) : (
            <Button
              type="primary"
              onClick={() => handleCreatePresentation(record.id)}
            >
              Tạo Slide
            </Button>
          )}

          <Button onClick={() => onEdit(record)}>Sửa</Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa bài học này?"
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

  return (
    <>
      <Table
        columns={columns}
        dataSource={lessons}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title="Nội dung Yêu cầu chi tiết"
        open={isRequirementModalOpen}
        onCancel={handleRequirementModalClose}
        footer={[
          <Button key="close" type="primary" onClick={handleRequirementModalClose}>
            Đóng
          </Button>,
        ]}
      >
        <div 
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: selectedRequirement }} 
        />
      </Modal>
    </>
  );
};