export type InputType = 'number'|'boolean'|'string';

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
  const value = (type == 'number') ? Number(rawValue) : rawValue; // Number has to be casted
  let change: number = 0;

  // Check if it was one, but became another just now
  if ((value == objectUnmodified[key]) != (object[key] == objectUnmodified[key])) {
    changeFlag = true;
  }
  
  // If so - update the counter
  if (changeFlag) {
    if (value != objectUnmodified[key]) { change = 1; }
    else { change = -1; }
  }

  return new UpdateResult(value, change);
}