import { HttpStatusCode } from "axios";

export enum FilterOperator {
  Equals = 1,
  NotEquals = 2,
  GreaterThan = 3,
  GreaterThanOrEqual = 4,
  LessThan = 5,
  LessThanOrEqual = 6,
  Contains = 7,
  StartsWith = 8,
  EndsWith = 9,
  In = 10,
}

export interface FilterCriterion {
  fieldName: string;
  operator: FilterOperator;
  value: any;
}

export interface SortDescriptor {
  fieldName: string;
  isDescending?: boolean;
}

export interface BaseRequest {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  searchFields?: string[];
  filters?: FilterCriterion[];
  sortOrders?: SortDescriptor[];
}

export interface BaseResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
  error?: string[] | null;
  correlationId?: string | null;
  httpStatusCode?: HttpStatusCode;
}

// export interface PagedList<T> {
//   items: T[];
//   totalItems: number;
//   pageIndex: number;
//   pageSize: number;     
//   totalPages: number;
//   hasPreviousPage: boolean;
//   hasNextPage: boolean;
// }
