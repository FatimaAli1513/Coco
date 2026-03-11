#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

# Load .env and export keystore vars (path must be relative to android/app for Gradle)
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Gradle resolves paths from android/app/ — use path to keystore in project root
export COCO_KEYSTORE_PATH="../../coco-release.keystore"

echo "Building AAB for Play Store..."
cd android
./gradlew bundleRelease
cd ..

AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
  echo ""
  echo "Done! AAB file: $AAB_PATH"
  echo "Upload this file to Google Play Console."
else
  echo "AAB not found at $AAB_PATH"
  exit 1
fi
