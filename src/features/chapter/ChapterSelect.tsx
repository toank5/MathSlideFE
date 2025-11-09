import React, { useEffect } from "react";
import { Select } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// <<< 2. IMPORT CÁC ACTION TỪ ĐÚNG SLICE
import {
  fetchChaptersByGrade,
  clearChaptersForSelection,
} from "../chapter/chapterSlice";

interface ChapterSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  gradeId?: string;
}

export const ChapterSelect: React.FC<ChapterSelectProps> = ({
  value,
  onChange,
  gradeId,
}) => {
  const dispatch = useAppDispatch();
  const { chaptersForSelection, isLoading } = useAppSelector(
    (state) => state.chapters
  );

  useEffect(() => {
    if (gradeId) {
      dispatch(fetchChaptersByGrade(gradeId));
    } else {
      dispatch(clearChaptersForSelection());
    }
  }, [dispatch, gradeId]);

  return (
    // ChapterSelect.tsx
    <Select
      showSearch
      placeholder={gradeId ? "Chọn chương" : "Vui lòng chọn khối lớp trước"}
      loading={isLoading}
      value={chaptersForSelection.length > 0 ? value : undefined}
      onChange={onChange}
      disabled={!gradeId || isLoading}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={chaptersForSelection.map((chapter) => ({
        value: chapter.id,
        label: chapter.chapterName,
      }))}
      dropdownMatchSelectWidth={false}
    />
  );
};
