import { Select } from "antd";
import { useEffect, useState } from "react";
import { gradeApi } from "../grade/gradeApi";
import type { Grade } from "../grade/grade";

export const GradeSelect = ({ value, onChange }: any) => {
  const [grades, setGrades] = useState<Grade[]>([]);


  useEffect(() => {
  gradeApi.getAll().then((grades) => setGrades(grades));
}, []);


  return (
    <Select
      placeholder="Chọn khối lớp"
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      options={grades.map((g) => ({
        value: g.id,
        label: g.gradeName,
      }))}
    />
  );
};
