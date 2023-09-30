
<script lang="ts">
	export let types: { name: string, source: { path: string }}[] = []

	import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
	import { vscode } from "./utilities/vscode";
	import Type from "./Type.svelte"

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

	window.addEventListener('message', event => {
		types = event.data.types
  });

	function openFile(path: string) {
		vscode.postMessage({ command: 'open', path })
	}

</script>

<main>
	<ul>
	{#each types as type}
		<Type name={type.name} path={type.source.path} handleClick={event => openFile(event.path)}/>
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
