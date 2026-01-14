#!/bin/bash

# Setup script for Cursor Lisp Extension keybindings
# This script helps you add the keybindings to VS Code/Cursor

echo "=========================================="
echo "Cursor Lisp Extension - Keybindings Setup"
echo "=========================================="
echo ""

# Detect OS and find keybindings.json location
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    KEYBINDINGS_DIR="$HOME/Library/Application Support/Cursor/User"
    KEYBINDINGS_FILE="$KEYBINDINGS_DIR/keybindings.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    KEYBINDINGS_DIR="$HOME/.config/Cursor/User"
    KEYBINDINGS_FILE="$KEYBINDINGS_DIR/keybindings.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    KEYBINDINGS_DIR="$APPDATA/Cursor/User"
    KEYBINDINGS_FILE="$KEYBINDINGS_DIR/keybindings.json"
else
    echo "Unknown OS. Please manually add keybindings."
    exit 1
fi

echo "Keybindings file location: $KEYBINDINGS_FILE"
echo ""

# Check if keybindings.json exists
if [ ! -f "$KEYBINDINGS_FILE" ]; then
    echo "Creating new keybindings.json file..."
    mkdir -p "$KEYBINDINGS_DIR"
    echo "[]" > "$KEYBINDINGS_FILE"
fi

# Check if keybindings already contain cursor-lisp entries
if grep -q "cursor-lisp" "$KEYBINDINGS_FILE"; then
    echo "⚠️  Keybindings already contain cursor-lisp entries!"
    echo "   Please check $KEYBINDINGS_FILE manually."
    echo ""
    echo "To add manually, open Command Palette (Cmd+Shift+P) and run:"
    echo "   'Preferences: Open Keyboard Shortcuts (JSON)'"
    echo ""
    echo "Then add the contents of keybindings.json.example"
    exit 0
fi

echo "📝 Adding keybindings..."
echo ""
echo "Please review the keybindings in: keybindings.json.example"
echo ""
read -p "Add these keybindings to your keybindings.json? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Backup existing keybindings
    cp "$KEYBINDINGS_FILE" "$KEYBINDINGS_FILE.backup"
    echo "✅ Created backup: $KEYBINDINGS_FILE.backup"
    
    # Merge keybindings (simple approach - append)
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    python3 << EOF
import json
import sys

# Read existing keybindings
with open("$KEYBINDINGS_FILE", 'r') as f:
    existing = json.load(f)

# Read new keybindings
with open("$SCRIPT_DIR/keybindings.json.example", 'r') as f:
    new = json.load(f)

# Merge (avoid duplicates)
existing_keys = {json.dumps(kb, sort_keys=True) for kb in existing}
for kb in new:
    kb_str = json.dumps(kb, sort_keys=True)
    if kb_str not in existing_keys:
        existing.append(kb)
        existing_keys.add(kb_str)

# Write back
with open("$KEYBINDINGS_FILE", 'w') as f:
    json.dump(existing, f, indent=2)

print("✅ Keybindings added successfully!")
EOF

    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Reload Cursor/VS Code window (Cmd+R / Ctrl+R)"
    echo "2. Test by pressing , (comma) in an editor"
    echo "3. Try ,dr to restart Docker (if configured)"
else
    echo "Setup cancelled."
    echo ""
    echo "To add manually:"
    echo "1. Open Command Palette (Cmd+Shift+P)"
    echo "2. Run 'Preferences: Open Keyboard Shortcuts (JSON)'"
    echo "3. Add contents from keybindings.json.example"
fi

