export function chunk<T>(arr: T[], len: number = 3): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += len) {
    res.push(arr.slice(i, i + len));
  }
  return res;
}

export function getChunk(obj: Object): [string, any][][] {
  return chunk(Object.entries(obj));
}

export function isObject(value: unknown): value is object {
  return typeof value == "object" && value != null;
}

export function capitalizeKey(key: string, ignoreLonely: boolean = false) {
  return (key.length > 1 || !ignoreLonely)
    ? String(key).charAt(0).toUpperCase()+String(key).slice(1) 
    : key
}

// I don't like it, but it works
export function isBigNumber(value: unknown): boolean {
  return (
    typeof value == 'object' && value != null &&
    typeof (value as any).isFinite == 'function' &&
    typeof (value as any).decimalPlaces == 'function' &&
    typeof (value as any).toFixed == 'function'
  );
}
