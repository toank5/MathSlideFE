import React, { useEffect, useState } from 'react';
import { Button, Typography, Pagination, Input, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSchools,
  addSchool,
  editSchool,
  removeSchool,
  openModalForCreate,
  openModalForEdit,
  closeModal,
} from './schoolsSlice';

import { SchoolsTable } from './SchoolsTable';
import { SchoolModal } from './SchoolModal';
import type { School, SchoolDto } from './school';
import { useDebounce } from '@/hooks/useDebounce';
const { Title } = Typography;

const SchoolsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pagedSchools, isLoading, isModalOpen, editingSchool } = useAppSelector((state) => state.schools);
  const { items, totalItems, pageIndex, pageSize } = pagedSchools || { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 };

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    dispatch(fetchSchools({ pageIndex: 1, pageSize, keyword: debouncedKeyword }));
  }, [dispatch, pageSize, debouncedKeyword]);

  const handleAdd = () => dispatch(openModalForCreate());
  const handleEdit = (school: School) => dispatch(openModalForEdit(school));
  const handleModalClose = () => dispatch(closeModal());

  const handleDelete = (id: string) => {
    const filters = { pageIndex, pageSize, keyword: debouncedKeyword };
    dispatch(removeSchool({ id, filters }));
  };

  const handleModalSubmit = (data: School | SchoolDto) => {
    const filters = { pageIndex, pageSize, keyword: debouncedKeyword };
    if ('id' in data && data.id) {
      dispatch(editSchool({ school: data as School, filters }));
    } else {
      dispatch(addSchool({ schoolDto: data as SchoolDto, filters: { ...filters, pageIndex: 1 } }));
    }
    handleModalClose();
  };

  const handlePageChange = (page: number, size: number) => {
    dispatch(fetchSchools({ pageIndex: page, pageSize: size, keyword: debouncedKeyword }));
  };
  
  const handleResetFilters = () => {
    setKeyword('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Quản lý Trường học</Title>
        <Button type="primary" onClick={handleAdd}>Thêm trường mới</Button>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Space wrap size="middle">
          <Input.Search
            placeholder="Tìm kiếm theo tên trường..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ width: 350 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            Reset
          </Button>
        </Space>
      </div>

      <SchoolsTable schools={items} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
      
      <Pagination
        current={pageIndex}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: 'right' }}
        showSizeChanger
      />
      
      <SchoolModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        editingSchool={editingSchool}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SchoolsPage;