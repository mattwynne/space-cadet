"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceCadetPanel = void 0;
const vscode_1 = require("vscode");
const getUri_1 = require("../utilities/getUri");
const getNonce_1 = require("../utilities/getNonce");
const Types_1 = require("./Types");
const vscode = require("vscode");
const Class_1 = require("./Class");
/**
 * This class manages the state and behavior of webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
class SpaceCadetPanel {
    /**
     * The HelloWorldPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    constructor(panel, extensionUri, stateStore) {
        this.stateStore = stateStore;
        this._disposables = [];
        this.state = { types: [] };
        this._panel = panel;
        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState((e) => {
            e.webviewPanel.visible && this.renderState();
        });
        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
        this.state = this.stateStore.get("state") || this.refreshState();
        this.renderState();
    }
    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    static render(extensionUri, stateStore) {
        if (SpaceCadetPanel.currentPanel) {
            // If the webview panel already exists reveal it
            SpaceCadetPanel.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
        }
        else {
            // If a webview panel does not already exist create and show a new one
            const panel = vscode_1.window.createWebviewPanel(
            // Panel view type
            "explore", 
            // Panel title
            "Space Cadet ✨", 
            // The editor column the panel should be displayed in
            vscode_1.ViewColumn.One, 
            // Extra panel configurations
            {
                // Enable JavaScript in the webview
                enableScripts: true,
                // Restrict the webview to only load resources from the `out` and `webview-ui/public/build` directories
                localResourceRoots: [
                    vscode_1.Uri.joinPath(extensionUri, "out"),
                    vscode_1.Uri.joinPath(extensionUri, "webview-ui/public/build"),
                ],
            });
            SpaceCadetPanel.currentPanel = new SpaceCadetPanel(panel, extensionUri, stateStore);
        }
    }
    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    dispose() {
        SpaceCadetPanel.currentPanel = undefined;
        // Dispose of the current webview panel
        this._panel.dispose();
        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    renderState() {
        this._panel.webview.postMessage(this.state);
        return this;
    }
    refreshState() {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            return this.state;
        }
        try {
            const types = Types_1.Types.parseFrom(folders[0]);
            return Object.assign(Object.assign({}, this.state), { types });
        }
        catch (error) {
            console.error(error);
        }
        return this.state;
    }
    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the Svelte webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    _getWebviewContent(webview, extensionUri) {
        // The CSS file from the Svelte build output
        const stylesUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "public", "build", "bundle.css"]);
        // The JS file from the Svelte build output
        const scriptUri = (0, getUri_1.getUri)(webview, extensionUri, ["webview-ui", "public", "build", "bundle.js"]);
        const nonce = (0, getNonce_1.getNonce)();
        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Space Cadet</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <script defer nonce="${nonce}" src="${scriptUri}"></script>
        </head>
        <body>
        </body>
      </html>
    `;
    }
    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    _setWebviewMessageListener(webview) {
        webview.onDidReceiveMessage((message) => {
            console.log(message);
            const command = message.command;
            switch (command) {
                case "open":
                    vscode.workspace.openTextDocument(message.path).then(vscode.window.showTextDocument);
                    return;
                case "move":
                    const type = this.state.types.find((type) => type.source.path === message.path);
                    if (type) {
                        type.position = new Class_1.Position(message.x, message.y);
                    }
                    this.stateStore.update("state", this.state);
                    // window.showInformationMessage("State saved: " + JSON.stringify(message));
                    return;
            }
        }, undefined, this._disposables);
    }
}
exports.SpaceCadetPanel = SpaceCadetPanel;
//# sourceMappingURL=SpaceCadetPanel.js.map