# Quick Command Reference

## 🚀 Install Extension (Choose One)

### For Cursor:
```bash
cd /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension
cursor --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

### For VS Code:
```bash
cd /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension
code --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

**Then reload window:** Press `Cmd+R` (Mac) or `Ctrl+R` (Windows/Linux)

---

## ⚙️ Configure Keybindings

### Option 1: Automated Script
```bash
cd /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension
./setup-keybindings.sh
```

### Option 2: Manual
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: `Preferences: Open Keyboard Shortcuts (JSON)`
3. Add the keybindings from `keybindings.json.example`
4. Save and reload window

---

## 🧪 Test REPL

1. Press `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Type: `Cursor Lisp: Open REPL`
3. In REPL, type: `(+ 1 2)` and press Enter
4. **Expected:** Should return `3`

---

## ⌨️ Test Keybindings (SPC P P)

1. Open any file in editor
2. Select some code (e.g., `print("Hello")`)
3. Press **Space** (should see "SPC" in status bar)
4. Press **P** (should see "SPC P" in status bar)
5. Press **P** again (executes Python eval)

**Expected:** Terminal opens and runs the selected code

---

## ✅ Verify Setup

**Check extension is installed:**
- Extensions view (`Cmd+Shift+X`) → Search "Cursor Lisp Interpreter"

**Check config file exists:**
```bash
ls -la /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/.cursor-lisp/config.lisp
```
✅ Already created!

**Check VSIX file:**
```bash
ls -lh /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension/cursor-lisp-interpreter-0.1.0.vsix
```
✅ File exists (17 KB)

---

## 📝 Files Ready

- ✅ VSIX package: `cursor-lisp-interpreter-0.1.0.vsix` (17 KB)
- ✅ Config file: `.cursor-lisp/config.lisp` (copied to workspace root)
- ✅ Keybindings example: `keybindings.json.example`
- ✅ Setup script: `setup-keybindings.sh`

---

## 🎯 Next Steps

1. **Install:** Run the install command above for your editor
2. **Configure:** Run `./setup-keybindings.sh` or add manually
3. **Test:** Open REPL and try `(+ 1 2)`
4. **Use:** Try `SPC P P` with selected code

See `STEP_BY_STEP_GUIDE.md` for detailed instructions!

