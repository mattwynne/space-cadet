<script type="ts">
  import { draggable } from '@neodrag/svelte';
  export let name
  export let path
  export let handleClick: (event: { path: string }) => void
  let position = { x: 0, y: 0 };

</script>
<li 
  use:draggable={
    { position, onDrag: ({ offsetX, offsetY }) => {
      position = { x: offsetX, y: offsetY };
    } }
  }
  >
  <h2><div on:click={event => handleClick({ path, ...event })}>{name}</div></h2>
</li>

<style>
	li {
		cursor: grab;
		border: 2px solid;
		margin: 10px;
		padding: 5px;
		display: inline-block;
	}

	li h2 {
		cursor: pointer;
		border-bottom: 2px solid;
	}

</style>