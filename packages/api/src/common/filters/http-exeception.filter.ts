import {
    ExceptionFilter, Catch, ArgumentsHost,
    HttpException, HttpStatus, Logger
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const isHttpException = exception instanceof HttpException;
      const status = isHttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const exceptionResponse = isHttpException
        ? (exception.getResponse() as any)
        : null;
  
      const message = isHttpException
        ? exceptionResponse?.message ?? exception.message
        : 'Internal server error';
  
      const error = isHttpException
        ? exceptionResponse?.error ?? 'Error'
        : 'Internal Server Error';
  
      if (!isHttpException) {
        this.logger.error(exception);
      }
  
      response.status(status).json({
        statusCode: status,
        message,
        error,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }