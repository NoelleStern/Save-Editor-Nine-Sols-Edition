<script module lang="ts">

  import configJson from '../../assets/configs/config.json';
  import { readable, type Readable } from 'svelte/store';

  export interface ConfigDictionary {
    [k: string]: {
      id: string;
      title: string;
      description: string;
    };
  }

  export const config: Readable<ConfigDictionary> = 
    readable<ConfigDictionary>( Object.fromEntries(configJson.map(item => [item.id, item])) );

</script>