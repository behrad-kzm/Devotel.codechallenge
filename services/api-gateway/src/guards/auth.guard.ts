import { CanActivate, ExecutionContext, Inject, Injectable, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AppError } from '../utils/common/app-error';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { IServiceResponseContract } from 'src/contracts';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly i18nService: I18nService,
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw AppError(
        this.i18nService, 
        { 
          status: HttpStatus.UNAUTHORIZED, 
          identifiers: ['auth.notAuthorized']
        } 
      )
    }
    const userTokenInfo: IServiceResponseContract = await firstValueFrom(
      this.authServiceClient.send('auth.verify.firebase.idToken', {
        idToken: request.headers.authorization,
      }),
    );
    
    if (!userTokenInfo || userTokenInfo.status != 200) {
      throw AppError(this.i18nService, {
        status: HttpStatus.UNAUTHORIZED,
        identifiers: ['auth.notAuthorized'],
      });
    }

    request.user = {
      sub: userTokenInfo.data.sub
    }

    const user: IServiceResponseContract = await firstValueFrom(
      this.userServiceClient.send('user.find.one', {
        sub: userTokenInfo.data.sub,
      }),
    );

    if (user && user.status == 200) {
      request.user = {
        ...user.data,
        ...request.user
      };
    }

    return true;
  }
}
