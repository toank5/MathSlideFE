import React, { useEffect, useMemo, useState } from 'react';
import { Button, Typography, Pagination, Input, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchChapters, addChapter, editChapter, removeChapter, openModalForCreate, openModalForEdit, closeModal } from './chapterSlice';
import { ChaptersTable } from './ChapterTable';
import { ChapterModal } from './ChapterModal';
import type { Chapter, ChapterDto } from './chapter';
import { fetchGradeList } from '../grade/gradesSlice';
import { GradeSelect } from '../grade/GradeSelect';
import { useDebounce } from '@/hooks/useDebounce';

const { Title } = Typography;

const ChaptersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pagedChapters, isLoading, isModalOpen, editingChapter } = useAppSelector((state) => state.chapters);
  const { items: chapters, totalItems, pageIndex, pageSize } = pagedChapters || { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 };
  const { gradeList } = useAppSelector((state) => state.grades);

  const [keyword, setKeyword] = useState('');
  const [gradeId, setGradeId] = useState<string | undefined>(undefined);
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    if (gradeList.length === 0) {
      dispatch(fetchGradeList());
    }
  }, [dispatch, gradeList.length]);

  useEffect(() => {
    dispatch(fetchChapters({ pageIndex: 1, pageSize, keyword: debouncedKeyword, gradeId }));
  }, [dispatch, pageSize, debouncedKeyword, gradeId]);

  const chaptersWithGradeName = useMemo(() => {
    if (!chapters || !gradeList.length) return [];
    return chapters.map(chapter => {
      const grade = gradeList.find(g => g.id === chapter.gradeID);
      return { ...chapter, gradeName: grade ? grade.gradeName : 'Không xác định' };
    });
  }, [chapters, gradeList]);

  const handleAdd = () => dispatch(openModalForCreate());
  const handleEdit = (chapter: Chapter) => dispatch(openModalForEdit(chapter));
  const handleModalClose = () => dispatch(closeModal());

  const handleDelete = (id: string) => {
    const filters = { pageIndex, pageSize, keyword: debouncedKeyword, gradeId };
    dispatch(removeChapter({ id, filters }));
  };

  const handleModalSubmit = (data: Chapter | ChapterDto) => {
    const filters = { pageIndex, pageSize, keyword: debouncedKeyword, gradeId };
    if ('id' in data && data.id) {
      dispatch(editChapter({ chapter: data as Chapter, filters }));
    } else {
      dispatch(addChapter({ dto: data as ChapterDto, filters: { ...filters, pageIndex: 1 } }));
    }
    handleModalClose();
  };

  const handlePageChange = (page: number, size: number) => {
    dispatch(fetchChapters({ pageIndex: page, pageSize: size, keyword: debouncedKeyword, gradeId }));
  };

  const handleResetFilters = () => {
    setKeyword('');
    setGradeId(undefined);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Quản lý Chương</Title>
        <Button type="primary" onClick={handleAdd}>Thêm chương</Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space wrap size="middle">
          <Input.Search
            placeholder="Tìm kiếm theo tên chương..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <GradeSelect
            value={gradeId}
            onChange={(value: string) => setGradeId(value)}
            placeholder="Lọc theo khối lớp"
            allowClear
            style={{ width: 200 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            Reset
          </Button>
        </Space>
      </div>

      <ChaptersTable chapters={chaptersWithGradeName} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
      <Pagination current={pageIndex} pageSize={pageSize} total={totalItems} onChange={handlePageChange} style={{ marginTop: 16, textAlign: 'right' }} showSizeChanger />
      <ChapterModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} editingChapter={editingChapter} isLoading={isLoading} />
    </div>
  );
};

export default ChaptersPage;