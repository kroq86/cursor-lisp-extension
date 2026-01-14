# Cursor Lisp Interpreter Extension

A full-featured Lisp interpreter extension for Cursor/VS Code that enables Emacs-like keybindings and custom Lisp script execution.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Full Lisp Interpreter**: Complete Lisp runtime with support for functions, variables, and control flow
- ✅ **Leader Key Bindings**: Vim-style keybinding system with `,` as leader (e.g., `,dr` for Docker restart)
- ✅ **Custom Scripts**: Write and execute custom Lisp scripts for automation
- ✅ **VS Code API Integration**: Access VS Code commands, terminals, and editor functions from Lisp
- ✅ **REPL**: Interactive Lisp REPL for testing and development
- ✅ **Configuration File**: Define keybindings and functions in a Lisp configuration file

## Quick Start

### 1. Build the Extension

```bash
# Navigate to the extension directory
cd cursor-lisp-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package the extension (creates .vsix file)
npm install -g @vscode/vsce
vsce package
```

This creates `cursor-lisp-interpreter-0.1.0.vsix` (≈17 KB).

### 2. Install the Extension

**For Cursor:**
```bash
cursor --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

**For VS Code:**
```bash
code --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

**Or via GUI:**
1. Open Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. Click `...` menu → "Install from VSIX..."
3. Select `cursor-lisp-interpreter-0.1.0.vsix`
4. Reload window (`Cmd+R` / `Ctrl+R`)

**Or test in Development Mode (no build needed):**
1. Open the extension folder in VS Code/Cursor
2. Press `F5` to launch Extension Development Host
3. A new window opens with the extension loaded

### 3. Test the REPL

1. Press `Cmd+Shift+P` / `Ctrl+Shift+P` (Command Palette)
2. Type: `Cursor Lisp: Open REPL`
3. Try: `(+ 1 2)` → Returns `3`
4. Try: `(list 1 2 3)` → Returns `[1, 2, 3]`

**If this works, the extension is working!**

### 4. Configure Keybindings (Optional)

To enable `,` (comma) as leader key, add to your `keybindings.json`:

**Open keybindings.json:**
- Press `Cmd+Shift+P` / `Ctrl+Shift+P`
- Type: `Preferences: Open Keyboard Shortcuts (JSON)`

**Add these keybindings:**
```json
[
  {
    "key": ",",
    "command": "cursor-lisp.spacePrefix",
    "when": "editorTextFocus && !suggestWidgetVisible && !parameterHintsVisible && vim.mode != 'Insert'"
  },
  {
    "key": "d",
    "command": "cursor-lisp.handleKey",
    "args": "D",
    "when": "cursor-lisp.spacePrefixActive == true"
  },
  {
    "key": "r",
    "command": "cursor-lisp.handleKey",
    "args": "R",
    "when": "cursor-lisp.spacePrefixActive == true"
  },
  {
    "key": "p",
    "command": "cursor-lisp.handleKey",
    "args": "P",
    "when": "cursor-lisp.spacePrefixActive == true"
  },
  {
    "key": "f",
    "command": "cursor-lisp.handleKey",
    "args": "F",
    "when": "cursor-lisp.spacePrefixActive == true"
  },
  {
    "key": "t",
    "command": "cursor-lisp.handleKey",
    "args": "T",
    "when": "cursor-lisp.spacePrefixActive == true"
  },
  {
    "key": "w",
    "command": "cursor-lisp.handleKey",
    "args": "W",
    "when": "cursor-lisp.spacePrefixActive == true"
  },
  {
    "key": "s",
    "command": "cursor-lisp.handleKey",
    "args": "S",
    "when": "cursor-lisp.spacePrefixActive == true"
  }
]
```

**Alternative Leader Keys:**
- `;` (semicolon) - another popular Vim choice
- `\` (backslash) - Vim's default leader
- `Alt+Space` or `Ctrl+Space` - modifier-based leader

Save and reload window (`Cmd+R` / `Ctrl+R`).

## Configuration

Create `.cursor-lisp/config.lisp` in your workspace root:

```lisp
;; ,dr - Restart Docker
(define-key "D R" 
  "(execute-command \"docker-compose.restart\")")

