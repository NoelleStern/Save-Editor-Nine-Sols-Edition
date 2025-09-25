<script lang="ts">

  import { onMount } from 'svelte';
  

  interface Props { dropCallback?: Function, disabled?: boolean };
  let { dropCallback=()=>{}, disabled=false }: Props = $props();


  let time: number = 0;
  let node: HTMLElement;
  let dragenter: boolean = false;


  async function onDrop(event: DragEvent): Promise<void> {
    if (disabled) { return; }

    // Happens sometimes. Just ignore it and don't create a toast
    if (!event.dataTransfer) { return; }
    if (event.dataTransfer.files.length == 0) { return; }

    if (event.dataTransfer.files.length > 1) {
      // TODO: Toast
      return;
    }

    const file: File = event.dataTransfer.files[0];
    console.log(file.name);
    console.log(file.name.endsWith('.sav') );
    console.log(file.name.endsWith('.sav.bak'));
    if (!file.name.endsWith('.sav') && !file.name.endsWith('.sav.bak')) {
      // TODO: Toast
      return;
    }

    dropCallback(file);
    console.log('meow');
  }


  onMount(() => {
    function handleDragenter(value: boolean): void {
      // If value is different than the current one - do stuff
      if (dragenter != value) {
        dragenter = value;
        
        if (disabled) { return; }

        if (value) {
          node.style.animation = "0.35s ease-out 0s 1 normal forwards fadeIn";
        } else {
          node.style.visibility = "visible"; // Needed since the default visibility is set to "hidden"
          node.style.animation = "0.35s ease-out 0s 1 normal forwards fadeOut";
        }
      }
    }

    document.addEventListener('drop', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      handleDragenter(false);
      onDrop(e);
    });
    document.addEventListener('dragleave', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if ((new Date).getTime() - time > 5) {
        handleDragenter(false);
      }
    });
    document.addEventListener('dragend', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();

      handleDragenter(false);
    });
    document.addEventListener('dragover', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      handleDragenter(true);
    });
    document.addEventListener('dragenter', (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();

      time = (new Date).getTime();
    });
  });

</script>


<style>
  @keyframes fontChange {
    0% {
      font-family: "Space Grotesk", serif;
    }
    25% {
      font-family: "Caveat", serif;
    }
    50% {
      font-family: "Roboto Condensed", serif;
    }
    75% {
      font-family: "VT323", serif;
    }
    100% {
      font-family: "Space Grotesk", serif;
    }
  }

  @keyframes -global-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
      visibility: visible;
    }
  }
  @keyframes -global-fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      visibility: hidden;
    }
  }

  .drop-overlay {
    display: flex;
    visibility: hidden;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 9999;
    height: 100%;
    width: 100%;
  }
  .drop-overlay .bck {
    opacity: 1;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.35);
    transition: opacity 0.5s ease-in-out;
    font-size: 100%;
  }
</style>


<div class="drop-overlay" bind:this={node}>
  <div class="pointer-events-none size-full ">

    <div class="bck flex border-5 border-dashed rounded-(--frame-radius) justify-center items-center">
    </div>
      
  </div>
</div>