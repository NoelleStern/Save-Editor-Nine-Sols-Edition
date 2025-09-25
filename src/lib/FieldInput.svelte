
<script lang="ts">

  interface Props { inputValue: any, update: Function };
  let { inputValue, update }: Props = $props();

</script>


{#if typeof inputValue == 'number'}
  <input type="number" placeholder="Input a value" class="input" oninput={(e) => {update(e, 'number')}} value={inputValue} />
  {:else if typeof inputValue == 'string'}
  <input type="text" placeholder="Input a value" class="input" oninput={(e) => {update(e, 'string')}} value={inputValue} />
  {:else if typeof inputValue == 'boolean'}
  <input class="checkbox checkbox-primary" type="checkbox" onchange={(e) => {update(e, 'boolean')}} checked={inputValue} />
{/if}