import { Select } from "antd";
import { useEffect, useState } from "react";
import { chapterApi } from "../chapter/chapterApi";
import type { Chapter } from "../chapter/chapter";

export const ChapterSelect = ({ gradeId, value, onChange }: any) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!gradeId) {
      setChapters([]);
      return;
    }
    chapterApi.getByGradeId(gradeId).then((data) => setChapters(data));
  }, [gradeId]);

  return (
    <Select
      placeholder="Chọn chương"
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      disabled={!gradeId}
      options={chapters.map((c) => ({
        value: c.id,
        label: c.chapterName,
      }))}
    />
  );
};
