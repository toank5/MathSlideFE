import React, { useEffect } from "react";
import { Select } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGradeList } from "./gradesSlice";

interface GradeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const GradeSelect: React.FC<GradeSelectProps> = ({
  value,
  onChange,
}) => {
  const dispatch = useAppDispatch();
  const { gradeList, isLoading } = useAppSelector((state) => state.grades);

  useEffect(() => {
    if (gradeList.length === 0) {
      dispatch(fetchGradeList());
    }
  }, [dispatch, gradeList.length]);

  return (
    // GradeSelect.tsx
    <Select
      showSearch
      placeholder="Chọn khối lớp"
      loading={isLoading}
      value={value}
      onChange={onChange}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={gradeList.map((grade) => ({
        value: grade.id,
        label: grade.gradeName,
      }))}
      dropdownMatchSelectWidth={false}
    />
  );
};
