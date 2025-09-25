<script lang="ts">

  import { saveData, saveDataRaw } from '../Stores/DataStore.svelte';
  import SaveIcon from '~icons/ic/baseline-save';

  async function save() {
    $saveData.saveOutputAsync($saveDataRaw);
  }

</script>


<button class="btn btn-secondary btn-square" onclick={save}>
  <SaveIcon />
</button>