import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationAppError } from "../common/app-error";
import { i18nValidationMessage } from "nestjs-i18n";

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform<string | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    const convertedVariable = parseFloat(value)

    if (!isNaN(convertedVariable)) {
      return parseFloat(value);
    }

    if (value === undefined || isNaN(convertedVariable)) {
      return undefined;
    }

    throw ValidationAppError(
      {
      messages: [
        {
          message: i18nValidationMessage('validation.invalidNumber')(
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
export class ParseRequiredIntPipe implements PipeTransform<string | undefined> {
  transform(value: string, metadata: ArgumentMetadata) {
    const convertedVariable = parseFloat(value)

    if (!isNaN(convertedVariable)) {
      return parseFloat(value);
    }

    if (value === undefined || isNaN(convertedVariable)) {
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
          message: i18nValidationMessage('validation.invalidNumber')(
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
