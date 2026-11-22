import BigNumber from "bignumber.js";

export type InputType = 'string'|'number'|'boolean'|'bigNumber';

export class UpdateResult {
  value: any;
  change: number;

  constructor(value: any, change: number) {
    this.value = value;
    this.change = change;
  }
}


export function updateValue(
  e: Event,
  object: Record<string, unknown>, 
  objectUnmodified: Record<string, unknown>, 
  key: string, type: InputType
): UpdateResult {
  let changeFlag: boolean = false; // This flag is crucial for tracking strings and numbers
  const target: HTMLInputElement = e.currentTarget as HTMLInputElement;
  const rawValue = (type == 'boolean') ? target.checked : target.value; // Boolean uses checked
  const value = (type == 'number') ? Number(rawValue) : ((type == 'bigNumber') ? new BigNumber(rawValue as any) : rawValue); // Number and BigNumber have to be casted
  const unmodifiedValue: any = objectUnmodified[key];
  let change: number = 0;

  if (type == 'bigNumber') {
    // Check if it was one, but became another just now
    const unmodifiedBigNumber = unmodifiedValue.toString();
    if ((rawValue == unmodifiedBigNumber) != ((object[key] as any).toString() == unmodifiedBigNumber)) {
      changeFlag = true;
    }

    // If so - update the counter
    if (changeFlag) {
      if (rawValue != unmodifiedBigNumber) { change = 1; }
      else { change = -1; }
    }
  } else {
    // Check if it was one, but became another just now
    if ((value == unmodifiedValue) != (object[key] == unmodifiedValue)) {
      changeFlag = true;
    }
    
    // If so - update the counter
    if (changeFlag) {
      if (value != unmodifiedValue) { change = 1; }
      else { change = -1; }
    }
  }

  return new UpdateResult(value, change);
}