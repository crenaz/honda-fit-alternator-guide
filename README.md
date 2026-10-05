# 2002 JDM Honda Fit (RHD) Alternator Repair & Diagnostic Dossier

This repository contains organized technical documentation and field notes for diagnosing, removing, bench-testing, and sourcing an alternator for a 2002 Right-Hand Drive (JDM) Honda Fit (GD1 chassis, 1.3L L13A i-DSI) in George Town, Grand Cayman.

---

## 📂 Documentation Structure (`docs/`)

The documentation is organized into modular Markdown chapters formatted for clean reading and direct static-site generation:

- [`docs/00-executive-summary.md`](docs/00-executive-summary.md): **Executive Summary** — Rapid 2-minute diagnostic & field triage brief for remote mechanics.
- [`docs/index.md`](docs/index.md): **Overview & Field Brief (TL;DR)** — Key findings, quick triage flow, and core recommendations.
- [`docs/01-vehicle-identification.md`](docs/01-vehicle-identification.md): **Chassis Matrix & Model ID** — GD1 vs GD2/GD3/GD4, VIN plate decoding, Mitsubishi factory alternator genealogy.
- [`docs/02-symptom-triage.md`](docs/02-symptom-triage.md): **Failure Sequence & Diagnostics** — Timeline of failure (flicker → idle hunt → EPS shutdown → cluster dead), DMM multimeter proof test.
- [`docs/03-parts-and-interchange.md`](docs/03-parts-and-interchange.md): **Part Numbers & Interchange** — Mitsubishi A5TB0091, AHGA56, Honda 31100-PWA-004, Lester 11177N, internal component numbers.
- [`docs/04-removal-procedures.md`](docs/04-removal-procedures.md): **Removal Procedures** — Method A (Front bumper / radiator swing) vs. Method B (Intake / EGR stud removal), lower pivot bolt access, torque specs.
- [`docs/05-bench-testing.md`](docs/05-bench-testing.md): **Bench Testing Guide** — DIY drill and bench vice test (IG / L pin excitation), professional dyno testing.
- [`docs/06-george-town-directory.md`](docs/06-george-town-directory.md): **Local Cayman Directory** — Animal House staging, Parker's, Cartronics, Tony's Toys, Car Clinic, used pricing (CI$50–$80).
- [`source-notes/PRD.md`](source-notes/PRD.md): **Product Requirements Document** — Feature specifications, user stories, and deployment setup.
- [`source-notes/DESIGN.md`](source-notes/DESIGN.md): **Design System & UI Specification** — "Modern Utilitarian Workshop" aesthetic, color tokens, typography, and interactive components.

---

## 🚀 Running the React + Vite Application

The repository is built as an interactive technical field manual using **React 19**, **Vite**, and **Tailwind CSS**.

### Setup & Development

```bash
# 1. Install dependencies:
npm install

# 2. Start the local development server (serves on http://localhost:3000):
npm run dev

# 3. Build for production:
npm run build

# 4. Preview the production build locally:
npm run preview

# 5. Deploy to Cloudflare Workers:
npm run deploy
```

### Remote Mechanic Access
To present the site to your mechanic while they are off-island:
- **Cloudflare Workers (Recommended):** Run `npm run deploy` (requires Cloudflare login via `npx wrangler login`) for instant global edge hosting with HTTPS.
- **ngrok / Cloudflare Tunnel (Quick dev share):** Run `npx ngrok http 3000` or `cloudflared tunnel --url http://localhost:3000` to get a temporary public URL directly from your local instance.

---

## ⚠️ Automotive & Electrical Safety Disclaimer

> [!WARNING]
> **READ BEFORE PERFORMING ANY DIAGNOSTIC OR MECHANICAL WORK**  
> Automotive mechanical work and high-current electrical repair carry inherent risks of personal injury, electric shock, chemical battery burns, fire, and vehicle or property damage.

The guides, wiring schematics, diagnostic procedures, torque specifications, and technical notes provided in this repository are for educational, informational, and reference purposes only.

- **Battery Safety:** Always disconnect the negative (`-`) battery terminal before inspecting, removing, or servicing the alternator, starter, or any high-current wiring.
- **Proper Equipment:** Always use safety glasses/goggles, insulated hand tools, heat-resistant gloves, and rated vehicle supports (never work under a vehicle supported only by a hydraulic jack).
- **Bench & Drill Testing:** Rotating alternator pulleys and drill chucks present severe snag and entanglement hazards. Secure the alternator housing firmly in a bench vice and keep loose clothing, hair, and jewelry completely clear.
- **Professional Consultation:** If you are unsure about any procedure, voltage reading, or mechanical disassembly, consult a certified automotive technician.

*Neither the authors nor any contributors assume any liability, responsibility, or obligation for personal injury, vehicular damage, equipment failure, financial loss, or any direct or consequential damages resulting from the use or misuse of the information provided herein.*

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
