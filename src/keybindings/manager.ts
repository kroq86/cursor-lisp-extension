import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { LispInterpreter } from '../lisp/interpreter';
import { VSCodeAPI } from '../api/vscode-api';

/**
 * Manages Space (SPC) prefix keybindings and custom Lisp scripts
 */
export class KeybindingManager {
    private interpreter: LispInterpreter;
    private vsCodeAPI: VSCodeAPI;
    private context: vscode.ExtensionContext;
    private spacePrefixActive: boolean = false;
    private spacePrefixTimeout: NodeJS.Timeout | null = null;
    private currentSequence: string[] = [];
    private keybindings: Map<string, string> = new Map(); // Map of key sequences to Lisp code
    private spacePrefixContext: vscode.ExtensionContext | null = null;
    private lastSpacePress: number = 0;
    private readonly SPACE_DOUBLE_PRESS_TIMEOUT = 300; // 300ms to detect double press

    constructor(
        interpreter: LispInterpreter,
        vsCodeAPI: VSCodeAPI,
        context: vscode.ExtensionContext
    ) {
        this.interpreter = interpreter;
        this.vsCodeAPI = vsCodeAPI;
        this.context = context;
        this.spacePrefixContext = context;
        this.setupSpacePrefix();
    }

    /**
     * Setup Space prefix keybinding detection
     */
    private setupSpacePrefix() {
        // Register a keybinding handler for Space
        const spacePrefixCommand = vscode.commands.registerCommand(
            'cursor-lisp.spacePrefix',
            () => {
                this.handleSpacePrefix();
            }
        );

        // Register handler for individual keys during Space prefix mode
        const handleKeyCommand = vscode.commands.registerCommand(
            'cursor-lisp.handleKey',
            async (key: string) => {
                await this.handleKey(key);
            }
        );

        this.context.subscriptions.push(spacePrefixCommand, handleKeyCommand);
    }

    /**
     * Handle Space prefix keypress (double-press detection)
     */
    private handleSpacePrefix() {
        const now = Date.now();
        const timeSinceLastPress = now - this.lastSpacePress;

        if (timeSinceLastPress < this.SPACE_DOUBLE_PRESS_TIMEOUT && this.lastSpacePress > 0) {
            // Double press detected - activate prefix mode
            this.spacePrefixActive = true;
            this.currentSequence = [];

            // Set context variable for keybindings
            vscode.commands.executeCommand('setContext', 'cursor-lisp.spacePrefixActive', true);

            // Show status bar indicator
            vscode.window.setStatusBarMessage('SPC', 2000);

            // Reset timeout
            if (this.spacePrefixTimeout) {
                clearTimeout(this.spacePrefixTimeout);
            }

            // Timeout after 2 seconds
            this.spacePrefixTimeout = setTimeout(() => {
                this.spacePrefixActive = false;
                this.currentSequence = [];
                vscode.commands.executeCommand('setContext', 'cursor-lisp.spacePrefixActive', false);
            }, 2000);

            this.lastSpacePress = 0; // Reset
        } else {
            // Single press - just record the time
            this.lastSpacePress = now;
        }
    }

    /**
     * Handle keypress during Space prefix mode
     */
    async handleKey(key: string): Promise<boolean> {
        if (!this.spacePrefixActive) {
            return false;
        }

        // Reset timeout
        if (this.spacePrefixTimeout) {
            clearTimeout(this.spacePrefixTimeout);
        }

        this.currentSequence.push(key);
        const sequence = this.currentSequence.join(' ');

        // Check if we have a matching keybinding
        if (this.keybindings.has(sequence)) {
            const lispCode = this.keybindings.get(sequence)!;
            await this.executeLispCode(lispCode);
            this.spacePrefixActive = false;
            this.currentSequence = [];
            vscode.commands.executeCommand('setContext', 'cursor-lisp.spacePrefixActive', false);
            if (this.spacePrefixTimeout) {
                clearTimeout(this.spacePrefixTimeout);
            }
            return true;
        }

        // Check for partial matches
        const hasPartialMatch = Array.from(this.keybindings.keys()).some(
            k => k.startsWith(sequence)
        );

        if (!hasPartialMatch) {
            // No match, reset
            vscode.window.showWarningMessage(`No keybinding found for SPC ${sequence}`);
            this.spacePrefixActive = false;
            this.currentSequence = [];
            vscode.commands.executeCommand('setContext', 'cursor-lisp.spacePrefixActive', false);
            if (this.spacePrefixTimeout) {
                clearTimeout(this.spacePrefixTimeout);
            }
            return false;
        }

        // Show current sequence in status bar
        vscode.window.setStatusBarMessage(`SPC ${sequence}...`, 2000);
        
        // Set new timeout
        this.spacePrefixTimeout = setTimeout(() => {
            this.spacePrefixActive = false;
            this.currentSequence = [];
            vscode.commands.executeCommand('setContext', 'cursor-lisp.spacePrefixActive', false);
        }, 2000);
        
        return true;
    }

