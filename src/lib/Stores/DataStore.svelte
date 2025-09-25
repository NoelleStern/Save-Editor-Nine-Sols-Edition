<script module lang="ts">

  import { 
    inflateAsync, deflateAsync, simplify, mergeCopy, MsgPackEntry, 
    addTrailingZeros, getFloatPaths, putFloatsBack 
  } from '../Parsers';

  import { unpack_json, pack_json } from 'rmpp';
  import { writable, type Writable } from 'svelte/store';
  import { saveAs } from 'file-saver';
  import JSONbig from 'json-bigint'; // Turns out some values are way too big
  import * as fflate from 'fflate';

  
  // Main class to operate on
  class SaveData {
    key: number;
    meta: Record<string, any>;
    flagDict: Record<string, any>;
    floatPaths: string[];

    constructor(
      key: number = 0, meta: Object = new Object(), 
      flagDict: Object = new Object(), floatPaths: string[] = []
    ) {
      this.key = key;
      this.meta = meta;
      this.flagDict = flagDict;
      this.floatPaths = floatPaths;
    }

    static fromSimplified(input: any): SaveData {
      return new SaveData(
        input[0], JSONbig.parse(input[1]), input[2],
        getFloatPaths(input[1])
      );
    }

    // Those are all a part of the same chain
    toArray(): any[] {
      // Ensures meta trailing zeroes
      const json: string = putFloatsBack(this.meta, this.floatPaths);
      return [this.key, json, this.flagDict];
    }
    toMsgPackEntry(data: MsgPackEntry): MsgPackEntry {
      return mergeCopy(data, this.toArray());
    }
    toJson(data: MsgPackEntry): string {
      // Ensures F32/F64 trailing zeroes
      const json = JSONbig.stringify(this.toMsgPackEntry(data));
      return addTrailingZeros(json);
    }
    toPackedArray(data: MsgPackEntry): Uint8Array {
      return pack_json(this.toJson(data));
    }
    toDeflateOutput(data: MsgPackEntry): Uint8Array { 
      return fflate.deflateSync(this.toPackedArray(data));
    }
    async toDeflateOutputAsync(data: MsgPackEntry): Promise<Uint8Array> { 
      return await deflateAsync(this.toPackedArray(data));
    }
    saveOutput(data: MsgPackEntry, filename: string = 'flags.sav') {
      const deflated: Uint8Array = this.toDeflateOutput(data);
      saveAs(new Blob([deflated as BlobPart]), filename);
    }
    async saveOutputAsync(data: MsgPackEntry, filename: string = 'flags.sav') {
      const deflated: Uint8Array = await this.toDeflateOutputAsync(data);
      saveAs(new Blob([deflated as BlobPart]), filename);
    }
  }


  export const savefile: Writable<File|null> = writable<File|null>(null); // Simply a file
  export const inflatedData: Writable<Uint8Array> = writable<Uint8Array>(new Uint8Array()); // Uncompressed, but not really useful
  export const saveDataRaw: Writable<MsgPackEntry> = writable<MsgPackEntry>(new MsgPackEntry()); // Complex original data structure
  export const saveData: Writable<SaveData> = writable<SaveData>(new SaveData()); // This we operate on, simplified
  export const saveDataUnmodified: Writable<SaveData> = writable<SaveData>(new SaveData()); // This we leave as is, simplified


  async function readFile(file: File): Promise<Uint8Array> {
    const buffer = await file.arrayBuffer();
    return new Uint8Array(buffer);
  }

  export async function onFileChange(e: Event|File) {
    let file: File|null = (e instanceof File) ? e : (e.target as HTMLInputElement).files![0];
    if (!file) return;

    // Do some basic transformations
    const raw: Uint8Array =           await readFile(file);
    const inflated: Uint8Array =      await inflateAsync(raw);
    const jsonString: string =        unpack_json(inflated);
    const jsonObject: MsgPackEntry =  JSONbig.parse(jsonString);
    
    // Assign data to stores
    savefile.set( file );
    inflatedData.set( inflated );
    saveDataRaw.set( jsonObject );
    saveData.set( SaveData.fromSimplified(simplify(jsonObject)) ); // This creates a new object
    saveDataUnmodified.set( SaveData.fromSimplified(simplify(jsonObject)) ); // This creates a new object
  }

</script>