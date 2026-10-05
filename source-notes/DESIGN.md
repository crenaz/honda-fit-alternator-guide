# Design Language Style Guide & UI Specification

**Project:** 2002 JDM Honda Fit (RHD) Alternator Technical Dossier & Diagnostic Web App  
**Design Philosophy:** "Modern Utilitarian Workshop"  
**Theme Modes:** Dual-mode (Dark Mode default for garage/workshop + High-Contrast Light Mode for direct Caribbean sunlight)  
**Target Environments:** Mobile/Tablet (under-the-hood smartphone use, bright sunlight, grease-smudged screens) & Desktop  
**Related Documents:** [`PRD.md`](./PRD.md)  

---

## 1. Design Persona & Vibe

- **Concept:** **"Modern Utilitarian Workshop"** — High-contrast, hyper-legible, functional, and rugged.
- **Inspiration:** Japanese racing telemetry (Spoon Sports, Mugen), OEM Honda factory workshop manuals, and sleek dark-mode developer/engineering consoles.
- **Dual-Environment Ergonomics:** 
  - **Workshop / Garage (Dark Mode):** Deep slate canvas minimizes battery drain and eye fatigue in dim bays or under the hood.
  - **Outdoor Caribbean Glare (Light Mode):** High-contrast crisp paper-white canvas with dark slate text and punchy borders, eliminating reflections in bright tropical sunlight.
  - **Touch Targets:** Large, thumb-friendly tap targets ($\ge 44\text{px}$) designed for one-handed smartphone operation with greasy fingers.
  - **Information Density:** High visual hierarchy so a mechanic or owner can identify part numbers, torque values, and pinouts in under 3 seconds.

---

## 2. Color System: Dual-Mode Tokens (Dark & Light)

All components must implement Tailwind CSS class pairs (`light-class dark:dark-class`) to ensure seamless transition between themes.

### Theme Token Matrix

| Semantic Token | Light Mode (Sunlight) | Dark Mode (Workshop Default) | Semantic Role & Application |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` (`bg-slate-50`) | `#0D1117` (`dark:bg-slate-950`) | Primary app container background |
| **Surface Card** | `#FFFFFF` (`bg-white`) | `#161B22` (`dark:bg-slate-900`) | Main content cards, modals, drawers |
| **Surface Raised** | `#F1F5F9` (`bg-slate-100`) | `#21262D` (`dark:bg-slate-800`) | Secondary cards, button backgrounds, input fills |
| **Surface Border** | `#CBD5E1` (`border-slate-300`) | `#30363D` (`dark:border-slate-800`) | Crisp card outlines & section dividers |
| **Text Primary** | `#0F172A` (`text-slate-900`) | `#F0F6FC` (`dark:text-slate-100`) | Headings, primary technical specs, part numbers |
| **Text Secondary** | `#475569` (`text-slate-600`) | `#8B949E` (`dark:text-slate-400`) | Labels, descriptions, timestamps, subtitles |
| **Text Muted** | `#64748B` (`text-slate-500`) | `#6E7681` (`dark:text-slate-500`) | Subtle footnotes, inactive tabs, disabled items |
| **Honda Championship Red** | `#DC2626` (`text-red-600` / `bg-red-600`) | `#E60012` (`dark:text-red-500` / `dark:bg-red-600`) | Critical alerts, arc warnings, failure status |
| **Diagnostic Amber** | `#D97706` (`text-amber-600` / `bg-amber-500`) | `#F59E0B` (`dark:text-amber-400` / `dark:bg-amber-500`) | Battery light flicker, caution states, triage warnings |
| **Charging Green** | `#059669` (`text-emerald-600` / `bg-emerald-600`) | `#10B981` (`dark:text-emerald-400` / `dark:bg-emerald-500`) | Multimeter PASS status, verified parts, nominal voltage |
| **Electric Cyan** | `#0891B2` (`text-cyan-600` / `bg-cyan-600`) | `#06B6D4` (`dark:text-cyan-400` / `dark:bg-cyan-500`) | EPS circuits, interactive pinout glows, pro tips |

---

## 3. Theme Switching Architecture

### Strategy
- **Mode Toggle:** Standard HTML root class toggling (`<html class="dark">` vs. `<html class="light">`).
- **Default State:** Dark mode (`dark`) is preferred by default for automotive workshop aesthetics.
- **Persistence:** Persisted to browser storage via `localStorage.getItem('theme')`.
- **System Preference Detection:** Falls back to `window.matchMedia('(prefers-color-scheme: dark)')` on first load if no preference is stored.

### Header Toggle Implementation Pattern
```tsx
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fit_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('fit_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('fit_theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Sunlight/Workshop Theme"
      className="p-2 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};
```

---

## 4. Typography Scale & Hierarchy

- **Body Font:** Inter or system sans-serif (`font-sans`) — Crisp, neutral, highly legible at small sizes.
- **Technical & Monospace Font:** JetBrains Mono, Fira Code, or system `font-mono` — Mandatory for all part numbers, torque values, voltages, pinout codes, and chassis IDs.

### Dual-Theme Type Scale:
- **H1 / App Title:** `text-2xl font-bold tracking-tight uppercase font-mono text-slate-900 dark:text-slate-100`
- **H2 / Section Title:** `text-lg font-semibold tracking-wide flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-900 dark:text-slate-100`
- **H3 / Card Header:** `text-base font-semibold text-slate-800 dark:text-slate-200`
- **Body Regular:** `text-sm text-slate-600 dark:text-slate-300 leading-relaxed`
- **Meta / Labels:** `text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400`
- **Monospace Spec / Part #:** `text-base md:text-lg font-mono font-bold text-slate-900 dark:text-slate-100`
- **Inline Badges & Chips:** `text-xs font-mono font-medium px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800`
- **Code & Torque Specs:** `text-sm font-mono bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700`

