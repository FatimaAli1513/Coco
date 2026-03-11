# Coco Tools

All-in-one utility app for everyday tasks: calculator, unit converter, stopwatch, timer, password generator, notes, and color picker.

---

## Features (in-app only)

The app includes exactly these 7 tools:

1. **Calculator** – Basic math: add, subtract, multiply, divide. Supports decimal, percentage, and sign toggle (C, ±, %, ÷, ×, −, +, =).

2. **Unit Converter** – Convert between units in three categories:
   - **Length:** Meter, Km, Cm, Mile, Feet, Inch  
   - **Weight:** Kg, Gram, Pound, Ounce  
   - **Temp:** °C, °F, Kelvin  
   Swap from/to units and enter a value to see the result.

3. **Stopwatch** – Elapsed time with start/stop, reset, and lap. Lap times and total time are shown.

4. **Countdown Timer** – Set minutes and seconds, start countdown. Alert when time is up. Stop and reset supported.

5. **Password Generator** – Generate random passwords with:
   - Length 4–32 (adjustable)
   - Options: uppercase, lowercase, numbers, symbols
   - Strength indicator (Weak / Fair / Strong)
   - Copy to clipboard (button shows “Copied” briefly)

6. **Quick Notes** – Save multiple notes on the device:
   - New note input at top, Save and Clear
   - Saved notes listed below with date/time
   - Delete a note via trash icon
   - All data stored only on the device (local storage)

7. **Color Picker** – Pick a color and get codes:
   - Preset colors and custom hex input (#fff or #ffffff)
   - Shows Hex and RGB
   - Copy Hex or Copy RGB to clipboard (buttons show “Copied” briefly)

---

## Privacy

- **No account required** – You can use the app without signing in.
- **Data stays on your device** – Notes are saved only in local storage (device storage). We do not collect, upload, or share your notes or any other data.
- **No analytics or tracking** – The app does not collect usage data, analytics, or personal information.
- **Clipboard** – Copy (password, color codes) only writes to your device’s clipboard; nothing is sent to any server.
- **No ads** – The app does not show advertisements.
- **Permissions** – The app does not use camera, location, contacts, or other sensitive permissions. It only uses local storage and clipboard as described above.

If you have questions about privacy, contact the developer using the contact details provided in the Play Store listing.

---

## Play Store – Short description (80 chars)

All-in-one tools: Calculator, Unit Converter, Stopwatch, Timer, Passwords, Notes, Color Picker.

---

## Play Store – Full description (optional draft)

Coco Tools is a simple utility app that puts everyday tools in one place:

• **Calculator** – Basic math (add, subtract, multiply, divide).  
• **Unit Converter** – Length, weight, and temperature.  
• **Stopwatch** – Time elapsed with laps.  
• **Timer** – Countdown with alert when time is up.  
• **Password Generator** – Random passwords with length and character options, copy to clipboard.  
• **Quick Notes** – Save multiple notes on your device; delete with the trash icon.  
• **Color Picker** – Pick colors, see Hex and RGB, copy to clipboard.

All data (e.g. notes) is stored only on your device. No account, no data collection, no ads.

---

## Play Store – Common questions & answers

**App category**  
Productivity / Tools (utility).

**Content rating**  
Suitable for all ages. No user-generated content visible to others, no social features, no in-app purchases.

**Does the app collect any user data?**  
No. Notes and other data stay on the device. We do not collect, transmit, or share personal data.

**Does the app require login?**  
No. The app works offline and does not require an account.

**Does the app contain ads?**  
No.

**Does the app offer in-app purchases?**  
No.

**What permissions does the app use?**  
The app does not request sensitive permissions (no camera, location, contacts, etc.). It uses only local storage and clipboard for notes and copy (password/color) as described in the app.

**Is the app suitable for children?**  
Yes. No inappropriate content, no account, no social features. Can be used by all ages.

---

## Setup (developers)

```bash
yarn install
```

**Run**

- **Expo dev server:** `yarn start`  
- **Android:** `yarn android`  
- **iOS:** `yarn ios`  
- **Web:** `yarn web`  

**Project structure**

- `App.js` – main app and navigation  
- `app.json` – Expo config (name: Coco Tools, package: com.hamzehdev.Coco)  
- `screens/` – Home, Calculator, UnitConverter, Stopwatch, Timer, PasswordGenerator, Notes, ColorPicker  
- `constants/theme.js` – colors and spacing  
- `assets/` – app icon and splash  

**Build AAB for Play Store**  
See `BUILD-AAB.md` for building the Android App Bundle without EAS.
