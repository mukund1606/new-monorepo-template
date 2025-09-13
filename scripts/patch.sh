#!/bin/bash

# Marker file to track if daemon has been started
MARKER_FILE=".cache/.first_package_install"

FROM="var defaultMaximumTruncationLength = 160;"
TO="var defaultMaximumTruncationLength = 1e6;"

# Check if daemon has already been started
if [ ! -f "$MARKER_FILE" ]; then
    echo "First time package installation detected, patching typescript..."
    sed -i -e "s/$FROM/$TO/g" "node_modules/typescript/lib/typescript.js"
    echo "Annotation Truncation Length patched successfully"
    echo ""

    echo "First time package installation detected, starting turbo daemon..."
    bun turbo daemon restart
    # Ensure .cache directory exists before creating marker file
    mkdir -p .cache
    touch "$MARKER_FILE"
    echo "Turbo daemon started and marked as initialized"
else
    echo "Typescript already patched, skipping patch"
    echo "Turbo daemon already initialized, skipping patch"
fi
