# Pay Slice

An expense manager for Android, built with Expo and React Native.

Enter a monthly income, add categories with a percentage, and see how much of the income each one gets. Categories and income are saved on the device. Help Me and Settings (light and dark theme, contact links) are also in place.

## Run it

Requires a development build (it does not run in Expo Go).

```bash
pnpm install
npx expo run:android
```

Useful checks: `npx expo lint`, `npx tsc --noEmit`, `pnpm test`.

## Notes

- **Help Me tips:** Purchases need three one-time products (`tip_coffee`, `tip_lunch`, `tip_feature`) set up in Google Play Console for the package `com.ahmersdev.payslice`, and a build installed from a Play test track. Without them the tip cards stay disabled, which is expected on a local build.
- **EAS:** Run `eas init` to link a new EAS project; `eas.json` is copied but no project id is set.
- See [docs/structure.md](docs/structure.md) for the project layout and patterns.
