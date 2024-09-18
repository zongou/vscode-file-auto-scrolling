import * as vscode from 'vscode';

const extId = 'file-auto-scrolling';
const fileList = new Set();

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand(`${extId}.toggle`, () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const filePath = editor.document.uri.path;
			fileList.has(filePath) ? fileList.delete(filePath) : fileList.add(filePath);
		}
	}));

	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
		const filePath = event.document.uri.path;
		if (fileList.has(filePath)) {
			const editor = vscode.window.visibleTextEditors.find(editor => editor.document.uri.path === filePath);
			if (editor) {
				const lastLine = editor.document.lineCount - 1;
				const lastPosition = new vscode.Position(lastLine, editor.document.lineAt(lastLine).text.length);
				editor.revealRange(new vscode.Range(lastPosition, lastPosition));
			}
		}
	}));
}
