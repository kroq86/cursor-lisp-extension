# Quick Start Guide

## What This Extension Does

This extension adds a full Lisp interpreter to Cursor/VS Code, allowing you to:
- Define custom keybindings using Lisp (e.g., `SPC D R` for Docker restart)
- Write custom automation scripts in Lisp
- Execute VS Code commands from Lisp code
- Create complex workflows that go beyond simple key remapping

## Installation Steps

### 1. Build the Extension

```bash
cd cursor-lisp-extension
npm install
npm run compile
```

### 2. Install in Cursor/VS Code

**Option A: Development Mode (for testing)**
- Press `F5` in VS Code/Cursor
- A new window opens with the extension loaded

**Option B: Package and Install**
```bash
npm install -g @vscode/vsce
vsce package
code --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

### 3. Configure Keybindings

Add to your `keybindings.json` (Cmd+Shift+P → "Preferences: Open Keyboard Shortcuts (JSON)"):

```json
[
  {
    "key": "space",
    "command": "cursor-lisp.spacePrefix",
    "when": "editorTextFocus && !suggestWidgetVisible"
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
  }
]
```

### 4. Create Configuration File

Create `.cursor-lisp/config.lisp` in your workspace:

```lisp
;; Example: SPC D R restarts Docker
(define-key "D R" 
  "(execute-command \"docker-compose.restart\")")

;; Example: SPC P P evaluates selected Python code
(define-key "P P"
  "(let ((code (get-selection)))
     (run-terminal-command (concat \"python3 -c '\" code \"'\")))")
```

## Usage Examples

### Example 1: Docker Restart (SPC D R)

```lisp
(define-key "D R" 
  "(execute-command \"docker-compose.restart\")")
```

### Example 2: Python Eval Selection (SPC P P)

```lisp
(defun python-eval ()
  "Evaluate selected Python code"
  (let ((code (get-selection)))
    (run-terminal-command (concat "python3 -c '\" code \"'"))))

(define-key "P P" "(python-eval)")
```

### Example 3: Format and Save (SPC F S)

```lisp
(defun format-and-save ()
  "Format document and save"
  (execute-command "editor.action.formatDocument")
  (execute-command "workbench.action.files.save"))

(define-key "F S" "(format-and-save)")
```

### Example 4: Run Tests (SPC T T)

```lisp
(define-key "T T" 
  "(run-terminal-command \"npm test\")")
```

## Available Lisp Functions

### VS Code Integration
- `(execute-command "command-name")` - Run VS Code command
- `(run-terminal-command "cmd")` - Execute shell command
- `(get-selection)` - Get selected text
- `(open-file "path")` - Open file
- `(insert-text "text")` - Insert text

### Built-in Lisp
- Arithmetic: `+`, `-`, `*`, `/`
- Lists: `list`, `car`, `cdr`, `cons`
- Control: `if`, `cond`, `let`, `defun`
- Strings: `concat`

## Testing

1. Open Command Palette (Cmd+Shift+P)
2. Run "Cursor Lisp: Open REPL"
3. Try: `(+ 1 2)` → should return `3`
4. Try: `(list 1 2 3)` → should return `[1, 2, 3]`

## Troubleshooting

**Space prefix not working?**
- Check keybindings.json has the Space keybinding
- Reload window (Cmd+R)
- Check Output panel for errors

**Lisp code not executing?**
- Check syntax in config.lisp
- Verify function names are correct
- Check Output panel for error messages

**Configuration not loading?**
- Verify `.cursor-lisp/config.lisp` exists
- Check file path in settings
- Run "Cursor Lisp: Reload Configuration"

## Next Steps

- Customize `.cursor-lisp/config.lisp` with your own keybindings
- Write custom Lisp functions for complex workflows
- Share your configurations with your team!

