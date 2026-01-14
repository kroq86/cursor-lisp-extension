# Fix: Space Prefix Not Working

## Problem
Space prefix (SPC SPC) doesn't show "SPC" in status bar.

## Solution
The keybindings are now included in the extension's package.json, but you need to **reinstall** the extension for them to take effect.

## Quick Fix

1. **Uninstall current extension:**
   - Extensions view (Cmd+Shift+X)
   - Find "Cursor Lisp Interpreter"
   - Click Uninstall

2. **Reinstall the new VSIX:**
   - Extensions view → "..." → "Install from VSIX..."
   - Select: `cursor-lisp-interpreter-0.1.0.vsix`
   - Click Install
   - Reload window (Cmd+R)

3. **Test:**
   - Press Space twice quickly (within 300ms)
   - Should see "SPC" in status bar

## Alternative: Manual Keybinding Setup

If automatic keybindings don't work, add manually:

1. Command Palette (Cmd+Shift+P) → "Preferences: Open Keyboard Shortcuts (JSON)"
2. Add this:

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

3. Save and reload window

## How It Works

- **Single Space press** → Normal space character (no conflict)
- **Double Space press** (within 300ms) → Activates SPC prefix mode
- **Then press D R** → Executes `SPC D R` keybinding
- **Then press P P** → Executes `SPC P P` keybinding
