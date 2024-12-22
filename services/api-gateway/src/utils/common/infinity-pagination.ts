import { IPaginationOptions } from '../types/pagination-options';

export const infinityPagination = <T>(
  data: T[],
  count: number,
  options: IPaginationOptions,
) => {
  return {
    data,
    count,
    hasNextPage: data.length === options.limit,
  };
};
