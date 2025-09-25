<script lang="ts">

  import CloseIcon from '~icons/ic/baseline-close';

  interface Props { onClick: Function };
  let { onClick }: Props = $props();

</script>


<button class="btn btn-secondary btn-square" onclick={() => {onClick()}}>
  <CloseIcon />
</button>