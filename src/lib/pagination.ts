export interface PaginationParams {
    page?: number
    pageSize?: number
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export function getPagination({ page = 1, pageSize = 10 }: PaginationParams) {
    const skip = (page - 1) * pageSize
    const take = pageSize
    return { skip, take }
}


export function buildPaginatedResponse<T>(
    data: T[],
    total: number,
    pagination?: PaginationParams
  ) : PaginatedResponse<T>
  {
    
    const page = pagination?.page ?? 1
    const pageSize = pagination?.pageSize ?? 10
  
    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total
    }
  }