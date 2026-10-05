# Product Requirements Document (PRD)

**Project:** 2002 JDM Honda Fit (RHD) Alternator Technical Dossier & Diagnostic Web App  
**Target Platform:** React + Vite, Cloudflare Workers / Pages deployment  
**Intended Generator:** Google AI Studio (Gemini 1.5 Pro / Flash) & Google Stitch  
**Primary Users:** Remote Mechanic (off-island review via mobile/tablet) & Vehicle Owner (long-term archive & field triage)  
**Design Reference:** [`DESIGN.md`](./DESIGN.md)

---

# PART 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Executive Summary & Objective
Build a lightweight, lightning-fast, high-utility technical web application to present diagnostic findings, repair methodologies, parts interchange data, and local George Town, Grand Cayman logistics for a 2002 Right-Hand Drive (JDM) Honda Fit (GD1 chassis, 1.3L L13A engine). The app must enable a remote mechanic to review the exact breakdown state, verify part interchange numbers, evaluate removal options, and assist the owner in sourcing and validating a replacement alternator.

---

## 2. Technical Stack & Deployment Constraints
- **Framework:** React 18+ (Functional components with Hooks)
- **Bundler / Tooling:** Vite
- **Styling:** Tailwind CSS (preferred for rapid, zero-runtime styling) + Lucide React (for icons)
- **Deployment Target:** Cloudflare Workers (using `@cloudflare/vite-plugin` or Cloudflare static assets / Wrangler)
- **State Management:** React local state (`useState`, `useMemo`) + `localStorage` for field checklist persistence
- **Theme Support:** Dark Mode (default workshop mode) and High-Contrast Light Mode (direct sunlight mode)
- **Performance Budget:** Zero heavy external libraries. First Contentful Paint (FCP) < 0.8s on 3G/4G Caribbean mobile networks.
- **Offline / Low-Bandwidth Resilience:** All content, diagrams, and pinouts bundled inline (no external CMS or database dependencies).

---

## 3. Information Architecture & Navigation

The app is structured as a single-page app (SPA) with a sticky top bar, quick triage banner, and smooth scroll or tabbed section switching:

```
[Header: Vehicle Spec Badge + Dark/Light Mode Toggle + Print/PDF Action]
   │
├── [Section 0: Status & Field Triage Banner] 
│     - Current Vehicle Status (Stranded at Animal House, North Sound Rd)
│     - Quick Mechanic Summary & Voltage Diagnostic Decision Tree
│
├── [Section 1: Vehicle & Chassis Identification]
│     - JDM First-Gen Fit Matrix (GD1 vs GD2/GD3/GD4)
│     - Interactive VIN & Firewall ID Plate Decoder
│     - Mitsubishi OEM Alternator Lineage
│
├── [Section 2: Breakdown Timeline & Symptoms]
│     - Chronological failure cascade (Flicker → Idle Hunt → EPS Cutout → No-Crank)
│     - Interactive Multimeter Diagnostic Simulator (Input voltage -> Instant triage verdict)
│
├── [Section 3: Parts & Interchange Catalog]
│     - Master Part Numbers (Mitsubishi A5TB0091, Honda 31100-PWA-004, Lester 11177N)
│     - One-click copy buttons for part numbers
│     - Internal component spec table (Gauss GA225-14V regulator, rectifier, brushes)
│     - Warning callout regarding soldered regulator vs. full replacement
│
├── [Section 4: Step-by-Step Removal Procedures]
│     - Tab Switcher: [Method A: Front Bumper Swing] vs [Method B: Top Engine / EGR Studs]
│     - Interactive step checklist with checkboxes (persisted in localStorage)
│     - Critical torque spec callouts & lower 12mm pivot bolt access guide
│
├── [Section 5: Bench Testing Guide]
│     - Interactive 4-Pin Mitsubishi Connector Pinout Visualizer (`IG`, `C`, `FR`, `L`)
│     - Off-car drill & vice excitation wiring schematic
│     - Pass / Fail evaluation benchmarks
│
└── [Section 6: George Town Logistics & Emergency Relocation]
      - Map route & distance card (Animal House ➔ Parker's ➔ Tony's Toys ➔ Car Clinic)
      - George Town supplier contact cards (one-tap dial: Cartronics, Parker's, Tony's Toys, Car Clinic)
      - Cost breakdown & salvage yard pricing comparison (CI$50–$80 used OEM)
```

---

## 4. Key Functional Features & User Stories

### US-1: One-Tap Voltage Diagnostic Triage
- **Feature:** A mini-tool where the user or mechanic can enter a voltage reading (e.g., `12.1V`, `14.2V`, `15.5V`) and toggle engine state (Engine Off / Idle / Jumper Disconnected).
- **Output:** Immediate color-coded status badge (e.g., `FAIL: Alternator completely dead - vehicle operating on reserve`, `PASS: Charging nominal`, `CRITICAL: Internal regulator open - overvoltage`).

### US-2: Interactive Removal Guide with Method Switching
- **Feature:** Mechanics often disagree on bumper removal vs top-end clearance. The UI provides a segmented control:
  - **Method A (Bumper & Radiator Swing):** Steps, unbolting core support tie bar, straight forward extraction.
  - **Method B (Top Manifold / EGR Stud Removal):** Stud extraction technique, harness bracket unbolting.
