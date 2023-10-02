<script lang="ts">
	export let types: { name: string, position: { x: number, y: number}, source: { path: string }}[] = []

	import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
	import { vscode } from "./utilities/vscode";
	import Type from "./Type.svelte"

	provideVSCodeDesignSystem().register(vsCodeButton());


	window.addEventListener('message', event => {
		types = event.data.types
  });

	function openFile(path: string) {
		vscode.postMessage({ command: 'open', path })
	}

	function handleMove(event) {
		vscode.postMessage({ command: 'move', ...event})
	}

</script>

<main>
	<ul>
	{#each types as type}
		<Type 
			name={type.name} 
			path={type.source.path} 
			position={type.position}
			handleClick={event => openFile(event.path)} 
			handleMove={handleMove}/>
	{/each}
	</ul>
</main>

<style>
	ul {
		list-style-type: none;
	}

	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		height: 100%;
	}
</style>
