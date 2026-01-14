# Step-by-Step Installation & Usage Guide

## Step 1: Install the Extension

### Option A: Install VSIX File (Production)

**For Cursor:**
```bash
cd /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension
cursor --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

**For VS Code:**
```bash
cd /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension
code --install-extension cursor-lisp-interpreter-0.1.0.vsix
```

**Then:**
- Reload the window: Press `Cmd+R` (Mac) or `Ctrl+R` (Windows/Linux)
- Or: Command Palette → "Developer: Reload Window"

### Option B: Development Mode (For Testing)

1. Open the extension folder in Cursor/VS Code:
   ```bash
   cd /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension
   cursor .  # or code .
   ```

2. Press `F5` to launch Extension Development Host
   - A new window opens with the extension loaded
   - Check Output panel → "Cursor Lisp Interpreter" for logs

---

## Step 2: Configure Keybindings

### Option A: Automated Setup Script

```bash
cd /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension
./setup-keybindings.sh
```

The script will:
- Find your keybindings.json file
- Add the required keybindings
- Create a backup of your existing keybindings

### Option B: Manual Setup

1. **Open Command Palette:**
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)

2. **Open Keyboard Shortcuts JSON:**
   - Type: `Preferences: Open Keyboard Shortcuts (JSON)`
   - Press Enter

3. **Add the keybindings:**
   Copy and paste this into your keybindings.json:

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

4. **Save the file** (Cmd+S / Ctrl+S)

5. **Reload the window** (Cmd+R / Ctrl+R)

---

## Step 3: Verify Configuration File

The extension looks for `.cursor-lisp/config.lisp` in your workspace root.

**Check if it exists:**
```bash
ls -la /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/.cursor-lisp/config.lisp
```

**If it doesn't exist, create it:**
```bash
mkdir -p /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/.cursor-lisp
cp /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/cursor-lisp-extension/.cursor-lisp/config.lisp \
   /Users/kirill_ostapenko/UC/CLONE/energyai-agentic-uc4-startup/.cursor-lisp/config.lisp
```

Or copy the example from the extension directory.

---

## Step 4: Test the REPL

1. **Open Command Palette:** `Cmd+Shift+P` / `Ctrl+Shift+P`

2. **Open REPL:**
   - Type: `Cursor Lisp: Open REPL`
   - Press Enter
   - A REPL panel opens on the right side

3. **Test basic expressions:**
   - Type: `(+ 1 2)` and press Enter
   - **Expected result:** `3`
   
   - Type: `(list 1 2 3)` and press Enter
   - **Expected result:** `[1, 2, 3]`
   
   - Type: `(car (list 1 2 3))` and press Enter
   - **Expected result:** `1`

4. **Test conditional:**
   - Type: `(if (> 5 3) "yes" "no")` and press Enter
   - **Expected result:** `"yes"`

**If the REPL works, the extension is installed correctly!**

---

## Step 5: Test Space Prefix Keybindings

### Test 1: Activate Space Prefix

1. **Open any file** in the editor (e.g., a Python file, text file, etc.)

2. **Press Space** (while editor has focus)
   - You should see "SPC" briefly in the status bar (bottom of window)
   - This means Space prefix is active

3. **If nothing happens:**
   - Check that keybindings were added correctly
   - Verify the extension is enabled (Extensions view)
   - Reload window (Cmd+R)

### Test 2: Use a Keybinding (SPC P P)

**Setup:** First, make sure you have Python code selected or the function will use empty selection.

1. **Open a Python file** (or any file with code)

2. **Select some code** (e.g., `print("Hello")`)

3. **Press Space** (activates prefix)

4. **Press P** (you should see "SPC P" in status bar)

5. **Press P again** (executes the keybinding)

**Expected behavior:**
- Opens a terminal
- Runs: `python3 -c 'print("Hello")'`
- Executes the selected code

**If it doesn't work:**
- Check Output panel for errors
- Verify `.cursor-lisp/config.lisp` exists and has the keybinding
- Try reloading configuration: Command Palette → "Cursor Lisp: Reload Configuration"

### Test 3: Other Keybindings

Try these (if configured in your config.lisp):

- **SPC D R** - Restart Docker (if docker-compose.restart command exists)
- **SPC F F** - Quick open file
- **SPC W S** - Save all files
- **SPC T T** - Run tests (npm test)

---

## Troubleshooting

### Extension Not Loading

1. **Check Output panel:**
   - View → Output
   - Select "Cursor Lisp Interpreter" from dropdown
   - Look for errors

2. **Verify installation:**
   - Extensions view → Search "Cursor Lisp Interpreter"
   - Should show as installed and enabled

3. **Reload window:**
   - Command Palette → "Developer: Reload Window"

### Keybindings Not Working

1. **Verify keybindings.json:**
   - Command Palette → "Preferences: Open Keyboard Shortcuts (JSON)"
   - Check that cursor-lisp entries exist

2. **Check context:**
   - Make sure you're in an editor (not terminal, not search box)
   - Space should only work when editor has focus

3. **Test Space key:**
   - Press Space in editor
   - Should see "SPC" in status bar
   - If not, keybinding isn't registered

### REPL Not Opening

1. **Check command exists:**
   - Command Palette → Type "Cursor Lisp"
   - Should see "Cursor Lisp: Open REPL"
   - If not, extension isn't loaded

2. **Check for errors:**
   - Output panel → "Cursor Lisp Interpreter"
   - Look for error messages

### Configuration Not Loading

1. **Check config file exists:**
   ```bash
   ls -la .cursor-lisp/config.lisp
   ```

2. **Check path in settings:**
   - Settings → Search "cursorLisp.configPath"
   - Should point to your config file

3. **Reload configuration:**
   - Command Palette → "Cursor Lisp: Reload Configuration"

4. **Check for syntax errors:**
   - Output panel → Look for Lisp parse errors

---

## Quick Reference

### Commands Available

- `Cursor Lisp: Evaluate` - Evaluate Lisp expression from input
- `Cursor Lisp: Evaluate Selection` - Evaluate selected Lisp code
- `Cursor Lisp: Open REPL` - Open interactive Lisp REPL
- `Cursor Lisp: Reload Configuration` - Reload config.lisp file

### Example Keybindings (from config.lisp)

- `SPC D R` - Restart Docker
- `SPC P P` - Python eval selection
- `SPC F F` - Quick open file
- `SPC W S` - Save all files
- `SPC T T` - Run tests

### Useful Lisp Functions

- `(+ 1 2)` - Addition
- `(list 1 2 3)` - Create list
- `(car list)` - First element
- `(cdr list)` - Rest of list
- `(if condition then else)` - Conditional
- `(get-selection)` - Get selected text
- `(execute-command "cmd")` - Run VS Code command
- `(run-terminal-command "cmd")` - Run shell command

---

## Success Checklist

- [ ] Extension installed (check Extensions view)
- [ ] Keybindings added to keybindings.json
- [ ] Config file exists (.cursor-lisp/config.lisp)
- [ ] REPL opens and evaluates `(+ 1 2)` → `3`
- [ ] Space prefix activates (shows "SPC" in status bar)
- [ ] Keybinding works (e.g., SPC P P executes)

**If all checked, you're ready to use the extension!** 🎉

