"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = void 0;
const ts = require("typescript");
const Class_1 = require("./Class");
function isNodeExported(node) {
    return ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
        (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile));
}
function getTypeNames(sourceFile) {
    const typeNames = [];
    function visit(node) {
        if ((ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name) {
            typeNames.push(node.name.escapedText.toString());
        }
        ts.forEachChild(node, visit);
    }
    ts.forEachChild(sourceFile, visit);
    return typeNames;
}
class Types {
    static parseFrom(root) {
        const currentDir = root.uri.path;
        const configFile = ts.findConfigFile(currentDir, ts.sys.fileExists, "tsconfig.json");
        if (!configFile) {
            throw Error("tsconfig.json not found");
        }
        const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
        const { options, fileNames, errors } = ts.parseJsonConfigFileContent(config, ts.sys, currentDir);
        const program = ts.createProgram({
            options,
            rootNames: fileNames,
            configFileParsingDiagnostics: errors,
        });
        const sourceFiles = program.getSourceFiles();
        const result = [];
        sourceFiles
            .filter((file) => !file.fileName.match(/node_modules/))
            .forEach((sourceFile) => {
            console.log(sourceFile.fileName);
            ts.forEachChild(sourceFile, findClasses);
            function findClasses(node) {
                if (ts.isClassDeclaration(node)) {
                    const name = node.name ? node.name.escapedText.toString() : "Unknown";
                    result.push(new Class_1.Class(name, new Class_1.Source(sourceFile.fileName), Class_1.Position.unknown));
                }
                ts.forEachChild(node, findClasses);
            }
        });
        return result;
    }
}
exports.Types = Types;
//# sourceMappingURL=Types.js.map