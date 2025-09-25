<script lang="ts">

  import FullscreenIcon from '~icons/ic/baseline-fullscreen';
  import FullscreenExitIcon from '~icons/ic/baseline-fullscreen-exit';


  let fullscreenFlag: boolean = $state(false);


  function isFullscreen(): boolean {
    return document.fullscreenElement != null;
  }

  async function toggleFullscreen(): Promise<void> {
    if (!isFullscreen()) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  
  document.onfullscreenchange = (e) => {
    fullscreenFlag = isFullscreen();
  }

</script>


<button class="btn btn-secondary btn-square" onclick={async () => {toggleFullscreen()}}> 
  {#if !fullscreenFlag} 
    <FullscreenIcon />
  {:else}
    <FullscreenExitIcon />
  {/if}
</button>