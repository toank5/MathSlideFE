import React, { useEffect, useMemo, useState } from "react";
import { Button, Typography, Pagination, Input, Row, Col, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchLessons,
  addLesson,
  editLesson,
  removeLesson,
  openModalForCreate,
  openModalForEdit,
  closeModal,
} from "./lessonsSlice";
import { LessonsTable } from "./LessonsTable";
import { LessonModal } from "./LessonModal";
import type { Lesson, LessonDto } from "./lesson";
import { fetchChapterList } from "../chapter/chapterSlice";
import { fetchGradeList } from "../grade/gradesSlice";
import { GradeSelect } from "../grade/GradeSelect";
import { ChapterSelect } from "../chapter/ChapterSelect";
import { useDebounce } from "@/hooks/useDebounce";

const { Title } = Typography;

const LessonsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pagedLessons, isLoading, isModalOpen, editingLesson } =
    useAppSelector((state) => state.lessons);
  const {
    items: lessons,
    totalItems,
    pageIndex,
    pageSize,
  } = pagedLessons || { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 };
  const { chapterList } = useAppSelector((state) => state.chapters);
  const { gradeList } = useAppSelector((state) => state.grades);

  const [keyword, setKeyword] = useState("");
  const [gradeId, setGradeId] = useState<string | undefined>(undefined);
  const [chapterId, setChapterId] = useState<string | undefined>(undefined);

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    if (gradeList.length === 0) {
      dispatch(fetchGradeList());
    }
    if (chapterList.length === 0) {
      dispatch(fetchChapterList());
    }
  }, [dispatch, gradeList.length, chapterList.length]);

  useEffect(() => {
    dispatch(
      fetchLessons({
        pageIndex: 1,
        pageSize,
        keyword: debouncedKeyword,
        gradeId,
        chapterId,
      })
    );
  }, [dispatch, pageSize, debouncedKeyword, gradeId, chapterId]);

  const lessonsWithDetails = useMemo(() => {
    if (!lessons || !chapterList.length || !gradeList.length) return [];

    return lessons.map((lesson) => {
      const chapter = chapterList.find((c) => c.id === lesson.chapterID);
      const grade = chapter
        ? gradeList.find((g) => g.id === chapter.gradeID)
        : null;

      return {
        ...lesson,
        chapterName: chapter ? chapter.chapterName : "N/A",
        gradeName: lesson.gradeName || (grade ? grade.gradeName : "N/A"),
      };
    });
  }, [lessons, chapterList, gradeList]);

  const handleAdd = () => dispatch(openModalForCreate());
  const handleEdit = (lesson: Lesson) => dispatch(openModalForEdit(lesson));
  const handleDelete = (id: string) => {
    const filters = {
      pageIndex,
      pageSize,
      keyword: debouncedKeyword,
      gradeId,
      chapterId,
    };
    dispatch(removeLesson({ id, filters }));
  };
  const handleModalClose = () => dispatch(closeModal());

  const handleModalSubmit = (data: Lesson | LessonDto) => {
    const filters = {
      pageIndex,
      pageSize,
      keyword: debouncedKeyword,
      gradeId,
      chapterId,
    };

    if ("id" in data && data.id) {
      dispatch(editLesson({ lesson: data as Lesson, filters }));
    } else {
      dispatch(
        addLesson({
          lessonDto: data as LessonDto,
          filters: { ...filters, pageIndex: 1 },
        })
      );
    }
    handleModalClose();
  };

  const handlePageChange = (page: number, size: number) => {
    dispatch(
      fetchLessons({
        pageIndex: page,
        pageSize: size,
        keyword: debouncedKeyword,
        gradeId,
        chapterId,
      })
    );
  };

  const handleGradeChange = (value: string) => {
    setGradeId(value);
    setChapterId(undefined);
  };

  const handleResetFilters = () => {
    setKeyword("");
    setGradeId(undefined);
    setChapterId(undefined);
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
        <Title level={2}>Quản lý Bài học</Title>
        <Button type="primary" onClick={handleAdd}>
          Thêm bài học
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space wrap size="middle">
          <Input.Search
            placeholder="Tìm kiếm theo tên bài học..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <GradeSelect
            value={gradeId}
            onChange={handleGradeChange}
            placeholder="Lọc theo khối lớp"
            allowClear
            style={{ width: 200 }}
            dropdownMatchSelectWidth={false}
          />
          <ChapterSelect
            gradeId={gradeId}
            value={chapterId}
            onChange={(value: string) => setChapterId(value)}
            placeholder="Lọc theo chương"
            disabled={!gradeId}
            allowClear
            style={{ width: 300 }}
            dropdownMatchSelectWidth={false}
          />
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            Reset
          </Button>
        </Space>
      </div>

      <LessonsTable
        lessons={lessonsWithDetails}
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

      <LessonModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        editingLesson={editingLesson}
        isLoading={isLoading}
      />
    </div>
  );
};

export default LessonsPage;
