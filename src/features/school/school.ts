export interface School {
  id: string;
  schoolName: string;
  address: string | null;
  schoolCode: string;
}

export type SchoolDto = Omit<School, 'id'>;

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
}

export interface SchoolDropdown {
  id: string;
  schoolName: string;
}