;; ,pp - Python eval selection
(define-key "P P"
  "(let ((code (get-selection)))
     (run-terminal-command (concat \"python3 -c '\" code \"'\")))")

;; ,ff - Find file
(define-key "F F" "(execute-command \"workbench.action.quickOpen\")")

;; ,ws - Save all files
(define-key "W S" "(execute-command \"workbench.action.files.saveAll\")")

;; ,tt - Run tests
(define-key "T T" "(run-terminal-command \"npm test\")")

;; Custom functions
(defun format-and-save ()
  "Format document and save"
  (execute-command "editor.action.formatDocument")
  (execute-command "workbench.action.files.save"))

(define-key "F S" "(format-and-save)")
```

## Available Commands

- `Cursor Lisp: Evaluate` - Evaluate Lisp expression from input
- `Cursor Lisp: Evaluate Selection` - Evaluate selected Lisp code
- `Cursor Lisp: Open REPL` - Open interactive Lisp REPL
- `Cursor Lisp: Reload Configuration` - Reload configuration file

## Available Lisp Functions

### VS Code Integration
- `(execute-command "command-name" ...args)` - Execute VS Code command
- `(run-terminal-command "command" ["terminal-name"])` - Run command in terminal
- `(open-file "path")` - Open file in editor
- `(get-selection)` - Get selected text
- `(insert-text "text")` - Insert text at cursor

### Built-in Lisp
- **Arithmetic:** `+`, `-`, `*`, `/`
- **Comparison:** `=`, `>`, `<`, `>=`, `<=`
- **Lists:** `list`, `car`, `cdr`, `cons`, `length`
- **Control:** `if`, `cond`, `and`, `or`, `not`
- **Definitions:** `defun`, `lambda`, `setq`, `let`
- **Strings:** `concat`

## Usage Examples

### Example 1: Docker Restart (,dr)
```lisp
(define-key "D R" "(execute-command \"docker-compose.restart\")")
```
Usage: Press `,` then `d` then `r`

### Example 2: Python Eval Selection (,pp)
```lisp
(defun python-eval ()
  (let ((code (get-selection)))
    (run-terminal-command (concat "python3 -c '" code "'"))))

(define-key "P P" "(python-eval)")
```
Usage: Select Python code, press `,` then `p` then `p`

### Example 3: Format and Save (,fs)
```lisp
(defun format-and-save ()
  (execute-command "editor.action.formatDocument")
  (execute-command "workbench.action.files.save"))

(define-key "F S" "(format-and-save)")
```
Usage: Press `,` then `f` then `s`

## Settings

- `cursorLisp.configPath` - Path to Lisp configuration file (default: `${workspaceFolder}/.cursor-lisp/config.lisp`)
- `cursorLisp.enableSpacePrefix` - Enable leader key bindings (default: true)

## Troubleshooting

### Extension Not Loading
1. Check Output panel: View → Output → "Cursor Lisp Interpreter"
2. Verify extension is enabled in Extensions view
3. Reload window (`Cmd+R` / `Ctrl+R`)

### Leader Key Not Working
If `,` (comma) doesn't work as leader key:

**Check:**
1. Verify keybindings are in `keybindings.json`
2. Reload window (`Cmd+R`)
3. Press `,` in editor - should briefly show in status bar

**Try alternative leader keys:**
- `;` (semicolon) - change `"key": ","` to `"key": ";"`
- `\` (backslash) - change to `"key": "\\"`
- `Alt+Space` - change to `"key": "alt+space"`

**Or use Command Palette:**
- `Cmd+Shift+P` → type "Cursor Lisp" commands
- Use direct keybindings like `Ctrl+Alt+E`

### REPL Not Opening
1. Verify extension is activated (check Output panel)
2. Try Command Palette → "Cursor Lisp: Open REPL"
3. Check for errors in Output panel

### Configuration Not Loading
1. Verify `.cursor-lisp/config.lisp` exists in workspace root
2. Check syntax for errors
3. Run "Cursor Lisp: Reload Configuration" from Command Palette

## Development

### Build from Source

```bash
# Clone repository
git clone https://github.com/kroq86/cursor-lisp-extension.git
cd cursor-lisp-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Test in development mode
# Press F5 in VS Code/Cursor

# Package extension
npm install -g @vscode/vsce
vsce package
```

### Watch Mode
```bash
npm run watch
```

## Publishing

### To GitHub Releases
1. Create repository on GitHub: `cursor-lisp-extension`
2. Push code:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/kroq86/cursor-lisp-extension.git
   git push -u origin main
   ```
3. Create release with tag `v0.1.0`
4. Upload `.vsix` file to release

### To VS Code Marketplace
```bash
npm install -g @vscode/vsce
vsce publish
```

## Known Limitations

- Space prefix keybindings require manual configuration in `keybindings.json`
- Context variable approach for Space prefix is fragile and may not work reliably
- Some advanced Lisp features (macros, continuations) are not implemented
- Performance may vary with complex scripts

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

[kroq86](https://github.com/kroq86)

