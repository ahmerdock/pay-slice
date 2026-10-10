# Pay Slice: project structure and patterns

This document explains how the project is laid out and the patterns to follow when adding code. Read it before adding a screen, component or icon.

## Overview

Pay Slice is an Expo (SDK 57) React Native expense manager, built for Android first. iOS config is kept so a later iOS release needs minimal work; web is not supported.

| Concern | Choice |
|---|---|
| Navigation | Expo Router (file-based), bottom tabs with a custom tab bar |
| Styling and theming | `react-native-unistyles` (light and dark themes) |
| Persisted settings | `react-native-mmkv` (stores the chosen theme) |
| Icons | `lucide-react-native`, plus two local brand logos |
| Fonts | Bebas Neue (headings), DM Sans (body), DM Mono (numbers and labels), via `@expo-google-fonts` |
| In-app purchases | `expo-iap` (one-time tips on the Help Me tab) |
| Toasts | `react-native-toast-message` |
| Gestures | `react-native-gesture-handler` |
| Animation | `react-native-reanimated` |
| Tests | Jest with the `jest-expo` preset and `@testing-library/react-native` |

Native modules (MMKV, Unistyles, `expo-iap`) mean the app needs a development build. It does not run in Expo Go: `npx expo run:android`.

## Top-level layout

```
pay-slice/
├── app.json              Expo config (name, package, plugins)
├── babel.config.js       Babel preset plus the Unistyles plugin (root: "src")
├── tsconfig.json         TypeScript config and the "@/..." path aliases
├── eslint.config.js      Lint config (`npx expo lint`)
├── assets/               Static files referenced by app.json (app icon, splash, adaptive icon)
├── docs/                 Project documentation (this folder)
├── .claude/, .vscode/    Editor and Claude Code settings (not app code)
└── src/                  All application code
```

`ios/`, `android/` and `.expo/` are generated and git-ignored. Never edit them by hand; native settings go in `app.json` or config plugins.

## `src/` layout

```
src/
├── app/            Routes only (Expo Router). Thin files.
├── features/       One folder per screen: the screen's UI, logic, data
├── layouts/        RootLayout (app shell) and TabsLayout (shared tab page layout)
├── components/     Reusable UI components, plus a barrel (index.ts)
├── assets/icon/    Our own SVG icon components (GitHub, LinkedIn)
├── constants/      Route names, page titles, layout numbers
└── theme/          Unistyles setup: themes, fonts, saved-theme loading
```

### `app/` (routes)

Every file here is a route. Keep them thin: a route file only renders the matching feature.

```
app/
├── _layout.tsx          Theme import, then renders layouts/root (RootLayout)
└── (tabs)/
    ├── _layout.tsx      Tabs navigator using the custom tab bar
    ├── index.tsx        Home tab        -> features/home (placeholder for now)
    ├── help-me.tsx      Help Me tab     -> features/help-me
    └── settings.tsx     Settings tab    -> features/settings
```

### `features/` (screens)

A feature folder holds everything for one screen:

| File | Purpose |
|---|---|
| `index.tsx` | The screen component (markup only) |
| `use-<feature>.ts` | The screen's logic and state, as a hook |
| `<feature>.interface.ts` | Types for the hook and screen |
| `<feature>.data.ts` | Static data (lists, labels, product IDs) |
| `<feature>.utils.ts` | Pure helper functions |
| `<feature>.styles.ts` | Unistyles styles |

Create only the files a feature needs. Examples:
- `home/`: an empty placeholder inside `TabsLayout`. The expense manager goes here.
- `settings/`: `index.tsx`, `use-settings.ts` (theme toggle and saving), `settings.data.ts` (contact links), `settings.styles.ts`.
- `help-me/`: `index.tsx`, `use-help-me.ts` (store connection, purchases and the success and error toasts), `help-me.data.ts` (tip tiers), `help-me.interface.ts`, `help-me.utils.ts`. It has no styles file because it borrows `actionCardStyles` from the barrel.

### `components/` (reusable UI)

Each component gets its own folder, named in kebab-case, with the same anatomy:

```
components/card/
├── index.tsx            The component (default export)
├── card.interface.ts    Props types
└── card.styles.ts       Styles (exported as cardStyles)
```

Add `use-<name>.ts` when the component has logic (state, animation, handlers) and `<name>.utils.ts` or `<name>.data.ts` for helpers and static data. Current components:
- `custom-switch/`: animation and toggle logic live in `use-custom-switch.ts`.
- `custom-tab-bar/`: `use-custom-tab-bar.ts` (pill animation, press handling) and `custom-tab-bar.utils.ts` (the tab list: icon and label per route).
- `tab-item/`: a single tab, with its own hook for the label animation.
- `app-icon/`: renders any Lucide-style icon at a given size, color and stroke width.
- `action-card/`, `card/`, `screen-title/`, `short-heading/`: small building blocks.
- Components never import from `features/`.

`components/index.ts` is the barrel. Every component is exported from it.

### `layouts/`

Each layout is a folder with the same anatomy as a component and is exported from `layouts/index.ts`.

- `root/` (`RootLayout`): the app shell rendered by `app/_layout.tsx`. It loads fonts, keeps the splash screen up until they are ready, and renders the gesture root, safe area provider, status bar, stack and toast host. Its logic is in `use-root-layout.ts`.
- `tabs/` (`TabsLayout`): safe area, the page title (`ScreenTitle`), a scrolling body, and padding so content clears the floating tab bar. Every tab screen renders inside it and passes its title as `titleProps`.

### `assets/icon/` (our own icons)

Lucide 1.x no longer includes brand logos, so `github.tsx` and `linkedin.tsx` are small outlined SVG components built with `react-native-svg`. They are exported from `index.ts` and take `size`, `color` and `strokeWidth` like Lucide icons. Add any other custom icon here.

### Hard-coded colours (intentional)

Theme colours come from the theme everywhere except two places: the switch thumb in `custom-switch.styles.ts` (always `#FDFDFD`, on both themes) and the default `color` of the GitHub and LinkedIn icons (`#000000`, a fallback prop value).

## Theme

`theme/unistyles.ts` defines the light and dark themes, loads the saved theme from MMKV and registers them with Unistyles.

- Fonts: `theme.typography.heading.regular` (Bebas Neue) for headings, `theme.typography.body.regular | medium | bold` (DM Sans) for everything else, and `theme.typography.mono.regular | medium` (DM Mono) for numbers and labels. Bebas Neue is all-caps, so never use it for text where upper and lower case must differ.
- The theme still carries colors inherited from Pass Dice (`digit`, `symbol`, `strengthWeak | strengthFair | strengthStrong | strengthVeryStrong`). Remove them once Pay Slice's own palette is settled. Add new colors to both themes.

## Help Me tips

- Three one-time products with the IDs `tip_coffee`, `tip_lunch` and `tip_feature` (see `help-me.data.ts`). They must exist in Google Play Console for the package `com.ahmersdev.payslice`.