    /**
     * Execute Lisp code
     */
    private async executeLispCode(code: string): Promise<void> {
        try {
            // Register VS Code functions before execution
            this.registerVSCodeFunctions();
            // Code might be a string that needs to be evaluated, or already parsed
            let codeToEval = code;
            // If it's a string that looks like Lisp code, evaluate it
            if (typeof code === 'string' && (code.trim().startsWith('(') || code.trim().startsWith('"'))) {
                codeToEval = code;
            }
            const result = this.interpreter.evaluate(codeToEval);
            // If result is a Promise, await it
            if (result && typeof result.then === 'function') {
                await result;
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Lisp execution error: ${error.message}`);
            console.error('Lisp execution error:', error);
        }
    }

    /**
     * Load configuration from Lisp file
     */
    async loadConfiguration(): Promise<void> {
        const config = vscode.workspace.getConfiguration('cursorLisp');
        const configPath = config.get<string>('configPath', '');

        if (!configPath) {
            return;
        }

        // Resolve path (supports ${workspaceFolder} variable)
        let resolvedPath = configPath;
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            resolvedPath = configPath.replace(
                '${workspaceFolder}',
                vscode.workspace.workspaceFolders[0].uri.fsPath
            );
        }

        if (!fs.existsSync(resolvedPath)) {
            // Create default config file
            await this.createDefaultConfig(resolvedPath);
            return;
        }

        try {
            const content = fs.readFileSync(resolvedPath, 'utf-8');
            await this.parseConfiguration(content);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to load config: ${error.message}`);
        }
    }

    /**
     * Parse Lisp configuration file
     */
    private async parseConfiguration(content: string): Promise<void> {
        // Register VS Code API functions in Lisp environment
        this.registerVSCodeFunctions();

        // Evaluate the configuration
        try {
            const result = this.interpreter.evaluate(content);
            // If result is a Promise, await it
            if (result && typeof result.then === 'function') {
                await result;
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Config parse error: ${error.message}`);
            console.error('Config parse error:', error);
        }
    }

    /**
     * Register VS Code API functions in Lisp environment
     */
    private registerVSCodeFunctions(): void {
        // Register keybinding function
        this.interpreter.registerFunction('define-key', (sequence: string, code: string) => {
            this.keybindings.set(sequence, code);
        });

        // Register VS Code command execution (wrapped to handle async)
        this.interpreter.registerFunction('execute-command', (command: string, ...args: any[]) => {
            this.vsCodeAPI.executeCommand(command, ...args).catch(err => {
                vscode.window.showErrorMessage(`Command failed: ${err.message}`);
            });
        });

        // Register terminal operations
        this.interpreter.registerFunction('run-terminal-command', (command: string, terminalName?: string) => {
            this.vsCodeAPI.runTerminalCommand(command, terminalName || 'default').catch(err => {
                vscode.window.showErrorMessage(`Terminal command failed: ${err.message}`);
            });
        });

        // Register file operations
        this.interpreter.registerFunction('open-file', (filePath: string) => {
            this.vsCodeAPI.openFile(filePath).catch(err => {
                vscode.window.showErrorMessage(`Failed to open file: ${err.message}`);
            });
        });

        // Register selection operations
        this.interpreter.registerFunction('get-selection', () => {
            return this.vsCodeAPI.getSelection();
        });

        this.interpreter.registerFunction('insert-text', (text: string) => {
            this.vsCodeAPI.insertText(text).catch(err => {
                vscode.window.showErrorMessage(`Failed to insert text: ${err.message}`);
            });
        });

        // String operations
        this.interpreter.registerFunction('concat', (...args: any[]) => {
            return args.map(String).join('');
        });

        // Expand/Contract region
        this.interpreter.registerFunction('expand-region', () => {
            this.vsCodeAPI.expandRegion().catch(err => {
                vscode.window.showErrorMessage(`Failed to expand region: ${err.message}`);
            });
        });

        this.interpreter.registerFunction('contract-region', () => {
            this.vsCodeAPI.contractRegion().catch(err => {
                vscode.window.showErrorMessage(`Failed to contract region: ${err.message}`);
            });
        });
    }

    /**
     * Create default configuration file
     */
    private async createDefaultConfig(configPath: string): Promise<void> {
        const dir = path.dirname(configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const defaultConfig = `;; Cursor Lisp Configuration
;; Define custom keybindings and functions here

;; Example: SPC D R restarts Docker
(define-key "D R" 
  "(execute-command \"docker-compose.restart\")")

;; Example: SPC P P opens Python terminal with selected code
(define-key "P P"
  "(let ((code (get-selection)))
     (run-terminal-command (concat \"python3 -c '\" code \"'\")))")

;; You can define custom functions
(defun restart-docker ()
  "Restart Docker containers"
  (execute-command "docker-compose.restart"))

(defun python-eval-selection ()
  "Evaluate selected Python code in terminal"
  (let ((code (get-selection)))
    (run-terminal-command (concat "python3 -c '\" code \"'"))))

;; Register keybindings using functions
(define-key "D R" "(restart-docker)")
(define-key "P P" "(python-eval-selection)")
`;

        fs.writeFileSync(configPath, defaultConfig, 'utf-8');
        vscode.window.showInformationMessage(
            `Created default config at ${configPath}. Please customize it.`
        );
    }

    dispose() {
        if (this.spacePrefixTimeout) {
            clearTimeout(this.spacePrefixTimeout);
        }
        vscode.commands.executeCommand('setContext', 'cursor-lisp.spacePrefixActive', false);
    }
}

