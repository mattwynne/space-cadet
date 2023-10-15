<script lang="ts">
  import { Stage, Layer } from "svelte-konva"
  export let types: { name: string; position: { x: number; y: number }; source: { path: string } }[] = []

  import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit"
  import { vscode } from "./utilities/vscode"
  import Type from "./Type.svelte"

  provideVSCodeDesignSystem().register(vsCodeButton())

  window.addEventListener("message", (event) => {
    types = event.data.types.map((type) => {
      console.log(type)
      if (!type.position) {
        type.position = {
          x: width * Math.random() * 0.8,
          y: height * Math.random() * 0.8,
        }
      }
      return type
    })
  })

  function openFile(path: string) {
    vscode.postMessage({ command: "open", path })
  }

  function handleMove(event) {
    vscode.postMessage({ command: "move", ...event })
  }

  const width = window.innerWidth
  const height = window.innerHeight
</script>

<main>
  <Stage config={{ width, height }}>
    <Layer>
      {#each types as type}
        <Type
          name={type.name}
          path={type.source.path}
          x={type.position.x}
          y={type.position.y}
          handleClick={(event) => openFile(event.path)}
          {handleMove}
        />
      {/each}
    </Layer>
  </Stage>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
  }
</style>
