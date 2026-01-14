# Simple Setup - What Actually Works

## The Problem

The Space prefix keybinding system is complex and fragile. VS Code doesn't easily support dynamic prefix keys. Let's use what actually works!

## ✅ What Works Reliably

### 1. REPL (Always Works)

**How to use:**
1. `Cmd+Shift+P` → "Cursor Lisp: Open REPL"
2. Type: `(+ 1 2)` → Returns `3`
3. Type: `(list 1 2 3)` → Returns `[1, 2, 3]`

**This is the most reliable feature!**

### 2. Evaluate Selection (Works)

**How to use:**
1. Select Lisp code in editor
2. `Cmd+Shift+P` → "Cursor Lisp: Evaluate Selection"
3. Or use keybinding: `Ctrl+Alt+E` (or `Cmd+Alt+E` on Mac)

### 3. Direct Keybindings (Works)

Instead of Space prefix, use direct keybindings:

```json
{
  "key": "ctrl+alt+p",
  "command": "cursor-lisp.executeCustom",
  "args": "python-eval"
}
```

## 🔧 Simplified Keybinding Approach

### Option 1: Use Command Palette (Easiest)

Just use `Cmd+Shift+P` and type:
- "Cursor Lisp: Open REPL"
- "Cursor Lisp: Evaluate Selection"
- "Cursor Lisp: Reload Configuration"

### Option 2: Direct Keybindings

Add to your `keybindings.json`:

```json
[
  {
    "key": "ctrl+alt+e",
    "command": "cursor-lisp.evaluateSelection",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+r",
    "command": "cursor-lisp.repl",
    "when": "editorTextFocus"
  }
]
```

### Option 3: Custom Commands (If We Add Them)

We can add specific commands like:
- `cursor-lisp.pythonEval` - Python eval selection
- `cursor-lisp.restartDocker` - Restart Docker

Then bind them directly:
```json
{
  "key": "ctrl+alt+p",
  "command": "cursor-lisp.pythonEval"
}
```

## 🚫 What Doesn't Work Well

### Space Prefix System

**Problem:** VS Code's keybinding system doesn't support dynamic prefix keys reliably. The context variable approach is fragile.

**Why it fails:**
- Context variables set via `setContext` don't always work for `when` clauses
- Space key conflicts with normal typing
- Timing issues with key sequences

**Solution:** Don't use Space prefix. Use direct keybindings or Command Palette instead.

## 🎯 Recommended Setup

1. **Install extension** (if not done)
2. **Use REPL** via Command Palette - this always works!
3. **Add direct keybindings** for common actions
4. **Skip Space prefix** - it's too fragile

## Quick Test

1. `Cmd+Shift+P` → "Cursor Lisp: Open REPL"
2. Type: `(+ 1 2)`
3. Should return: `3`

**If this works, the extension is working!** The Space prefix is just a nice-to-have that's hard to make reliable.

## Next Steps

If you want Space prefix to work, we'd need to:
1. Use a different approach (like a modal mode)
2. Or accept that it's fragile and use alternatives

But the core Lisp interpreter and REPL work great!
