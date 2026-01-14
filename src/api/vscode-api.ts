import * as vscode from 'vscode';
import { Terminal } from 'vscode';

/**
 * Wrapper for VS Code API functions accessible from Lisp
 */
export class VSCodeAPI {
    private terminals: Map<string, Terminal> = new Map();

    /**
     * Execute a VS Code command
     */
    async executeCommand(command: string, ...args: any[]): Promise<any> {
        return await vscode.commands.executeCommand(command, ...args);
    }

    /**
     * Run a command in terminal
     */
    async runTerminalCommand(command: string, terminalName: string = 'default'): Promise<void> {
        let terminal = this.terminals.get(terminalName);
        
        if (!terminal) {
            terminal = vscode.window.createTerminal(terminalName);
            this.terminals.set(terminalName, terminal);
        }

        terminal.show();
        terminal.sendText(command);
    }

    /**
     * Open a file in editor
     */
    async openFile(filePath: string): Promise<void> {
        const uri = vscode.Uri.file(filePath);
        await vscode.window.showTextDocument(uri);
    }

    /**
     * Get selected text from active editor
     */
    getSelection(): string {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return '';
        }

        const selection = editor.document.getText(editor.selection);
        return selection || editor.document.getText();
    }

    /**
     * Insert text at cursor position
     */
    async insertText(text: string): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, text);
        });
    }

    /**
     * Show information message
     */
    showInformation(message: string): void {
        vscode.window.showInformationMessage(message);
    }

    /**
     * Show error message
     */
    showError(message: string): void {
        vscode.window.showErrorMessage(message);
    }

    /**
     * Show warning message
     */
    showWarning(message: string): void {
        vscode.window.showWarningMessage(message);
    }

    /**
     * Get workspace folder path
     */
    getWorkspaceFolder(): string | null {
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
        return null;
    }

    /**
     * Read file content
     */
    async readFile(filePath: string): Promise<string> {
        const uri = vscode.Uri.file(filePath);
        const document = await vscode.workspace.openTextDocument(uri);
        return document.getText();
    }

    /**
     * Write file content
     */
    async writeFile(filePath: string, content: string): Promise<void> {
        const uri = vscode.Uri.file(filePath);
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        await vscode.workspace.fs.writeFile(uri, data);
    }

    /**
     * Expand selection to next semantic unit
     */
    async expandRegion(): Promise<void> {
        await vscode.commands.executeCommand('editor.action.smartSelect.expand');
    }

    /**
     * Contract selection to previous semantic unit
     */
    async contractRegion(): Promise<void> {
        await vscode.commands.executeCommand('editor.action.smartSelect.shrink');
    }
}

