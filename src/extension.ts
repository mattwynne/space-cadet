import { commands, ExtensionContext } from "vscode"
import { SpaceCadetPanel } from "./panels/SpaceCadetPanel"

export function activate(context: ExtensionContext) {
  // Add command to the extension context
  context.subscriptions.push(
    commands.registerCommand("space-cadet.explore", () => {
      SpaceCadetPanel.render(context.extensionUri, context.workspaceState)
    }),
    commands.registerCommand("space-cadet.reset", () => {
      for (const key of context.workspaceState.keys()) {
        context.workspaceState.update(key, undefined)
      }
      SpaceCadetPanel.currentPanel?.dispose()
    })
  )
}
