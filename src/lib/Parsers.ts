import * as fflate from 'fflate';
import * as jsonMap from 'json-source-map';


/// Parsing and serializing the data turned out to be a huge challenge!
///
///   I had to write a Rust wasm package just to operate on MessagePack without disrupting the original types.
///   In case the original types weren't preserved accurately, the game would simply invalidate the file and not show an associated save slot.
///   JS also gave me a lot of headache with trailing zeroes. I've had to solve this issue separately for the SaveData json and the meta json.
///   I don't know if I actually had to go through all of the trouble, but the accuracy should be pretty much ensured by now.
///
///   The basic usage is pretty simple:
///       1) rmpp.unpack() returns a MsgPackEntry in a form of a json string
///       2) simplify() returns a simplified object we can operate on
///       3) mergeCopy() turns a simplified copy back into MsgPackEntry
///       4) rmpp.pack_json() returns a MsgPackEntry in a form of Uint8Array
///
///   It took a lot of effort to make every single step of the process work correctly.
///   In the actual code though, the latter half of the process is handled by a SaveData Object.
///
/// I'm so happy I'm was able to push through with it!


// Basic types, same as Rust
export class MsgPackEntry {
  raw_marker: number;
  basic_type: string;
  data: MsgPackValue;

  constructor(
    raw_marker: number = 0, basic_type: string = '', 
    data: MsgPackValue = new MsgPackValue()
  ) {
    this.raw_marker = raw_marker;
    this.basic_type = basic_type;
    this.data = data;
  }

  static copy(obj: MsgPackEntry) {
    return new MsgPackEntry(obj.raw_marker, obj.basic_type, MsgPackValue.copy(obj.data));
  }
  static basicCopy(obj: MsgPackEntry) {
    return new MsgPackEntry(obj.raw_marker, obj.basic_type, MsgPackValue.basicCopy(obj.data));
  }
}
export class MsgPackValue {
  type: string;
  value: any;

  constructor(
    type: string = '', 
    value: any = null
  ) {
    this.type = type;
    this.value = value;
  }

  static copy(obj: MsgPackValue) {
    return new MsgPackValue(obj.type, obj.value);
  }
  static basicCopy(obj: MsgPackValue) {
    return new MsgPackValue(obj.type, null);
  }
}

// A couple of regex functions 
// Used to ensure F32/F64 values have trailing zeros in the output SaveData json
export function addTrailingZeros(jsonString: string) { 
  return jsonString.replace(/("type":\s*"(F32|F64)",[\r\n]*\s*"value":\s*)(-?\d+)(?=[,\}\n])/g, '$1$3.0');
}
// Used to find floats in the input meta json
export function checkFloat(str: string): boolean {
  return str.match(/^-?\d+\.\d+$/) != null;
}
// Used to find floats without trailing zeroes in the output meta json
export function checkInt(str: string): boolean {
  return str.match(/^-?\d+$/) != null;
}

// Used to replace parts of text easily
function replaceAt(str: string, indexStart: number, indexEnd: number, replacement: string) {
  return str.slice(0, indexStart) + replacement + str.slice(indexEnd);
}

// Async inflate/deflate wrappers
export function inflateAsync(data: Uint8Array, opts: fflate.AsyncInflateOptions = {}): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    fflate.inflate(data, opts, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}
export function deflateAsync(data: Uint8Array, opts: fflate.AsyncDeflateOptions = {}): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    fflate.deflate(data, opts, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

// Simplifies the complex json object for easier processing
export function simplify(entry: MsgPackEntry): any {
  if (entry.basic_type == "Array") {
    const array: any[] = [];
    
    entry.data.value.forEach((el: MsgPackEntry) => {
      array.push(simplify(el));
    });

    return array;
  } else if (entry.basic_type == "Map") { // Representing map as an object is way nicer to work with
    const obj: Record<string, any> = new Object();
    const value: MsgPackEntry[][] = entry.data.value;

    value.forEach((el: MsgPackEntry[]) => {
      obj[String(el[0].data.value)] = simplify(el[1]);
    });

    return obj;
  } else {
    return entry.data.value;
  }
}
// Creates a copy of a MsgPackEntry with the values taken from a simplified object
export function mergeCopy(entry: MsgPackEntry, simplified: any): MsgPackEntry {
  const newEntry: MsgPackEntry = MsgPackEntry.basicCopy(entry);

  if (entry.basic_type == "Array") {
    const array: any[] = [];

    for (let i=0; i<entry.data.value.length; i++) {
      array.push( mergeCopy(entry.data.value[i], simplified[i]) );
    }

    newEntry.data.value = array;

  } else if (entry.basic_type == "Map") {
    const array: any[] = [];
    const value: MsgPackEntry[][] = entry.data.value;
    const entries: Record<string, any> = Object.entries(simplified);

    for (let i=0; i<value.length; i++) {
      array.push([MsgPackEntry.copy(value[i][0]), mergeCopy(value[i][1], entries[i][1]) ]);
    }

    newEntry.data.value = array;

  } else {
    newEntry.data.value = simplified;
  }

  return newEntry;
}

// Returns a list of float paths from the input meta json
export function getFloatPaths(jsonString: string): string[] {
  const result: string[] = [];
  const { pointers } = jsonMap.parse(jsonString);

  for (const [pointer, info] of Object.entries(pointers)) {
    const raw: string = jsonString.slice(info.value.pos, info.valueEnd.pos);
    if (checkFloat(raw)) { result.push(pointer); }
  }

  return result;
}
// Ensures floats remain floats on the output meta json
export function putFloatsBack(jsonObject: Object, paths: string[]): string {
  let offset: number = 0;
  const { json, pointers } = jsonMap.stringify(jsonObject);
  let result: string = json;

  for (const [pointer, info] of Object.entries(pointers)) {
    if (paths.includes(pointer)) {
      const raw: string = json.slice(info.value.pos, info.valueEnd.pos);
      result = replaceAt(result, info.value.pos+offset, info.valueEnd.pos+offset, `${raw}.0`);
      offset += 2; // Since .0 adds 2 characters
    }
  }

  return result;
}