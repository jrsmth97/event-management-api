export interface IPaginate {
  limit: number;
  page: number;
  search: string;
  total: number;
  order: string;
  orderBy: string;
}

export interface ServicePaginate<T> {
  pagination: IPaginate;
  items: T;
}
