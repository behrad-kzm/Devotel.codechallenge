import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppError } from '../utils/common/app-error';
import { I18nService } from 'nestjs-i18n';
import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from '../user/enums/user-roles.enum';


export const SetRequiredRoles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly i18nService: I18nService,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<USER_ROLE[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (request.user?.role === USER_ROLE.SUPER_USER) {
      return true;
    }

    if (roles.includes(request.user?.role)) {
      return true;
    }
    throw AppError(
      this.i18nService,
      {
        status: HttpStatus.UNAUTHORIZED,
        identifiers: ['auth.notAuthorized']
      }
    )
  }
}
