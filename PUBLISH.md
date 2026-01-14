# How to Publish to GitHub

## Step 1: Create Repository on GitHub

1. Go to https://github.com/kroq86
2. Click "New repository" (green button)
3. Repository name: `cursor-lisp-extension`
4. Description: "Full Lisp interpreter for Cursor/VS Code with Emacs-like keybindings"
5. Make it **Public** (or Private if you prefer)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Push to GitHub

Run these commands in the extension directory:

```bash
cd cursor-lisp-extension

# Add all files
git add .

# Commit
git commit -m "Initial commit: Cursor Lisp Interpreter Extension"

# Add remote (replace YOUR_USERNAME if different)
git remote add origin https://github.com/kroq86/cursor-lisp-extension.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Create First Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v0.1.0`
4. Release title: `v0.1.0 - Initial Release`
5. Description:
   ```
   Initial release of Cursor Lisp Interpreter Extension
   
   Features:
   - Full Lisp interpreter
   - Emacs-like Space prefix keybindings (SPC)
   - Custom script execution
   - VS Code API integration
   - Interactive REPL
   - Expand/contract region support
   ```
6. Upload the `.vsix` file: `cursor-lisp-interpreter-0.1.0.vsix`
7. Click "Publish release"

## Step 4: (Optional) Publish to VS Code Marketplace

If you want to publish to the official VS Code Marketplace:

1. Install `vsce`: `npm install -g @vscode/vsce`
2. Get a Personal Access Token from https://dev.azure.com
3. Create a publisher account at https://marketplace.visualstudio.com/manage
4. Run: `vsce publish`

But for now, GitHub releases are enough for distribution!
