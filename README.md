# Cursor Lisp Interpreter Extension

A full-featured Lisp interpreter extension for Cursor/VS Code that enables Emacs-like keybindings and custom script execution.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Full Lisp Interpreter**: Complete Lisp runtime with support for functions, variables, and control flow
- ✅ **Space (SPC) Prefix Keybindings**: Emacs-style keybinding system (e.g., `SPC D R` for Docker restart)
- ✅ **Custom Scripts**: Write and execute custom Lisp scripts for automation
- ✅ **VS Code API Integration**: Access VS Code commands, terminals, and editor functions from Lisp
- ✅ **REPL**: Interactive Lisp REPL for testing and development
- ✅ **Configuration File**: Define keybindings and functions in a Lisp configuration file

## Installation

### From VSIX (Recommended)

1. Download the latest `.vsix` file from [Releases](https://github.com/kroq86/cursor-lisp-extension/releases)
2. Open Cursor/VS Code
3. Go to Extensions view (`Cmd+Shift+X`)
4. Click `...` menu → "Install from VSIX..."
5. Select the downloaded `.vsix` file
6. Reload window (`Cmd+R`)

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/kroq86/cursor-lisp-extension.git
   cd cursor-lisp-extension
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile TypeScript:
   ```bash
   npm run compile
   ```
4. Press `F5` in VS Code/Cursor to open a new window with the extension loaded
5. Or package and install:
   ```bash
   npm install -g @vscode/vsce
   vsce package
   code --install-extension cursor-lisp-interpreter-0.1.0.vsix
   ```

## Configuration

Create a `.cursor-lisp/config.lisp` file in your workspace root (or configure the path in settings):

```lisp
;; Cursor Lisp Configuration

;; Define keybindings: (define-key "SEQUENCE" "LISP-CODE")
;; Sequence is space-separated keys after SPC prefix

;; Example: SPC D R restarts Docker
(define-key "D R" 
  "(execute-command \"docker-compose.restart\")")

;; Example: SPC P P opens Python terminal with selected code
(define-key "P P"
  "(let ((code (get-selection)))
     (run-terminal-command (concat \"python3 -c '\" code \"'\")))")

;; Define custom functions
(defun restart-docker ()
  "Restart Docker containers"
  (execute-command "docker-compose.restart"))

(defun python-eval-selection ()
  "Evaluate selected Python code in terminal"
  (let ((code (get-selection)))
    (run-terminal-command (concat "python3 -c '\" code \"'"))))

;; Use functions in keybindings
(define-key "D R" "(restart-docker)")
(define-key "P P" "(python-eval-selection)")
```

## Available Lisp Functions

### VS Code Integration
- `(execute-command "command-name" ...args)` - Execute VS Code command
- `(run-terminal-command "command" ["terminal-name"])` - Run command in terminal
- `(open-file "path")` - Open file in editor
- `(get-selection)` - Get selected text
- `(insert-text "text")` - Insert text at cursor

### Built-in Lisp Functions
- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `=`, `>`, `<`, `>=`, `<=`
- Lists: `list`, `car`, `cdr`, `cons`, `length`
- Control: `if`, `cond`, `and`, `or`, `not`
- Definitions: `defun`, `lambda`, `setq`, `let`

## Usage Examples

### Keybinding Examples

**SPC D R** - Restart Docker:
```lisp
(define-key "D R" "(execute-command \"docker-compose.restart\")")
```

**SPC P P** - Python eval selection:
```lisp
(define-key "P P" 
  "(let ((code (get-selection)))
     (run-terminal-command (concat \"python3 -c '\" code \"'\")))")
```

**SPC F F** - Find file:
```lisp
(define-key "F F" "(execute-command \"workbench.action.quickOpen\")")
```

### Custom Functions

```lisp
(defun format-code ()
  "Format current file"
  (execute-command "editor.action.formatDocument"))

(defun run-tests ()
  "Run tests in terminal"
  (run-terminal-command "npm test"))

(define-key "F F" "(format-code)")
(define-key "T T" "(run-tests)")
```

## Commands

- `Cursor Lisp: Evaluate` - Evaluate Lisp expression from input
- `Cursor Lisp: Evaluate Selection` - Evaluate selected Lisp code
- `Cursor Lisp: Open REPL` - Open interactive Lisp REPL
- `Cursor Lisp: Reload Configuration` - Reload configuration file

## Settings

- `cursorLisp.configPath` - Path to Lisp configuration file (default: `${workspaceFolder}/.cursor-lisp/config.lisp`)
- `cursorLisp.enableSpacePrefix` - Enable Space prefix keybindings (default: true)

## Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch mode
npm run watch

# Package extension
vsce package
```

## Limitations

- The Space prefix keybinding requires manual keybinding configuration in VS Code keybindings.json
- Some advanced Lisp features (macros, continuations) are not yet implemented
- Performance may vary with complex scripts

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

[kroq86](https://github.com/kroq86)

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

