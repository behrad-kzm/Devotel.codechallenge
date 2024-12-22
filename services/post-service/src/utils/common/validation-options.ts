import {
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationAppError } from './app-error';

function deepMapErrors(error: ValidationError, level: number = 0): { message: string, identifier: string }[] {

  if (error.constraints) {
    return [
      {
        message: `${error.value} is not a valid value for the property \'${error.property}\', ${Object.values(error.constraints)[0]}`,
        identifier: `validation.invalidParameter.${error.property}`,
      }
    ];
  }

  if (error.children) {
    return error.children.flatMap(child => deepMapErrors(child, level + 1));
  }

  return [
    {
      message: 'property is invalid',
      identifier: `validation.invalidParameter.${error.property}`,
    }
  ];
}
const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
  ValidationAppError({
    messages: errors.flatMap( error => {
      return deepMapErrors(error);
    }),
  }),
};

export default validationOptions;
