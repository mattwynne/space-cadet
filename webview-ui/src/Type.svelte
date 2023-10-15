<script type="ts">
  import { provideVSCodeDesignSystem, vsCodeLink, vsCodeDivider } from "@vscode/webview-ui-toolkit"
  import { Label, Tag, Text } from "svelte-konva"
  export let name
  export let path
  export let x
  export let y
  export let handleClick: (event: { path: string }) => void
  export let handleMove: (event: { path: string; x: number; y: number }) => void

  let labelConfig = {
    x,
    y,
    opacity: 0.8,
    visible: true,
    draggable: true,
  }

  let labelTextConfig = {
    text: name,
    fontSize: 18,
    padding: 5,
    fill: "white",
  }
</script>

<Label
  bind:config={labelConfig}
  on:click={(event) => handleClick({ path, ...event })}
  on:dragend={handleMove({ path, x: labelConfig.x, y: labelConfig.y })}
>
  <Tag
    config={{
      fill: "black",
      pointerDirection: "none",
      lineJoin: "round",
      shadowColor: "black",
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      shadowOpacity: 0.5,
    }}
  />
  <Text config={labelTextConfig} />
</Label>

>
