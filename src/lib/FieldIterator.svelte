<script lang="ts">
  
  import { capitalizeKey } from './Utils';
  import FieldInput from './FieldInput.svelte';
  import { updateValue, UpdateResult, type InputType } from './InputUpdater';

  interface Props { object: Record<string, any>, objectUnmodified: Record<string, any> };
  let { object = $bindable(), objectUnmodified = $bindable()}: Props = $props();


  let keys: string[] = Object.keys(object); // Provides keys to iterate through
  let modifierCounter: number = $state(0); // Total count of modifications
  let modifiedFlag: boolean = $derived(modifierCounter > 0); // Was the object modified at all?
  let modifiedFullyFlag: boolean = $derived(modifierCounter == keys.length); // Was the object modified completely?


  function update(e: Event, key: string, type: InputType) {
    const result: UpdateResult = updateValue(e, object, objectUnmodified, key, type);
    modifierCounter += result.change;
    object[key] = result.value;
  }

</script>


<style>
  
</style>

{#if keys.length > 0}

    <!-- Lil step thing -->
    <div class="relative">
      <div class="absolute top-0 left-0 h-[10px] w-[8px] border-s-3 border-b-3"
        style:border-color={ !modifiedFullyFlag ? 'var(--color-success)' : 'var(--color-error)' }
      ></div>
    </div>

    <!-- Fields container -->
    <div class="ms-3">
      {#each keys as key}
        <div class="flex items-center gap-1 border-s-3 py-1 ps-2" 
          style:border-color={ object[key] == objectUnmodified[key] ? 'var(--color-success)' : 'var(--color-error)' }
        >

          <span> {capitalizeKey(key, true)}: </span>

          <FieldInput inputValue={ object[key] } update={(e: Event, type: InputType) => {update(e, key, type)}} />

        </div>
      {/each}

      <!-- End circle -->
      <div class="relative h-[18px]">
        <div class="absolute left-[-4.5px] top-1 size-3 rounded-full"
          style:background-color={ !modifiedFlag ? 'var(--color-success)' : 'var(--color-error)' }
        ></div>
      </div>
    </div>

{/if}