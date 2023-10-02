"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const SpaceCadetPanel_1 = require("./panels/SpaceCadetPanel");
function activate(context) {
    // Add command to the extension context
    context.subscriptions.push(vscode_1.commands.registerCommand("space-cadet.explore", () => {
        SpaceCadetPanel_1.SpaceCadetPanel.render(context.extensionUri);
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map