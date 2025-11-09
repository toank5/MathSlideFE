import { PagedRequestParams } from "@/types/BaseRequest";

export const DEFAULT_PARAMS: PagedRequestParams = {
  pageNumber: 1,
  pageSize: 5,
  search: undefined,
  filters: [],
  sortOrders: [],
} satisfies PagedRequestParams;
