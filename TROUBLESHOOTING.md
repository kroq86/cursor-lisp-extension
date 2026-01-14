# Troubleshooting Guide

## Common Issues and Fixes

### Issue 1: Extension Not Activating

**Symptoms:**
- Commands don't appear in Command Palette
- No output in "Cursor Lisp Interpreter" output channel

**Fix:**
1. Check Output panel → "Cursor Lisp Interpreter"
2. Look for activation errors
3. Verify extension is enabled in Extensions view
4. Try reloading window (Cmd+R)

### Issue 2: Space Prefix Not Working

**Symptoms:**
- Pressing Space doesn't show "SPC" in status bar
- Keybindings don't trigger

**Fix:**
The Space prefix system has limitations. Try this alternative approach:

1. **Use a different prefix key** (like `Ctrl+Space` or `Alt+Space`)
2. **Or use direct keybindings** without prefix

### Issue 3: Keybindings Not Registered

**Symptoms:**
- `cursor-lisp.handleKey` command not found
- Context variable not working

**Fix:**
VS Code context variables set via `setContext` might not work for keybinding `when` clauses immediately. 

**Workaround:** Use a simpler keybinding approach without context variables.

### Issue 4: Lisp Code Not Executing

**Symptoms:**
- Keybindings trigger but nothing happens
- Errors in Output panel

**Fix:**
1. Check `.cursor-lisp/config.lisp` syntax
2. Verify functions are registered
3. Check Output panel for Lisp errors

### Issue 5: REPL Not Opening

**Symptoms:**
- Command "Cursor Lisp: Open REPL" not found
- Webview doesn't open

**Fix:**
1. Verify extension is activated
2. Check Output panel for errors
3. Try reloading window

## Simplified Alternative Approach

If the Space prefix system doesn't work, here's a simpler approach:

### Use Direct Keybindings

Instead of `SPC D R`, use `Ctrl+Alt+D` or `Cmd+Shift+D`:

```json
{
  "key": "ctrl+alt+d r",
  "command": "cursor-lisp.executeKeybinding",
  "args": "D R"
}
```

### Use Command Palette

All functionality is available via Command Palette:
- `Cmd+Shift+P` → "Cursor Lisp: Open REPL"
- `Cmd+Shift+P` → "Cursor Lisp: Evaluate Selection"
- `Cmd+Shift+P` → "Cursor Lisp: Reload Configuration"

## Testing Checklist

- [ ] Extension appears in Extensions view
- [ ] Output panel shows "Cursor Lisp Interpreter extension is now active!"
- [ ] Command Palette shows "Cursor Lisp" commands
- [ ] REPL opens and evaluates `(+ 1 2)` → `3`
- [ ] Config file loads without errors
- [ ] Keybindings work (if configured)

## Getting Help

1. Check Output panel → "Cursor Lisp Interpreter"
2. Check Developer Console: Help → Toggle Developer Tools
3. Check keybindings.json for conflicts
4. Try reloading window
