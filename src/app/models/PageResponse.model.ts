export interface PageResponse<T> {
  successful: boolean;
  pageNo: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}
