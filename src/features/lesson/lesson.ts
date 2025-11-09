export interface Lesson {
  id: string;
  lessonName: string;
  requirements: string | null;
  gradeID: string;
  chapterID: string;
  presentationCount: number;
  firstPresentationId: string | null;
}

export type LessonDto = Omit<Lesson, 'id' | 'presentationCount' | 'firstPresentationId'>;
