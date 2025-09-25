<script lang="ts">

  import { savefile, inflatedData, onFileChange } from './lib/Stores/DataStore.svelte';
  import ObjectIterator from './lib/ObjectIterator.svelte';
  import WelcomeMessage from './lib/WelcomeMessage.svelte';
  import MetaIterator from './lib/MetaIterator.svelte';
  import DropOverlay from './lib/DropOverlay.svelte';
  import { onMount, type Component } from 'svelte';
  import TopBar from './lib/TopBar.svelte';

  // svelte-ignore non_reactive_update
  let fileInput: HTMLInputElement;

  onMount(() => {
    fileInput.onchange = onFileChange;
  });

</script>


{#snippet grid(title: string, Component: Component)}
  <div>
    <div class="ps-3 py-2 text-xl text-bold"> {title}: </div>
    <div class="table border-t-2 border-b-2 border-x-1 border-secondary rounded-(--frame-radius) overflow-hidden">
      <Component />
    </div>
  </div>
{/snippet}


<main class="h-[100vh]">
  <div class="flex flex-col size-full">

    <!-- Top bar -->
    <TopBar />

    <!-- Main content -->
    <div class="frame bg-primary overflow-hidden size-full">
      <div class="relative rounded-(--frame-radius) bg-base-300 overflow-y-scroll overflow-x-hidden size-full">
        {#if $savefile && $inflatedData.length > 0}
          {#key $inflatedData}
              <!-- Iterates through metadata -->
              {@render grid('Meta', MetaIterator)}
              <!-- Iterates through flags -->
              {@render grid('Flags', ObjectIterator)}
          {/key}
        {:else}
          <DropOverlay dropCallback={onFileChange} />
          <WelcomeMessage bind:fileInput />
        {/if}
      </div>
    </div>

  </div>
</main>