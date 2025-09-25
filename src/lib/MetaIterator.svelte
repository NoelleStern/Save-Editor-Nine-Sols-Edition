<script lang="ts">

  import FieldInput from './FieldInput.svelte';
  import FieldIterator from './FieldIterator.svelte';
  import { getChunk, capitalizeKey, isObject } from './Utils';
  import { saveData, saveDataUnmodified } from './Stores/DataStore.svelte';
  import { updateValue, UpdateResult, type InputType } from './InputUpdater';
  
  let chunked = getChunk($saveData.meta);

  function update(e: Event, key: string, type: InputType) {
    const result: UpdateResult = updateValue(e, $saveData.meta, $saveDataUnmodified.meta, key, type);
    $saveData.meta[key] = result.value;
  }

</script>


<table class="table-fixed w-full">
  <tbody>
    {#each chunked as items}
      <tr>
        {#each items as [key, value]}
          <td class="ps-[1rem] pe-[1.5rem] py-2">

            <!-- Title -->
            <div class="flex items-center gap-2 shrink {!isObject(value) ? 'ps-2 border-l-3 leading-10' : ''}" 
              style:border-color={ $saveData.meta[key] == $saveDataUnmodified.meta[key] ? 'var(--color-success)' : 'var(--color-error)' }
            >
              <span class="font-bold"> {capitalizeKey(key)}: </span>
              {#if !isObject(value)}
                <FieldInput inputValue={$saveData.meta[key]} update={(e: Event, type: InputType) => {update(e, key, type)}} />
              {/if}
            </div>

            <!-- Fields -->
            {#if isObject(value)}
              <div class="pt-1">
                <FieldIterator bind:object={$saveData.meta[key]} bind:objectUnmodified={$saveDataUnmodified.meta[key]} />
              </div>
            {/if}

          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>