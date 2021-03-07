// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

interface Timer {
    fileName: string;
    start: number;
}

let activeTimer: Timer | undefined = undefined;
let statusBarItem: vscode.StatusBarItem | undefined = undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const fileName = vscode.window.activeTextEditor?.document.fileName;
    vscode.window.showInformationMessage(fileName ?? "No editor is active");

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
    );

    const didChangeEditor = vscode.window.onDidChangeActiveTextEditor(
        onDidChangeActiveTextEditor
    );

    context.subscriptions.push(didChangeEditor);
}

// this method is called when your extension is deactivated
export function deactivate() {}

const onDidChangeActiveTextEditor: (
    activeEditor: vscode.TextEditor | undefined
) => any = (activeEditor) => {
    if (activeTimer === undefined && activeEditor !== undefined) {
        const fileName = activeEditor.document.fileName;
        activeTimer = {
            start: Date.now(),
            fileName,
        };
    }

    if (activeTimer === undefined) {
        return;
    }

    if (statusBarItem === undefined) {
        statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left
        );
    }

    const timeDiff = (Date.now() - activeTimer.start) / 1000;

    statusBarItem.text = `Spent ${timeDiff.toFixed(0)} editing file`;
    statusBarItem.show();
};
