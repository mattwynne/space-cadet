import { join } from "path";
import * as ts from "typescript";
import { Uri, WorkspaceFolder } from "vscode";
import { Class, Source } from "./Class";

function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

function getTypeNames(sourceFile: ts.SourceFile): string[] {
  const typeNames: string[] = [];

  function visit(node: ts.Node) {
    if ((ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name) {
      typeNames.push(node.name.escapedText.toString());
    }
    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
  return typeNames;
}

export class Types {
  static parseFrom(root: WorkspaceFolder): Class[] {
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

    const result: Class[] = [];
    sourceFiles
      .filter((file) => !file.fileName.match(/node_modules/))
      .forEach((sourceFile) => {
        console.log(sourceFile.fileName);
        ts.forEachChild(sourceFile, findClasses);
        function findClasses(node: ts.Node) {
          if (ts.isClassDeclaration(node)) {
            result.push(new Class(node.name?.escapedText || "Unknown", new Source(sourceFile.fileName)));
          }
          ts.forEachChild(node, findClasses);
        }
      });
    return result;
  }
}
