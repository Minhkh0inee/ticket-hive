export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
}
