import { Select } from "antd";
import { useEffect, useState } from "react";
import type { School } from "./school";
import { schoolApi } from "./schoolApi";

export const SchoolSelect = ({ value, onChange }: any) => {
  const [grades, setschools] = useState<School[]>([]);


  useEffect(() => {
  schoolApi.getAll().then((schools) => setschools(schools));
}, []);


  return (
    <Select
      placeholder="Chọn trường"
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      options={grades.map((g) => ({
        value: g.id,
        label: g.schoolName,
      }))}
    />
  );
};
