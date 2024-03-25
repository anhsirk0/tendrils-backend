import { PaginationResult } from './pagination.result.interface';

export class Pagination<PaginationEntity> {
  public data: Array<PaginationEntity>;
  public pageTotal: number;
  public total: number;

  constructor(paginationResults: PaginationResult<PaginationEntity>) {
    this.data = paginationResults.data;
    this.pageTotal = paginationResults.data.length;
    this.total = paginationResults.total;
  }
}
