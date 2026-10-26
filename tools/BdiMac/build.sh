#!/bin/bash
# Sestaví BdiMac.app (potřeba: Xcode Command Line Tools → `xcode-select --install`).
set -euo pipefail
cd "$(dirname "$0")"

APP="BdiMac.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS"

swiftc -O main.swift -o "$APP/Contents/MacOS/BdiMac" \
  -framework Cocoa -framework IOKit -framework ServiceManagement

cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>BdiMac</string>
  <key>CFBundleIdentifier</key><string>cz.krakram.bdimac</string>
  <key>CFBundleExecutable</key><string>BdiMac</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>LSMinimumSystemVersion</key><string>11.0</string>
  <key>LSUIElement</key><true/>
</dict>
</plist>
PLIST

codesign --force --deep -s - "$APP"

echo "Hotovo: $(pwd)/$APP"
echo "Přesuň do Aplikací:  mv $APP /Applications/ && open /Applications/$APP"
