export interface Chapter {
  id: string;
  chapterName: string;
  gradeID: string;
}

export type ChapterDto = Omit<Chapter, 'id'>;