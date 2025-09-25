<script lang="ts">

  import FilePicker from './Buttons/FilePicker.svelte';

  interface Props { fileInput: HTMLInputElement};
  let { fileInput=$bindable() }: Props = $props();

</script>


{#snippet horizontalLine(title: string, classAddition: string = '')}
  <div class="relative my-2 me-8 {classAddition}"> 
    <hr class="opacity-20">
    <div class="absolute left-1/2 -translate-x-1/2 -translate-y-[calc(50%+0.25em)] opacity-80"> 
      <span class="bg-base-300 px-2 text-success"> {title} </span>
    </div>
  </div>
{/snippet}


<div class="grid justify-center items-center size-full">
  
  <div class="grid justify-center items-center gap-2 w-max h-full">
    <div class="pt-1 pb-4">

      <!-- Title -->
      <div class="text-4xl text-bold text-secondary"> Attention! </div>
    
      <!-- Save file location -->
      <div class="py-2">
        <div> Save files are located at: </div>
        <div class="relative h-[1.2em]"> 
          <div class="absolute text-info hover:underline select-all text-nowrap">%userprofile%\AppData\LocalLow\RedCandleGames\NineSols</div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="flex flex-col max-w-95 w-max">
        <!-- Quick guide -->
        {@render horizontalLine('Quick guide', 'mt-4')}
        <li> Please, <span class="font-bold">make a backup</span> of your original save file </li>
        <li> Select or drag'n'drop the save file you want to modify </li>
        <li> Wait patiently for the file to open, it usually takes a few seconds </li>
        <li> Modify your save file, <kbd class="kbd">Ctrl</kbd>+<kbd class="kbd">F</kbd> is your best friend </li>
        <li> Download your newly modified save file and enjoy </li>

        <!-- Considerations -->
        {@render horizontalLine('Other considerations', 'mt-7')}
        <li> I do not recommend zooming the page in or out while a file is open </li>
        <li> Works best on Firefox </li>
        <li> The software is provided "as is" and I'm not responsible for any potential data loss </li>

        <!-- File picker -->
        <div class="pt-5">
          <FilePicker bind:fileInput />
        </div>
      </div>

    </div>
  </div>

  <a href="https://github.com/NoelleStern/Save-Editor-Nine-Sols-Edition" class="absolute bottom-2 right-5 hover:underline max-md:hidden">by Noelle Stern</a>

</div>