- **Checklist:** Persistent checkboxes so the owner or mechanic can track steps in real-time.

### US-3: One-Click Part Number Copier
- **Feature:** Part numbers displayed in large monospace badges with an instant clipboard copy button and tooltip confirmation (`Copied to clipboard!`).
- **Target Part Numbers:**
  - `31100-PWA-004` (Honda OE)
  - `A5TB0091` (Mitsubishi OE)
  - `11177N` (Universal Aftermarket)
  - `GA225-14V` (Gauss Regulator)

### US-4: Interactive 4-Pin Alternator Pinout Explorer
- **Feature:** SVG / CSS visualizer of the green Mitsubishi 4-pin harness plug. Clicking on or hovering over pins (`IG`, `C`, `FR`, `L`) highlights their purpose, bench test connection instructions, and expected voltage signals.

### US-5: One-Tap Cayman Local Supplier Directory
- **Feature:** Dedicated contact cards with direct `tel:+1345...` links, WhatsApp messaging links (if applicable), and physical landmarks for George Town Industrial Park.

---

# PART 2: DESIGN SYSTEM & UI SPECIFICATION

The complete design language, color tokens (for both Dark and Light modes), typography scales, touch ergonomics, and component UI patterns are defined in:

👉 **See [`DESIGN.md`](./DESIGN.md) for the full Design Language Style Guide.**

---

# PART 3: CLOUDFLARE WORKERS ADAPTER & DEPLOYMENT SETUP

To deploy via Cloudflare Workers static assets or Vite adapter:
1. `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
     }
   });
   ```
2. `wrangler.toml`:
   ```toml
   name = "honda-fit-alternator-repair"
   main = "dist/index.html"
   compatibility_date = "2024-04-01"

   [site]
   bucket = "./dist"
   ```

---

# PART 4: PROMPT TO PASTE INTO GOOGLE AI STUDIO

Copy and paste the prompt below directly into **Google AI Studio** with **Gemini 1.5 Pro**:

```markdown
You are an expert Principal Frontend Engineer and Automotive Systems Specialist.
Please build a production-grade, highly responsive, single-page React+Vite application using Tailwind CSS and Lucide React icons based on the following PRD and Design Style Guide.

### APPLICATION SPECIFICATION:
- Title: 2002 JDM Honda Fit (RHD) Alternator Technical Dossier & Field Triage App
- Purpose: Present technical breakdown diagnostics, parts interchange, removal procedures, bench test schematics, and George Town (Grand Cayman) local parts sourcing to an off-island mechanic.
- Stack: React + Vite + Tailwind CSS + Lucide React.
- Style: Modern Utilitarian Workshop aesthetic (Dark mode default with Slate/Zinc surfaces, Light mode high-contrast option for direct Caribbean sunlight, Honda Championship Red accents, Diagnostic Amber, Electric Cyan, and Monospace technical specs).

### REQUIRED FEATURES & SECTIONS:
1. Top Vehicle Header:
   - Badges: "2002 Honda Fit (GD1)", "1.3L L13A i-DSI", "RHD JDM Import", "George Town, Grand Cayman".
   - Quick Status Pill: "Stranded: Animal House Lot (North Sound Rd)".
   - Theme Switcher: Dark Mode (Workshop) / Light Mode (Outdoor Sunlight).
2. Interactive Multimeter Diagnostic Tool:
   - Allows the user to select test condition (Resting Battery, Idling, Jump Disconnected) and enter or slider a voltage (e.g. 11.2V to 14.8V).
   - Dynamically calculates and displays: Pass/Fail state, failure mechanism explanation (brush bounce, regulator fail, diode leak), and recommended immediate action.
3. Parts Interchange & Copy Hub:
   - Cards with one-click copy buttons for:
     * Honda OE: 31100-PWA-004
     * Mitsubishi OE: A5TB0091 / AHGA56
     * Universal Aftermarket: 11177N
     * Internal Regulator: Gauss GA225-14V
   - Notes on why replacing just the regulator is not DIY-feasible (soldered to rectifier plate).
4. Dual-Method Removal Guide:
   - Segmented tab control to switch between:
     * Method A: Front Bumper & Radiator Swing (Pro Recommended)
     * Method B: Top Intake & EGR Stud Extraction (Alternative)
   - Step-by-step checklist with interactive checkboxes that persist to localStorage.
   - Highlighted callout for the hidden 12mm lower pivot bolt access near the oil filter.
5. Interactive 4-Pin Mitsubishi Connector Visualizer:
   - Visual interactive schematic of the 4-pin plug (IG, C, FR, L).
   - Clicking a pin displays its pinout function, bench excitation instructions, and multimeter expected reading.
   - Diagram of the bench drill spin test setup.
6. George Town Emergency & Parts Directory:
   - Local vendor cards with one-tap phone links:
     * Cartronics Auto Parts (+1 345-949-4446) - Top pick for used JDM (~CI$50-80)
     * Tony's Toys (+1 345-946-8697) - Industrial Park testing & salvage
     * Car Clinic Ltd (+1 345-949-7080) - Bench rebuilds
     * Parker's Cayman (+1 345-949-0599) - Walkable emergency supplies
   - "No-Tow" short drive survival checklist (turning blower setting 4 completely OFF to 0).

Output clean, modular, fully typed React code with zero placeholder comments, ready to run directly in Vite and deploy to Cloudflare Workers!
```
