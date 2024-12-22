import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AppError, ValidationAppError } from "../common/app-error";
import { i18nValidationMessage } from "nestjs-i18n";

@Injectable()
export class ParseOptionalDatePipe implements PipeTransform<string | undefined, Date | undefined> {
    transform(value: string, metadata: ArgumentMetadata) {
        const date = Date.parse(value);
        if (!isNaN(date)) {
          return new Date(value);
        }

        if( value === undefined || isNaN(date)) {
          return undefined;
        }

        throw ValidationAppError(
          {
          messages: [
            {
              message: i18nValidationMessage('validation.invalidDate')(
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
export class ParseRequiredDatePipe implements PipeTransform<string | undefined, Date> {
    transform(value: string, metadata: ArgumentMetadata) {
        const date = Date.parse(value);

        if (!isNaN(date)) {
          return new Date(value);
        }

        if(value === undefined || isNaN(date)) {
          throw ValidationAppError(
            {
            messages: [
              {
                message: i18nValidationMessage('validation.emptyProperty')(
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

        throw ValidationAppError(
          {
          messages: [
            {
              message: i18nValidationMessage('validation.invalidDate')(
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
