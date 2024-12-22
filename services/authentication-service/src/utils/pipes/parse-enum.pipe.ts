import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { AppError, ValidationAppError } from '../common/app-error';
import { hasValue } from '../validators/is-empty.validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@Injectable()
export class ParseOptionalEnumPipe<T> implements PipeTransform<any> {
  constructor(private readonly enumType: any) {}

  transform(value: any, metadata: ArgumentMetadata): T {
    if (!hasValue(value)) return undefined;

    const allowedValues = Object.values(this.enumType);
    
    if (allowedValues.includes(value)) return value as T;

    throw ValidationAppError(
      {
      messages: [
        {
          message: i18nValidationMessage('validation.invalidEnum', { invalidValue: value})(
            { 
              property: metadata.data,
              object: metadata,
              value,
              constraints: [],
              targetName: metadata.data,
            }
          ),
          identifier: `validation.invalidParameter.${metadata.data}`,
        }
      ]
    });
    
  }
}

@Injectable()
export class ParseRequiredEnumPipe<T> implements PipeTransform<any> {
  constructor(private readonly enumType: any) {}

  transform(value: any, metadata: ArgumentMetadata): T {
    const allowedValues = Object.values(this.enumType);
    
    if (allowedValues.includes(value)) return value as T;

    throw ValidationAppError(
      {
      messages: [
        {
          message: i18nValidationMessage('validation.invalidEnum', { invalidValue: value})(
            { 
              property: metadata.data,
              object: metadata,
              value,
              constraints: [],
              targetName: metadata.data,
            }
          ),
          identifier: `validation.invalidParameter.${metadata.data}`,
        }
      ]
    });
  }
}