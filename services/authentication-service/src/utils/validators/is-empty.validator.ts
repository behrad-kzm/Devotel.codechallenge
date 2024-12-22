import { isDate } from "class-validator";

export function hasValue(value: any) {

  const isNull = value === undefined || value === null;
  const isNan = typeof value === 'number' && isNaN(value);
  
  if (!isNull && !isNan) {    
    if (typeof value === 'string') {
      return value.trim().length !== 0;
    }

    if (typeof value === 'object') {
      return isDate(value) ? true : Object.keys(value).length !== 0;
    }
    
    return true;
  }
  return false;
}