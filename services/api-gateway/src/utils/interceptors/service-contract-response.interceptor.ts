import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import { IServiceResponseContract } from 'src/contracts';

@Injectable()
export class ServiceContractResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result: IServiceResponseContract) => {
        // Ensure the response follows IServiceResponseContract
        if (!result || typeof result.status !== 'number') {
          return result; // Pass through if no specific contract is returned
        }

        const { status, data } = result;

        // Handle Client Errors (4XX)
        if (status >= HttpStatus.BAD_REQUEST && status < HttpStatus.INTERNAL_SERVER_ERROR) {
          throw new HttpException(data || 'Unknown Client Error', status);
        }

        // Handle Server Errors (5XX)
        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
          throw new HttpException(data || 'Unknown Server Error', status);
        }

        // Return only the `data` property for successful responses
        return data;
      }),
      catchError((err) => {
        // Catch and rethrow errors for centralized handling
        return throwError(() => err);
      }),
    );
  }
}
