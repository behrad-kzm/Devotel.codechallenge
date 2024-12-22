import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationAppError } from '../common/app-error';
import { hasValue } from '../validators/is-empty.validator';
import { i18nValidationMessage } from 'nestjs-i18n';

type EnumArray<T> = T[];

@Injectable()
export class ParseOptionalEnumArrayPipe<T> implements PipeTransform<any> {
  constructor(
    readonly enumType: any
  ) {}

  transform(value: any, metadata: ArgumentMetadata): EnumArray<T> {
    if (!hasValue(value) || value.length === 0) return undefined;

    const allowedValues = Object.values(this.enumType);
    
    if (allowedValues.includes(value)) return [value as T];
    if (!this.isEnumArray(value)) {
      throw ValidationAppError(
        {
        messages: [
          {
            message: i18nValidationMessage('validation.invalidEnumArray')(
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

    const invalidValues = value.filter(val => !allowedValues.includes(val));
    if (invalidValues.length > 0) {
      throw ValidationAppError(
        {
        messages: [
          {
            message: i18nValidationMessage('validation.invalidEnums', { invalidValues: invalidValues.join(', ')})(
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
    return value;
  }

  private isEnumArray(value: any): value is EnumArray<T> {
    return Array.isArray(value) && value.every(val => typeof val === 'string');
  }
}

@Injectable()
export class ParseRequiredEnumArrayPipe<T> implements PipeTransform<any> {
  constructor(
    private readonly enumType: any
  ) {}

  transform(value: any, metadata: ArgumentMetadata): EnumArray<T> {
    if (!this.isEnumArray(value)) {
      throw ValidationAppError(
        {
        messages: [
          {
            message: i18nValidationMessage('validation.invalidEnumArray')(
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
    const allowedValues = Object.values(this.enumType);
    const invalidValues = value.filter(val => !allowedValues.includes(val));
    if (invalidValues.length > 0) {
      throw ValidationAppError(
        {
        messages: [
          {
            message: i18nValidationMessage('validation.invalidEnums')(
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
    return value;
  }

  private isEnumArray(value: any): value is EnumArray<T> {
    return Array.isArray(value) && value.every(val => typeof val === 'string');
  }
}