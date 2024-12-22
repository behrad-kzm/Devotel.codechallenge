import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger } from '../common/logger';
import { generateNewUUID } from '../common/generate-random-key';
import { IServiceErrorContract, IServiceResponseContract } from '../../contracts';

@Catch()
export class TcpExceptionFilter extends BaseExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost): Promise<IServiceResponseContract> {
    const trackId = generateNewUUID();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const defaultError: IServiceErrorContract = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [{ message: 'Unknown Error', identifier: 'unknown.error' }],
    };
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() as IServiceErrorContract : defaultError;

    // Log error details
    try {
      await Logger.logResponseError({
        exception,
        isCritical: status >= 500,
        status,
        metaInfo: {
          trackId,
          exceptionResponse, // Log the request payload
        },
      });
    } catch (error) {
      // Logging failure handling (no action needed)
    }

    // Format the response to match IServiceCommunication
    return {
      status,
      data: {
        trackId,
        ...exceptionResponse,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
