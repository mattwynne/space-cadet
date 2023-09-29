<script lang="ts">
	export let types: { name: string, source: { path: string }}[] = []

	import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
	import { vscode } from "./utilities/vscode";

	// In order to use the Webview UI Toolkit web components they
	// must be registered with the browser (i.e. webview) using the
	// syntax below.
	provideVSCodeDesignSystem().register(vsCodeButton());

	// To register more toolkit components, simply import the component
	// registration function and call it from within the register
	// function, like so:
	//
	// provideVSCodeDesignSystem().register(
	//   vsCodeButton(),
	//   vsCodeCheckbox()
	// );
	//
	// Finally, if you would like to register all of the toolkit
	// components at once, there's a handy convenience function:
	//
	// provideVSCodeDesignSystem().register(allComponents);

	function handleHowdyClick() {
		vscode.postMessage({
			command: "hello",
			text: "Hey there partner! 🤠",
		});
	}

	window.addEventListener('message', event => {
		console.log(types)
		types = event.data.types
  });

	function openFile(path: string) {
		vscode.postMessage({ command: 'open', path })
	}
</script>

<main>
	<ul>
	{#each types as type}
		<li on:click={() => openFile(type.source.path)}>
			<h2>{type.name}</h2>
		</li>
	{/each}
	</ul>
</main>

<style>
	ul {
		list-style-type: none;
	}

	li {
		border: 2px solid;
		margin: 10px;
		padding: 5px;
		display: inline-block;
	}

	li h2 {
		border-bottom: 2px solid;
	}

	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		height: 100%;
	}
</style>
