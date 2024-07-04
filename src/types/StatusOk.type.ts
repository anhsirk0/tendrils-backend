export interface StatusOk<T = any> {
  status: 200 | 201 | 202 | 203; // etc etc
  message: string;
  data?: T;
}
