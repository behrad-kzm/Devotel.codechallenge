import { HttpStatus } from "@nestjs/common";
import { ServerError } from "../common/app-error";

export function ConditionalExecution(isActive: boolean, error?: HttpStatus) {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (isActive) {
        return originalMethod.apply(this, args);
      } else {
        console.log(`Not active: ${propertyKey}`);
        if (error) {
          throw ServerError({
            status: error,
            message: 'Service is not active',
          })
        }
        return;
      }
    };
    return descriptor;
  };
}