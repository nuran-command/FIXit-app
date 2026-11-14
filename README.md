# FixIt Astana — Interactive Mobile Prototype (React Native + Expo)

An end-to-end, self-contained interactive React Native (Expo + TypeScript) prototype for **FixIt**, an on-demand home repair marketplace connecting households in **Astana, Kazakhstan** with verified plumbers and electricians.

## Quick Start (Xcode iOS Simulator)

```bash
npx expo start
```
Then press **`i`** in the terminal to launch directly in the iOS Xcode Simulator (or **`w`** for Web).

## Features & User Stories (US-01 to US-07)

- **Persistent Demo Control Bar** (`src/components/DemoBar.tsx`):
  - Switch roles anytime between **Client: Aidana** and **Pro: Marat (4.9★ → 4.92★)**.
  - Jump directly to **Sprint 1: Booking**, **Sprint 2: Dispatch & GPS**, or **Sprint 3: Kaspi QR & Review**, or tap any individual user story pill (`US-01` through `US-07`).
- **US-01 (`src/screens/LoginScreen.tsx`)**: Pre-filled Astana phone (`+7 (701) 555-0192`) & verified address selector (`Yesil District, Mangilik El Ave 55, Apt 42, Astana`), 4-digit SMS OTP screen with a 1-tap **"Auto-fill 1234"** demo button.
- **US-02 (`src/screens/CatalogScreen.tsx`)**: Service category pills (**Plumbing**, **Electrical**, **Appliances**, **Carpentry**), price/urgency filters (**All**, **Under 10,000 ₸**, **Urgent 24/7**), and fixed KZT services with **"Book in <60s"** CTAs.
- **US-03 (`src/screens/OrderIntakeScreen.tsx`)**: Guaranteed fixed KZT summary, issue description input with quick templates, `expo-image-picker` gallery upload + **"Use Sample Leak Photo"** fallback for Simulator, and **"Confirm & Dispatch Technician"** CTA.
- **US-04 (`src/screens/ProDashboardScreen.tsx`)**: Technician job alert feed for **Marat (Master Plumber, 4.9★, 14 yrs exp)** with a live 15-second countdown timer, `1.4 km away · Yesil District`, photo thumbnail, fixed payout (`8,500 ₸`), and **Accept Job** / **Reject** buttons.
- **US-05 (`src/screens/TrackingScreen.tsx` & `src/components/SimulatedAstanaMap.tsx`)**: Zero-API-key custom SVG Astana street-grid map (`Mangilik El Ave`, `Kabanbay Batyr Ave`, `Yesil District`) with smooth 1-second technician pin animation (`1.4 km` → `0.0 km`, `6 min` → `Arrived`) and a **"Simulate Arrival & Complete Job"** demo button.
- **US-06 (`src/screens/KaspiCheckoutScreen.tsx`)**: **Kaspi.kz QR Payment Modal** with crisp SVG QR code, `8,500 ₸`, Order `#FX-2048`, Kaspi Red (`#F14635`) branding, **"Simulate Kaspi Pay Confirmation"** button, animated green checkmark, and itemized **PDF Receipt** (`Paid via Kaspi QR`).
- **US-07 (`src/screens/ReviewScreen.tsx`)**: Interactive 1–5 star rating, quick-tag chips (`Arrived on time`, `Fixed price honored`, `Clean work`), community review input, and live profile update for Marat (`4.92 ★`, `128 verified jobs`) + **Completed Order** badge on the Home screen.

