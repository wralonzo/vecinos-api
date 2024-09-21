type SearchResultWithPagination<T> = {
  data: Array<T>;
  count: number;
};

type Pagination = {
  page: number;
  pageSize: number;
};

interface PaginationResult<T> {
  data: T[];
  count: number;
  pageCount: number;
  currentPage: number;
}

export { SearchResultWithPagination, Pagination, PaginationResult };
