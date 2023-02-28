import { HttpResponse } from '../interfaces/http-response.interface';

export class ResponseBuilder {
  public static SuccessResponse(
    message: string,
    statusCode: number,
    data?: any,
  ): HttpResponse {
    return {
      success: true,
      message: message,
      statusCode: statusCode,
      data: data,
    };
  }

  public static ErrorResponse(
    message: string,
    statusCode: number,
    error?: any,
  ): HttpResponse {
    return {
      success: false,
      message: message,
      statusCode: statusCode,
      data: null,
      error: error,
    };
  }
}
