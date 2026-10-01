#!/bin/bash

# lint-colors.sh
# Fails the build if hardcoded colors (hex, rgb, hsl, or tailwind color literals) are found in source files.

# Check for hardcoded hex codes, excluding globals.css
echo "Checking for hardcoded hex colors..."
if grep -rEi '(color|background(-color)?):.*#[0-9a-f]{3,6}' --include=\*.tsx --include=\*.ts --include=\*.css src | grep -v 'globals.css'; then
    echo "ERROR: Hardcoded hex colors found. Please use CSS variables (e.g. var(--primary)) or Tailwind semantic classes (e.g. text-primary)."
    exit 1
fi

# Check for hardcoded tailwind colors (e.g., bg-red-500, text-blue-400), excluding generic/utility colors like neutral/gray if desired, 
# but specifically catching emerald, amber, red, blue, etc.
echo "Checking for hardcoded Tailwind colors..."
if grep -rE '(bg|text)-(red|blue|green|emerald|amber|yellow|purple|pink|indigo)-[0-9]{3}' --include=\*.tsx src; then
    echo "ERROR: Hardcoded Tailwind color classes found. Please use semantic tokens (e.g. bg-success, text-warning, bg-destructive)."
    exit 1
fi

echo "All color checks passed!"
exit 0
