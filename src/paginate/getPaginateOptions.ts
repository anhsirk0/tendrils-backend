import { Request } from 'express';
import { PaginationOptions } from './pagination.options.interface';
import { Some } from 'src/helpers';

function getPaginateOptions(query: Request['query']): PaginationOptions {
  return {
    take: Some.Number(query?.take, 10),
    skip: Some.Number(query?.skip),
  };
}

export default getPaginateOptions;
