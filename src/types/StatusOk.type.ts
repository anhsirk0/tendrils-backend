export interface StatusOk<T = any> {
  status: number;
  message: string;
  data?: T;
}
