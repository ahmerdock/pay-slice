# Pay Slice: project structure and patterns

This document explains how the project is laid out and the patterns to follow when adding code. Read it before adding a screen, component or icon.

## Overview

Pay Slice is an Expo (SDK 57) React Native expense manager, built for Android first. iOS config is kept so a later iOS release needs minimal work; web is not supported.

| Concern | Choice |
|---|---|
| Navigation | Expo Router (file-based), bottom tabs with a custom tab bar |
| Styling and theming | `react-native-unistyles` (light and dark themes) |
| Persisted data | `react-native-mmkv` (the chosen theme, and the Budget screen's income and categories) |
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
├── README.md             Quick start and setup notes
├── AGENTS.md             Instructions for coding agents (Expo, commands, rules)
├── app.json              Expo config (name, package, plugins)
├── eas.json              EAS build profiles (no project id yet: run `eas init`)
├── package.json          Dependencies, scripts and the Jest config
├── babel.config.js       Babel preset plus the Unistyles plugin (root: "src")
├── tsconfig.json         TypeScript config and the "@/..." path aliases
├── eslint.config.js      Lint config (`npx expo lint`)
├── pnpm-workspace.yaml   pnpm settings (allowed build scripts)
├── assets/               App icon, splash and adaptive icon layers
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
├── utils/          Small pure helpers (number formatting and input cleaning)
└── theme/          Unistyles setup: themes, fonts, saved-theme loading
```

### `app/` (routes)

Every file here is a route. Keep them thin: a route file only renders the matching feature.

```
app/
├── _layout.tsx          Theme import, then renders layouts/root (RootLayout)
└── (tabs)/
    ├── _layout.tsx      Tabs navigator using the custom tab bar
    ├── index.tsx        Budget tab      -> features/home (income and category split)
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
- `home/`: the expense manager. `use-home.ts` holds the state (income, categories, sheet) and saves to MMKV inside its handlers, `home.utils.ts` has the pure maths (`computeBreakdown`, `parseStoredBudget`), `home.data.ts` the storage key, `home.styles.ts` and `home.interface.ts`.
- `settings/`: `index.tsx`, `use-settings.ts` (theme toggle and saving), `settings.data.ts` (contact links), `settings.styles.ts`.
- `help-me/`: `index.tsx`, `use-help-me.ts` (store connection, purchases and the success and error toasts), `help-me.data.ts` (tip tiers), `help-me.interface.ts`, `help-me.utils.ts` (product-ID and purchase-error helpers, with `help-me.utils.test.ts`). It has no styles file because it borrows `actionCardStyles` from the barrel.

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
- `allocation-bar/`, `category-row/`, `category-sheet/`: the Home screen pieces. `category-sheet/` is a bottom-sheet `Modal` with a label and a percentage field, used for both adding and editing; `use-category-sheet.ts` holds its form state and the over-100% warning.
- Components never import from `features/`.

`components/index.ts` is the barrel. Every component is exported from it.

### `layouts/`

Each layout is a folder with the same anatomy as a component and is exported from `layouts/index.ts`.

- `root/` (`RootLayout`): the app shell rendered by `app/_layout.tsx`. It loads fonts, keeps the splash screen up until they are ready, and renders the gesture root, safe area provider, status bar, stack and toast host. Its logic is in `use-root-layout.ts`.
- `tabs/` (`TabsLayout`): safe area, the page title (`ScreenTitle`), a scrolling body, and padding so content clears the floating tab bar. Every tab screen renders inside it and passes its title as `titleProps`.

### `assets/icon/` (our own icons)

Lucide 1.x no longer includes brand logos, so `github.tsx` and `linkedin.tsx` are small outlined SVG components built with `react-native-svg`. They are exported from `index.ts` and take `size`, `color` and `strokeWidth` like Lucide icons. Add any other custom icon here.

### `utils/`

Small pure helpers with no framework code, shared by features and components.

- `format.ts`: `formatAmount` (thousands separators, up to 2 decimals, no currency symbol) and `formatPercent`.
- `number-input.ts`: `sanitizeDecimalInput`, which cleans a typed number (digits and one decimal point, a comma counts as the point, at most 2 decimals), and `parsePositiveNumber`, which returns the number or 0 for empty, invalid or non-positive text.

### Hard-coded colours (intentional)

Theme colours come from the theme everywhere except three places: the switch thumb in `custom-switch.styles.ts` (always `#FDFDFD`, on both themes), the dimmed backdrop behind the category sheet in `category-sheet.styles.ts` (`rgba(0, 0, 0, 0.5)`, the same on both themes), and the default `color` of the GitHub and LinkedIn icons (`#000000`, a fallback prop value).

## App icon and splash

The icon is a wallet with a pie chart. The files are in `assets/`, and `app.json` points at them:
- `images/icon.png`: the main icon (wallet on a full-bleed `#0D0C0C` square).
- `images/android-icon-foreground.png`, `android-icon-background.png` (solid `#0D0C0C`) and `android-icon-monochrome.png`: the Android adaptive icon. The wallet sits inside Android's safe zone. Launchers keep only the monochrome layer's transparency and tint it one colour, so its wallet and clasp are opaque and the cards and pie slices are see-through tones.
- `images/splash-icon.png`: the splash image, shown on `#0D0C0C`.
- `expo.icon/`: the iOS icon (`Assets/wallet.png` is its layer).

All are 1024×1024 PNGs. The master art is not kept in the repo, so to change the icon, replace these files directly.

## Theme

`theme/unistyles.ts` defines the light and dark themes, loads the saved theme from MMKV and registers them with Unistyles.

- Fonts: `theme.typography.heading.regular` (Bebas Neue) for headings, `theme.typography.body.regular | medium | bold` (DM Sans) for everything else, and `theme.typography.mono.regular | medium` (DM Mono) for numbers and labels. Bebas Neue is all-caps, so never use it for text where upper and lower case must differ.
- Theme colors beyond the basics: `onPrimary` (text and icons on the primary color) and `warning` (over-100% messages and the Delete button). Add new colors to both themes.

## Help Me tips

- Three one-time products with the IDs `tip_coffee`, `tip_lunch` and `tip_feature` (see `help-me.data.ts`). They must exist in Google Play Console for the package `com.ahmersdev.payslice`.

## Budget screen (Home) behaviour

The tab is called Budget (`PAGE_TITLES.HOME`), and its code lives in `features/home`.

- One monthly income field (no currency symbol; any number works). It shows raw digits while focused and thousands separators when not.
- Categories (label and percentage) start empty, and the "Unallocated" row still shows (100% of the income) so the screen is never blank. Each row shows its percentage and its amount, and the amounts update live as the income changes. There is no calculate button.
- Tapping a row opens the sheet to edit it, with a Delete button (asks to confirm). The sheet prefills the percentage with whatever is still unallocated. Save and Delete do nothing once the sheet is closing, so a quick double-tap cannot add a category twice.
- The total can pass 100%: this only warns. The allocation bar and an "Over by" row turn the warning color, and the sheet says how far over the total will be.
- Under 100%, the "Unallocated" row shows the rest. Amounts are computed in whole cents and percentages in hundredths of a percent, and the unallocated amount is income minus the rounded rows, so the rows add up. At exactly 100% the row is hidden, so a cent or so of rounding difference can go unshown.
- Income and categories are saved to MMKV under one key (`pay_slice_budget`) on every change, and read synchronously on start. Broken or missing data falls back to an empty budget.

## Tests

Jest with the `jest-expo` preset (`pnpm test`). Covered: the money maths (`home.utils.test.ts`), the number helpers (`utils/format.test.ts`, `utils/number-input.test.ts`) and the purchase helpers (`help-me.utils.test.ts`). The screen hooks (`use-home`, `use-help-me`) and the category sheet are not unit-tested yet. Test files that import `help-me.data` must mock it, because its Lucide icon imports do not load under Jest.
