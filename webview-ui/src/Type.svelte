<script type="ts">
	import { provideVSCodeDesignSystem, vsCodeLink, vsCodeDivider } from "@vscode/webview-ui-toolkit";
  import { draggable } from '@neodrag/svelte';
  export let name
  export let path
  export let handleClick: (event: { path: string }) => void
  let position = { x: 0, y: 0 };

	provideVSCodeDesignSystem().register(vsCodeLink(), vsCodeDivider());

</script>
<li 
  use:draggable={
    { position, onDrag: ({ offsetX, offsetY }) => {
      position = { x: offsetX, y: offsetY };
    } }
  }
  >
  <h2><vscode-link on:click={event => handleClick({ path, ...event })}>{name}</vscode-link></h2>
  <vscode-divider/>
</li>

<style>
	li {
		cursor: grab;
		border: 2px solid;
		margin: 10px;
		padding: 5px;
		display: inline-block;
    background-color: var(--vscode-editor-background);
	}

	li h2 {
		cursor: pointer;
    display:inline;
    user-select: none;
	}

</style>