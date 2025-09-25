<script lang="ts">

  import { getChunk } from './Utils';
  import FieldIterator from './FieldIterator.svelte';
  import { config } from './Stores/ConfigStore.svelte';
  import { saveData, saveDataUnmodified } from './Stores/DataStore.svelte';

  let chunked = getChunk($saveData.flagDict);

</script>


{#snippet title(key: string)}
  <span class="font-bold"> {$config[key].title}: </span>
{/snippet}


<table class="table-fixed w-full">
  <tbody>
    {#each chunked as items}
      <tr>
        {#each items as [key, _value]}
          <td class="ps-[1rem] pe-[1.5rem] py-1 align-top">

            <!-- Top text -->
            <div class="flex flex-col pb-1 wrap-anywhere">
              <!-- Main text -->
              {#if $config[key]}
                {#if $config[key].description != ''}
                  <!-- Description tooltip -->
                  <div class="flex items-center gap-1">
                    <div class="size-(--info-size) tooltip tooltip-br" data-tip={$config[key].description}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info size-full shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <!-- Title -->
                    {@render title(key)}
                  </div>
                {:else}
                  <!-- Title -->
                  {@render title(key)}
                {/if}
              {/if}

              <!-- ID -->
              <span class="font-bold text-xs opacity-50"> ID: {key} </span>
            </div>

            <!-- Fields -->
            <FieldIterator bind:object={$saveData.flagDict[key]} bind:objectUnmodified={$saveDataUnmodified.flagDict[key]} />

          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>