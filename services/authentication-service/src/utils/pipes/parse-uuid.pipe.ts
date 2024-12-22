import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AppError, ValidationAppError } from "../common/app-error";
import { validate as isValidUUID } from 'uuid';
import { i18nValidationMessage } from "nestjs-i18n";

@Injectable()
export class ParseOptionalUUIDPipe implements PipeTransform<string | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {

    if (value === undefined) {
      return undefined;
    }

    if (isValidUUID(value)) {
      return value;
    }

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
}

@Injectable()
export class ParseRequiredUUIDPipe implements PipeTransform<string | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (isValidUUID(value)) {
      return value;
    }

    if (value === undefined) {
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
          message: i18nValidationMessage('validation.invalidUUID')(
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
