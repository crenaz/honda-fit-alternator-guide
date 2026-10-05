Design a high-utility, mobile-first technical automotive diagnostic and repair web app called "FIT-SPEC: 2002 JDM Honda Fit Field Dossier & Alternator Triage".

### 1. DESIGN SYSTEM & AESTHETIC ("Modern Utilitarian Workshop")
- Theme: Ultra-clean Dark Mode inspired by Japanese racing telemetry (Spoon/Mugen) and rugged industrial diagnostic tools. High-contrast for outdoor sunlight and greasy-screen readability.
- Color Palette:
  * Background / Base: Deep Slate/Charcoal (#0D1117, #161B22)
  * Borders & Dividers: Slate Grey (#30363D)
  * Primary Accent: Honda Championship Red (#E60012)
  * Diagnostics & Caution: Amber / Warning Gold (#F59E0B)
  * Pass / Live Current: Charging Emerald Green (#10B981)
  * Circuit & Signals: Electric Cyan (#06B6D4)
- Typography: High-legibility Sans-Serif for body text with Monospace (JetBrains Mono style) for all part numbers, voltages, torque values, and chassis codes.

---

### 2. CORE SCREENS TO GENERATE:

#### Screen 1: Field Triage & Incident Overview (Home/Dashboard)
- Header: Vehicle spec chip: "2002 Honda Fit GD1 • 1.3L L13A i-DSI • RHD JDM • George Town, Grand Cayman".
- Emergency Status Banner: High-priority Amber card: "VEHICLE STRANDED: Animal House Lot (North Sound Rd)".
- Interactive Voltage Triage Card:
  * Quick-input voltage dial/slider (10.0V - 15.0V) and state selector ("Resting", "Idle", "Jumpers Removed").
  * Dynamic outcome badge (e.g. Red pill: "FAIL: System at 11.8V - Alternator dead, running on battery reserve").
- Cascade Breakdown Timeline: Vertical step progress card tracing the failure:
  1. Brush contact wear (flickering battery light)
  2. Idle hunting & EPS cutout (voltage dropped <10.5V)
  3. Blower Max Draw (setting 4 pulled 25A) -> Engine Stall.

#### Screen 2: Parts Interchange & Sourcing Hub
- Master Part Number Cards with prominent copy icons & monospace typography:
  * Honda OEM: `31100-PWA-004`
  * Mitsubishi Factory OE: `A5TB0091` / `AHGA56`
  * Lester Aftermarket: `11177N`
  * Gauss Voltage Regulator: `GA225-14V`
- Warning Alert Banner (Red/Amber border): "FIELD REPAIR WARNING: Regulator is hard-soldered to the diode rectifier plate. Field brush/regulator swap is not DIY-feasible. Full assembly swap required."
- Physical Spec Grid: 80 Amp, 12V/14V, 5-Groove Serpentine, Clockwise Rotation, 4-Pin Green Oval Plug.

#### Screen 3: Step-by-Step Removal Procedures
- Segmented Control Switcher at top: [Method A: Front Bumper & Radiator Tilt (Recommended)] vs [Method B: Top Intake & EGR Stud Extraction].
- Interactive Checklist Cards: Step items with checkable circles/boxes:
  * Step 1: Disconnect 10mm negative terminal.
  * Step 2: Unclip front bumper & tilt radiator support forward 2 inches (keep AC lines intact).
  * Step 3: Unbolt 10mm B+ output stud and green harness connector.
  * Critical Callout Card (Cyan glow): "Hidden Lower 12mm Pivot Bolt: Reach from below above oil filter using 6-inch socket extension (Torque: 45 N·m / 33 lb-ft)."
  * Step 4: Extract alternator straight forward through core opening.

#### Screen 4: Bench Test & 4-Pin Connector Visualizer
- Mitsubishi 4-Pin Harness Diagram: Clean 2x2 terminal graphic:
  * Top Left: [IG - Ignition Feed (+12V)]
  * Top Right: [C - Computer Field Control]
  * Bottom Left: [FR - Field Monitor Return]
  * Bottom Right: [L - Warning Lamp Ground]
- Selected Pin Detail Drawer: Shows test wire color, test hookup instructions, and excitation voltage rules.
- Bench Spin Test Schematic Card: Visual steps for spinning the pulley clockwise with a high-torque drill while measuring B+ to casing with a multimeter (Pass: 13.8V-14.5V).

#### Screen 5: George Town Local Logistics & Directory
- One-Tap Cayman Supplier Cards with phone buttons, hours, and notes:
  * Cartronics Auto Parts: 20 Saturn Close (Phone: +1 345-949-4446) - Used JDM parts (~CI$50 - CI$80)
  * Tony's Toys: 91 Sherwood Dr (Phone: +1 345-946-8697) - Diagnostics & salvage stock
  * Car Clinic Ltd: 147A Dorcy Dr (Phone: +1 345-949-7080) - Bench rebuilding & dyno testing
  * Parker's: North Sound Rd (Walkable, emergency tools & jump packs)
- Emergency "No-Tow" Transit Card: Checklist for limping 1.6km down Seymour Dr on jump-charged battery:
  * Blower fan dial turned completely to '0' (Crucial: prevents 25A drain)
  * Headlights and radio OFF
  * Keep RPM moderate.