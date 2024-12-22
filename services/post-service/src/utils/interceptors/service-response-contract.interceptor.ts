import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IServiceResponseContract } from '../../contracts';

@Injectable()
export class ServiceResponseInterceptor<T>
  implements NestInterceptor<T, IServiceResponseContract>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<IServiceResponseContract> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((data) => {
        const status = response.statusCode || 200;
        return {
          status,
          data,
        };
      }),
    );
  }
}