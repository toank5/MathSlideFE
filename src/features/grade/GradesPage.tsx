import React, { useEffect } from "react";
import { Button, Typography, Pagination } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchGrades,
  addGrade,
  editGrade,
  removeGrade,
  openModalForCreate,
  openModalForEdit,
  closeModal,
} from "./gradesSlice";

import { GradesTable } from "./GradesTable";
import { GradeModal } from "./GradeModal";
import type { Grade, GradeDto } from "./grade";

const { Title } = Typography;

const GradesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pagedGrades, isLoading, isModalOpen, editingGrade } = useAppSelector(
    (state) => state.grades
  );
  const { items, totalItems, pageIndex, pageSize } = pagedGrades || { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 };

  useEffect(() => {
    dispatch(fetchGrades({ pageIndex, pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  const handleAdd = () => dispatch(openModalForCreate());
  const handleEdit = (school: Grade) => dispatch(openModalForEdit(school));
  const handleDelete = (id: string) => dispatch(removeGrade(id));
  const handleModalClose = () => dispatch(closeModal());

  const handleModalSubmit = (data: Grade | GradeDto) => {
    if ("id" in data && data.id) {
      dispatch(editGrade(data as Grade));
    } else {
      dispatch(addGrade(data as GradeDto));
    }
    handleModalClose();
  };

  const handlePageChange = (page: number, size: number) => {
    dispatch(fetchGrades({ pageIndex: page, pageSize: size }));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Quản lý khối lớp</Title>
        <Button type="primary" onClick={handleAdd}>
          Thêm khối lớp mới
        </Button>
      </div>

      <GradesTable
        grades={items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        current={pageIndex}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "right" }}
        showSizeChanger
      />

      <GradeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        editingGrade={editingGrade}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GradesPage;
