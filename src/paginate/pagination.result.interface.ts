export interface PaginationResult<PaginationEntity> {
  data: Array<PaginationEntity>;
  total: number;
  next?: string;
  previous?: string;
}
