# How to Install the .vsix File

## Method 1: Command Line (Recommended)

### For VS Code:
```bash
code --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

### For Cursor:
```bash
cursor --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

**Steps:**
1. Open Terminal
2. Navigate to the extension directory:
   ```bash
   cd /cursor-lisp-extension
   ```
3. Run the install command above
4. Reload the window (Cmd+R / Ctrl+R)

## Method 2: GUI Installation

### In VS Code/Cursor:
1. Open VS Code/Cursor
2. Go to Extensions view (Cmd+Shift+X / Ctrl+Shift+X)
3. Click the "..." menu (top right of Extensions panel)
4. Select "Install from VSIX..."
5. Navigate to and select `cursor-lisp-interpreter-0.1.0.vsix`
6. Click "Install"
7. Reload the window when prompted

## Verify Installation

1. Open Extensions view (Cmd+Shift+X)
2. Search for "Cursor Lisp Interpreter"
3. You should see it listed as installed
4. Check Output panel → "Cursor Lisp Interpreter" for activation logs

