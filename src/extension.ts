import { commands, ExtensionContext } from "vscode";
import { SpaceCadetPanel } from "./panels/SpaceCadetPanel";

export function activate(context: ExtensionContext) {
  // Add command to the extension context
  context.subscriptions.push(
    commands.registerCommand("space-cadet.explore", () => {
      SpaceCadetPanel.render(context.extensionUri, context.workspaceState);
    })
  );
}
