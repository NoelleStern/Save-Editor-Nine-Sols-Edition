<script lang="ts">

  import Save from './Buttons/Save.svelte';
  import Close from './Buttons/Close.svelte';
  import FullscreenButton from './Buttons/FullscreenButton.svelte';
  import { savefile } from './Stores/DataStore.svelte';

</script>


<div class="flex items-center gap-2 w-full h-12 bg-primary px-(--frame-padding) border-primary" 
  style:border-top-width={'var(--frame-width)'}
>

  <span class="text-2xl"> {'<SENSE: Save Editor Nine Sols Edition />'} </span>
  
  <div class="grow"></div>

  {#if $savefile}
    <Save />
  {/if}

  <FullscreenButton />

  {#if $savefile}
    <Close onClick={() => {$savefile = null}} />
  {/if}

</div>