import * as vscode from 'vscode';
import { LispInterpreter } from './lisp/interpreter';
import { KeybindingManager } from './keybindings/manager';
import { VSCodeAPI } from './api/vscode-api';

let interpreter: LispInterpreter;
let keybindingManager: KeybindingManager;
let vsCodeAPI: VSCodeAPI;

export function activate(context: vscode.ExtensionContext) {
    console.log('Cursor Lisp Interpreter extension is now active!');

    // Initialize components
    interpreter = new LispInterpreter();
    vsCodeAPI = new VSCodeAPI();
    keybindingManager = new KeybindingManager(interpreter, vsCodeAPI, context);

    // Register commands
    const evaluateCommand = vscode.commands.registerCommand(
        'cursor-lisp.evaluate',
        async () => {
            const input = await vscode.window.showInputBox({
                prompt: 'Enter Lisp expression to evaluate',
                placeHolder: '(+ 1 2)'
            });
            if (input) {
                try {
                    const result = interpreter.evaluate(input);
                    vscode.window.showInformationMessage(`Result: ${result}`);
                } catch (error: any) {
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                }
            }
        }
    );

    const evaluateSelectionCommand = vscode.commands.registerCommand(
        'cursor-lisp.evaluateSelection',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor');
                return;
            }

            const selection = editor.document.getText(editor.selection);
            if (!selection) {
                vscode.window.showWarningMessage('No text selected');
                return;
            }

            try {
                const result = interpreter.evaluate(selection);
                vscode.window.showInformationMessage(`Result: ${result}`);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            }
        }
    );

    const replCommand = vscode.commands.registerCommand(
        'cursor-lisp.repl',
        () => {
            const panel = vscode.window.createWebviewPanel(
                'lispRepl',
                'Lisp REPL',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getReplWebviewContent();

            panel.webview.onDidReceiveMessage(
                async message => {
                    if (message.command === 'evaluate') {
                        try {
                            const result = interpreter.evaluate(message.code);
                            panel.webview.postMessage({
                                command: 'result',
                                result: String(result)
                            });
                        } catch (error: any) {
                            panel.webview.postMessage({
                                command: 'error',
                                error: error.message
                            });
                        }
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    );

    const loadConfigCommand = vscode.commands.registerCommand(
        'cursor-lisp.loadConfig',
        async () => {
            await keybindingManager.loadConfiguration();
            vscode.window.showInformationMessage('Lisp configuration reloaded');
        }
    );

    context.subscriptions.push(
        evaluateCommand,
        evaluateSelectionCommand,
        replCommand,
        loadConfigCommand
    );

    // Load initial configuration
    keybindingManager.loadConfiguration().catch(err => {
        console.error('Failed to load initial configuration:', err);
    });
}

export function deactivate() {
    if (keybindingManager) {
        keybindingManager.dispose();
    }
}

function getReplWebviewContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lisp REPL</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        #output {
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            padding: 10px;
            height: 400px;
            overflow-y: auto;
            margin-bottom: 10px;
            white-space: pre-wrap;
        }
        #input {
            width: 100%;
            padding: 10px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            font-family: 'Courier New', monospace;
        }
        button {
            margin-top: 10px;
            padding: 8px 16px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            cursor: pointer;
        }
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .error {
            color: var(--vscode-errorForeground);
        }
        .result {
            color: var(--vscode-textLink-foreground);
        }
    </style>
</head>
<body>
    <h2>Lisp REPL</h2>
    <div id="output"></div>
    <input type="text" id="input" placeholder="Enter Lisp expression...">
    <button onclick="evaluate()">Evaluate</button>
    
    <script>
        const vscode = acquireVsCodeApi();
        const output = document.getElementById('output');
        const input = document.getElementById('input');
        
        function appendOutput(text, className = '') {
            const div = document.createElement('div');
            div.className = className;
            div.textContent = text;
            output.appendChild(div);
            output.scrollTop = output.scrollHeight;
        }
        
        function evaluate() {
            const code = input.value;
            if (!code.trim()) return;
            
            appendOutput('> ' + code);
            vscode.postMessage({ command: 'evaluate', code: code });
            input.value = '';
        }
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                evaluate();
            }
        });
        
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'result') {
                appendOutput(message.result, 'result');
            } else if (message.command === 'error') {
                appendOutput('Error: ' + message.error, 'error');
            }
        });
    </script>
</body>
</html>`;
}

