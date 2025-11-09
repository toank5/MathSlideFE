export interface Grade {
  id: string;
  gradeName: string;
  displayOrder: number;
  backgroundFileName?: string | null;
  backgroundUrl?: string | null;
}

export interface GradeDto {
  gradeName: string;
  displayOrder: number;
  backgroundImage?: File | null;
}


export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
}