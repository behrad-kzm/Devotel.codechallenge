import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPastDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPastDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === 'string' && new Date(value) < new Date();
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Date must be in the past';
                }
            }
        });
    };
}


export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
      registerDecorator({
          name: 'isPastDate',
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          validator: {
              validate(value: any, args: ValidationArguments) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return typeof value === 'string' && new Date(value) > today;
              },
              defaultMessage(args: ValidationArguments) {
                  return 'Date must be in the past';
              }
          }
      });
  };
}