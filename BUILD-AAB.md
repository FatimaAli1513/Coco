# Build AAB for Play Store (without EAS)

## Prerequisites

- Android SDK installed (Android Studio or command-line tools)
- `.env` in project root with keystore credentials (see `.env.example`)
- `coco-release.keystore` in project root

## Build

From project root run:

```bash
npm run build:aab
```

or:

```bash
./build-aab.sh
```

The script loads `.env` and runs Gradle. Output AAB:

```
android/app/build/outputs/bundle/release/app-release.aab
```

Upload `app-release.aab` in [Google Play Console](https://play.google.com/console) → Your app → Release → Create new release.

## First time

If you don’t have the `android/` folder yet:

```bash
npx expo prebuild --platform android
```

Then run `npm run build:aab` as above.
