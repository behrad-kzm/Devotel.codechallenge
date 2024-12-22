import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { AppError, ValidationAppError } from "../common/app-error";
import { i18nValidationMessage } from "nestjs-i18n";

@Injectable()
export class ParseRequiredPaymentIntentIdPipe implements PipeTransform<string | undefined> {
  private readonly regex = /^pi_[a-zA-Z0-9]{14,}$/;

  transform(value: string, metadata: ArgumentMetadata) {
    
    if (this.regex.test(value)) {
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
