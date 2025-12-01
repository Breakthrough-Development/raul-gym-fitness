/** Pagination state with current page and page size */
export type PageAndSize = {
  page: number;
  size: number;
};

export type PaginatedData<T> = {
  list: T[];
  metadata: {
    count: number;
    hasNextPage: boolean;
    cursor?: { id: string; createdAt: number };
  };
};

/** Shorthand for PaginatedData metadata */
export type PaginatedMetaData = PaginatedData<unknown>["metadata"];
