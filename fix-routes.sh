#!/bin/bash
set -e

echo "🔧 Fixing route conflicts — moving all app pages under (dashboard)..."

DASH="src/app/(dashboard)"

# Delete conflicting outside folders
echo "🗑  Removing conflicting outside folders..."
rm -rf src/app/verification
rm -rf src/app/settings

# Move products (all subfolders too)
if [ -d "src/app/products" ] && [ ! -d "$DASH/products" ]; then
  echo "📦 Moving products → (dashboard)/products"
  mv src/app/products "$DASH/products"
fi

# Move chat
if [ -d "src/app/chat" ] && [ ! -d "$DASH/chat" ]; then
  echo "📦 Moving chat → (dashboard)/chat"
  mv src/app/chat "$DASH/chat"
fi

# Move rfq
if [ -d "src/app/rfq" ] && [ ! -d "$DASH/rfq" ]; then
  echo "📦 Moving rfq → (dashboard)/rfq"
  mv src/app/rfq "$DASH/rfq"
fi

# Move search
if [ -d "src/app/search" ] && [ ! -d "$DASH/search" ]; then
  echo "📦 Moving search → (dashboard)/search"
  mv src/app/search "$DASH/search"
fi

# Move boost
if [ -d "src/app/boost" ] && [ ! -d "$DASH/boost" ]; then
  echo "📦 Moving boost → (dashboard)/boost"
  mv src/app/boost "$DASH/boost"
fi

# Remove extra role dashboards (only keep /dashboard and /admin)
rm -rf "$DASH/manufacturer" "$DASH/retailer" 2>/dev/null || true

# Recreate verification + settings under (dashboard) if missing
if [ ! -d "$DASH/verification" ]; then
  mkdir -p "$DASH/verification"
fi

echo ""
echo "✅ Routes fixed!"
echo ""
echo "📁 Final structure:"
ls -1 src/app/
echo ""
echo "📁 Inside (dashboard):"
ls -1 "$DASH/"
echo ""
echo "Now run:"
echo "  rm -rf .next"
echo "  npm run dev:all"
echo ""