<script lang="ts">

  interface Props { file?: File|null, types?: string, fileInput?: HTMLInputElement };
  let { file=$bindable(null), types='.sav, .sav.bak', fileInput=$bindable() }: Props = $props();

  let files: FileList|undefined = $state();
  $effect(() => { file = (files != undefined) ? files[0] : null });

</script>


<input type="file" accept={types} class="file-input file-input-primary" bind:files bind:this={fileInput}/>