export interface HttpResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error?: any[];
  data?: any;
}
