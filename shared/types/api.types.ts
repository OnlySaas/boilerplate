export namespace ApiTypes {
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }

  export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }

  export interface ErrorResponse {
    success: boolean;
    message: string;
    error: string;
  }

  export interface QueryOptions {
    enabled?: boolean;
  }
}