---

## 5. Dual-Mode Component Design Patterns

### A. Spec & Part Number Cards (with One-Click Copy)
High-contrast cards that remain sharp in bright glare and deep in workshop dark:
```html
<div class="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg shadow-sm">
  <div>
    <span class="text-xs uppercase text-slate-500 dark:text-slate-400 font-mono tracking-wider">Mitsubishi OE</span>
    <p class="text-lg font-mono font-bold text-slate-900 dark:text-slate-100 tracking-tight">A5TB0091</p>
  </div>
  <button class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-xs font-mono text-cyan-700 dark:text-cyan-400 rounded-md transition flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 shadow-sm">
    <svg class="w-3.5 h-3.5" ...></svg>
    <span>Copy</span>
  </button>
</div>
```

### B. Technical Callout Cards (Alert Banners)
- **Critical Danger (Arcing / Soldered Regulator / Battery Disconnect):**
  - Left border: `border-l-4 border-red-600`
  - Background: `bg-red-50 dark:bg-red-950/20`
  - Border: `border border-red-200 dark:border-red-900/40`
  - Text: `text-red-900 dark:text-red-200`
- **Pro Mechanic Tip (Hidden Pivot Bolt / Double-Nut Stud Removal):**
  - Left border: `border-l-4 border-cyan-600`
  - Background: `bg-cyan-50 dark:bg-cyan-950/20`
  - Border: `border border-cyan-200 dark:border-cyan-900/40`
  - Text: `text-cyan-900 dark:text-cyan-200`
- **Field Incident Status (Stranded Vehicle / Location):**
  - Left border: `border-l-4 border-amber-600`
  - Background: `bg-amber-50 dark:bg-amber-950/20`
  - Border: `border border-amber-200 dark:border-amber-900/40`
  - Text: `text-amber-900 dark:text-amber-200`

### C. Interactive 4-Pin Mitsubishi Connector Visualizer
Visual representation of the female socket on the Mitsubishi alternator:
```
┌─────────────┬─────────────┐
│  [IG]       │  [C]        │
│  Ignition   │  Computer   │
├─────────────┼─────────────┤
│  [FR]       │  [L]        │
│  Field Rtn  │  Lamp       │
└─────────────┴─────────────┘
```
- **Pin Grid Container:** `bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-4 rounded-xl`
- **Pin Cell Inactive:** `bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200`
- **Pin Cell Active / Selected:** `bg-cyan-50 dark:bg-cyan-950/40 border-2 border-cyan-600 dark:border-cyan-400 text-cyan-800 dark:text-cyan-300 ring-2 ring-cyan-500/20`
- **Active Pin Drawer:** Slide-out drawer or bottom panel detailing signal voltage, harness color, and drill-spin excitation rules.

### D. Dual-Method Removal Guide (Segmented Control & Checklist)
- **Segmented Switcher:** 
  - Container: `bg-slate-200 dark:bg-slate-950 p-1 rounded-lg border border-slate-300 dark:border-slate-800`
  - Inactive tab: `text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200`
  - Active tab: `bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm font-semibold`
- **Checklist Items:**
  - Checkbox: `accent-emerald-600 w-5 h-5 rounded cursor-pointer`
  - Active Step: `text-slate-900 dark:text-slate-100`
  - Completed Step: `opacity-50 line-through text-slate-400 dark:text-slate-500`

### E. Diagnostic Multimeter Simulator Widget
- Gauge / Input slider spanning `10.0V` to `15.5V`.
- State selector tabs:
  - `[ Key-On / Engine Off ]` | `[ Engine Idling ]` | `[ Jump Leads Disconnected ]`
- Dynamic status display:
  - $< 12.4\text{V}$ (Idling/Jump Removed): **FAIL** (`text-red-700 dark:text-red-400`, `bg-red-100 dark:bg-red-950/40`, "Dead Alternator — Running on Battery Reserve")
  - $13.8\text{V} - 14.5\text{V}$: **PASS** (`text-emerald-700 dark:text-emerald-400`, `bg-emerald-100 dark:bg-emerald-950/40`, "Nominal Charging Voltage")
  - $> 14.8\text{V}$: **OVERVOLTAGE** (`text-amber-700 dark:text-amber-400`, `bg-amber-100 dark:bg-amber-950/40`, "Regulator Shorted — Battery Cooking Hazard")

### F. Local Supplier & Emergency Contact Cards
- Contact cards optimized for one-touch mobile dialing:
  - Card: `bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-4`
  - Price Tag Badge: `font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded`
  - Primary Call Button: `bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2`
  - Secondary WhatsApp Button: `bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700`

---

## 6. Layout & Responsiveness Guidelines

- **Container:** Max width `max-w-4xl mx-auto px-4 sm:px-6 py-6`.
- **Sticky Top Bar:**
  - `bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40`
  - Features Vehicle ID Badge, Theme Switcher (Sun/Moon), and Print/PDF export action.
- **Quick Anchor Navigation:**
  - Pill scroll bar: `#triage` | `#parts` | `#removal` | `#bench-test` | `#suppliers`
- **Touch Ergonomics:**
  - Minimum tap target: $44\text{px} \times 44\text{px}$.
  - Spacing between interactive elements: minimum `8px` gap to prevent greasy-finger misclicks.
