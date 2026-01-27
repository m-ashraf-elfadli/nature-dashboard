export interface PaginationResponse<T> {
  status: string;
  message: string;
  result: T[];
  page?: number;
  size?: number;
  total?: number;
  lastPage?: number;
}

export interface PaginationObj{
  page:number;
  size:number;
}
export interface DropDownOption {
  name: string;
  id: any;
  logo?:string
}
