# Diagnostic Guide - What's Not Working?

Let's figure out what's broken step by step.

## Step 1: Check Extension Installation

**Test:** Is the extension installed?

1. Open Extensions view (`Cmd+Shift+X`)
2. Search for "Cursor Lisp Interpreter"
3. Is it listed? ✅ or ❌

**If ❌:** Install it first:
```bash
cd cursor-lisp-extension
cursor --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

---

## Step 2: Check Extension Activation

**Test:** Is the extension activating?

1. Open Output panel (`Cmd+Shift+U` or View → Output)
2. Select "Cursor Lisp Interpreter" from dropdown
3. Do you see: `"Cursor Lisp Interpreter extension is now active!"`? ✅ or ❌

**If ❌:** 
- Extension might not be enabled
- Check Extensions view → Enable it
- Reload window (`Cmd+R`)

---

## Step 3: Test REPL (Simplest Test)

**Test:** Can you open the REPL?

1. Press `Cmd+Shift+P` (Command Palette)
2. Type: `Cursor Lisp: Open REPL`
3. Does the REPL open? ✅ or ❌

**If ❌:**
- Extension not activated (see Step 2)
- Check Output panel for errors

**If ✅:** Try evaluating `(+ 1 2)` - should return `3`

---

## Step 4: Test Keybindings

**Test:** Do keybindings work?

**Problem:** The Space prefix system is complex and might not work reliably.

**Simpler Test:** Try the direct keybinding:
1. Open a file
2. Select some text
3. Press `Ctrl+Alt+E` (or `Cmd+Alt+E` on Mac)
4. Does it evaluate? ✅ or ❌

**If ❌:** Keybindings might conflict or not be registered.

---

## Step 5: Test Configuration Loading

**Test:** Is config.lisp loading?

1. Check Output panel → "Cursor Lisp Interpreter"
2. Look for errors about config file
3. Try: Command Palette → "Cursor Lisp: Reload Configuration"
4. Any errors? ✅ or ❌

**If ❌:**
- Check if `.cursor-lisp/config.lisp` exists
- Check file path in settings

---

## Common Issues

### Issue A: Space Prefix Doesn't Work

**Why:** VS Code's keybinding system doesn't easily support dynamic prefix keys like Space. The context variable approach is fragile.

**Solution:** Use Command Palette or direct keybindings instead.

### Issue B: Extension Not Activating

**Why:** Might be a compilation error or missing dependency.

**Solution:** 
1. Check Output panel
2. Try recompiling: `npm run compile`
3. Reinstall extension

### Issue C: Commands Not Found

**Why:** Extension not activated or commands not registered.

**Solution:**
1. Reload window
2. Check extension is enabled
3. Check Output panel for errors

---

## Quick Fix: Use What Works

**What definitely works:**
1. ✅ REPL via Command Palette
2. ✅ Evaluate Selection via Command Palette  
3. ✅ Direct keybinding `Ctrl+Alt+E`

**What might not work:**
1. ⚠️ Space prefix keybindings (complex, fragile)
2. ⚠️ Dynamic context variables

**Recommendation:** Use Command Palette for now, or set up direct keybindings instead of Space prefix.

---

## Report Back

Please tell me:
1. ✅ or ❌ for each step above
2. Any error messages from Output panel
3. What specifically isn't working

Then I can fix the specific issues!
