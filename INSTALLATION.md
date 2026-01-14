# Installation Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd cursor-lisp-extension
   npm install
   ```

2. **Compile TypeScript:**
   ```bash
   npm run compile
   ```

3. **Test the extension:**
   - Press `F5` in VS Code/Cursor to open a new window with the extension loaded
   - Or package and install:
     ```bash
     npm install -g @vscode/vsce
     vsce package
     code --install-extension cursor-lisp-interpreter-0.1.0.vsix
     ```

## Setting Up Space Prefix Keybindings

To enable Space (SPC) prefix keybindings, you need to add keybindings to VS Code's keybindings.json:

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type "Preferences: Open Keyboard Shortcuts (JSON)"
3. Add the keybindings from `keybindings.json.example`

Or manually add to your `keybindings.json`:

```json
[
  {
    "key": "space",
    "command": "cursor-lisp.spacePrefix",
    "when": "editorTextFocus && !suggestWidgetVisible && !parameterHintsVisible"
  },
  {
    "key": "d",
    "command": "cursor-lisp.handleKey",
    "args": "D",
    "when": "cursor-lisp.spacePrefixActive"
  },
  {
    "key": "r",
    "command": "cursor-lisp.handleKey",
    "args": "R",
    "when": "cursor-lisp.spacePrefixActive"
  }
  // Add more keys as needed
]
```

**Note:** The `cursor-lisp.spacePrefixActive` context key needs to be implemented via a context variable. For now, you can use a simpler approach by removing the `when` clause for individual keys, or we can enhance the extension to set this context.

## Configuration File

1. Create `.cursor-lisp/config.lisp` in your workspace root
2. Or configure the path in VS Code settings:
   - Open Settings (`Cmd+,` / `Ctrl+,`)
   - Search for "cursorLisp.configPath"
   - Set your custom path

3. Example configuration (see `.cursor-lisp/config.lisp`):
   ```lisp
   (define-key "D R" "(execute-command \"docker-compose.restart\")")
   (define-key "P P" "(python-eval-selection)")
   ```

## Troubleshooting

### Space prefix not working
- Make sure keybindings are added to `keybindings.json`
- Check that the extension is activated (check Output panel for "Cursor Lisp Interpreter")
- Try reloading the window (`Cmd+R` / `Ctrl+R`)

### Lisp code not executing
- Check the Output panel for errors
- Verify your Lisp syntax is correct
- Make sure VS Code API functions are available (they're registered automatically)

### Configuration not loading
- Check the config path in settings
- Verify the file exists and is readable
- Check Output panel for parse errors

## Development Mode

To develop and test the extension:

1. Open the extension folder in VS Code/Cursor
2. Press `F5` to launch a new Extension Development Host window
3. Make changes to the code
4. Press `Cmd+R` / `Ctrl+R` in the Extension Development Host to reload
5. Test your changes

## Building for Distribution

```bash
# Install vsce if not already installed
npm install -g @vscode/vsce

# Package the extension
vsce package

# This creates a .vsix file that can be installed
code --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

