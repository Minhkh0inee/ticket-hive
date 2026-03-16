import {
    Injectable, NestInterceptor, ExecutionContext,
    CallHandler
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface SuccessResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    path: string;
  }
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();
  
      return next.handle().pipe(
        map((data) => ({
          statusCode: response.statusCode,
          message: 'Success',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        })),
      );
    }
  }