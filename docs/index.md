# 📋 JDM 2002 Honda Fit Alternator Dossier & Field Brief (TL;DR)

> **Vehicle:** 2002 Honda Fit (GD1 / JDM Right-Hand Drive)  
> **Engine:** 1.3L L13A i-DSI (8 Spark Plugs, 2WD, CVT)  
> **Current Location:** Animal House parking lot, North Sound Rd, George Town, Grand Cayman  
> **Target Audience:** Remote Mechanic Review (Quick Brief) & Deep Technical Archive  

---

## ⚡ 1. The 30-Second Diagnosis Summary

```
Failure Progression:
Battery light flicker (worn brushes) 
  ➔ Idle surges up/down (ECU hunting to raise voltage) 
  ➔ EPS shuts down (voltage drops < 11V) 
  ➔ Blower at full blast ('4') drains battery reserve 
  ➔ Instrument cluster drops, 'D' indicator flashes (TCU fail-safe) 
  ➔ Engine shut off, no-crank / stranded.
```

- **Definitive 60-Second Field Test:** Jump-start car $\rightarrow$ disconnect jumper cables $\rightarrow$ probe battery terminals with DMM:
  - **$< 12.8\text{V}$ and falling:** Alternator is **100% dead** (car is running purely off battery reserve).
  - **$13.5\text{V} - 14.5\text{V}$ steady:** Alternator is charging (issue is battery health or terminal connection).
  - 🔗 *Read full diagnostic checklist:* [02. Symptom Progression & Diagnostic Triage](./02-symptom-triage.md)

---

## 🔍 2. Exact Interchange Part Numbers

The factory unit was built by **Mitsubishi Electric** (80A, 12V/14V, 5-groove pulley):

| Identification | Part Number | Sourcing Notes |
| :--- | :--- | :--- |
| **Mitsubishi OE Number** | **`A5TB0091`** / `AHGA56` | Stamped on alternator casing |
| **Honda Genuine OEM** | **`31100-PWA-004`** | First-gen factory fitment (2001–2005) |
| **Universal Aftermarket** | **`11177N`** | Industry exchange code (NAPA / aftermarket) |
| **Later Revision Interchange** | `31100-RSH-004` / `A5TB1391` | Direct bolt-in fitment (~2005+) |

> [!WARNING]
> **Can we replace just the internal voltage regulator?**  
> **No.** The regulator is **hard-soldered** to the diode rectifier plate. Sourcing a complete secondhand assembly in Cayman is much faster and cheaper.  
> 🔗 *Read detailed parts interchange & component catalog:* [03. OEM Parts & Interchange Catalog](./03-parts-and-interchange.md)

---

## 🛠️ 3. Extraction Shortcut: Method A vs. Method B

The GD1 engine bay is notoriously tight:

- **Method A: The Front Bumper Approach (Pro Recommended):** Drop bumper cover $\rightarrow$ unbolt upper core support tie bar $\rightarrow$ unbolt upper radiator/condenser brackets $\rightarrow$ tilt forward $\rightarrow$ pull alternator straight out through the front gap.
- **Method B: Top-Engine Clearance (No Bumper Removal):** Unbolt intake pipe $\rightarrow$ unbolt EGR valve (12mm) $\rightarrow$ **CRITICAL:** Extract the threaded EGR mounting studs out of the head (otherwise they physically block extraction) $\rightarrow$ twist upward.
- **Bottom 12mm Pivot Bolt Access:** Reach up from **underneath the car**, directly above the oil filter area using a 12mm socket with a **6-inch extension**.
- **Torque Specs:** Lower pivot bolt = **`45 N·m (33 lb-ft)`** | Upper adjustment bolts = **`22 N·m (16 lb-ft)`**.  
🔗 *Read step-by-step removal guide:* [04. Step-by-Step Removal Procedures](./04-removal-procedures.md)

---

## 🔬 4. Bench Test Before Installation

Don't install a replacement unit without a 5-minute drill test:

```text
[12V Battery (-)] ────────> Alternator Metal Casing / Vice
[12V Battery (+)] ────────> Threaded B+ Output Stud
[12V Battery (+)] ──(jump)─> Pin 'IG' (Ignition) & Pin 'L' (Lamp) on 4-pin plug
```

- Spin pulley clockwise with a high-torque drill.
- **PASS:** Multimeter on B+ jumps to **13.8V – 14.5V**.
- **FAIL:** Stays at battery voltage (~12.5V).  
🔗 *Read bench test wiring guide & pinout:* [05. Bench Testing Methodology](./05-bench-testing.md)

---

## 📍 5. George Town Local Sourcing & Emergency Relocation

- **Current Location:** Animal House parking lot, North Sound Rd.
- **Emergency "No-Tow" Short Drive (< 2 min):**
  - Jump-start and charge battery for 10 minutes.
  - **TURN BLOWER FAN TO '0'** (the switch is stuck on setting 4, which pulls ~25 Amps and kills the battery).
  - Turn off headlights and radio $\rightarrow$ drive 300m down Seymour Dr to Tony's Toys or 700m to Car Clinic.
- **Local Parts Suppliers (George Town):**
  - **Cartronics Auto Parts** (20 Saturn Close / `+1 345-949-4446`): **Best bet for used JDM Honda parts** (~CI$50–$80).
  - **Car Clinic Ltd.** (147A Dorcy Dr / `+1 345-949-7080`): Alternator rebuilds & electrical dyno testing.
  - **Tony's Toys** (91 Sherwood Dr / `+1 345-946-8697`): Electrical diagnostics & salvage inventory.
  - **Parker's Cayman** (327 North Sound Rd / `+1 345-949-0599`): 100 meters away — multimeters and jump cables.  
🔗 *Read complete local logistics guide:* [06. George Town Directory & Logistics](./06-george-town-directory.md)

---

## 📚 Deep Technical Documentation Index

For in-depth procedures, technical diagrams, and background research:
1. [`01-vehicle-identification.md`](./01-vehicle-identification.md) — Chassis matrix, engine specs, VIN plate decoding.
2. [`02-symptom-triage.md`](./02-symptom-triage.md) — Detailed symptom progression & electrical diagnostics.
3. [`03-parts-and-interchange.md`](./03-parts-and-interchange.md) — Part numbers, internal components, interchange list.
4. [`04-removal-procedures.md`](./04-removal-procedures.md) — Step-by-step extraction walkthroughs.
5. [`05-bench-testing.md`](./05-bench-testing.md) — Pinout schematics & drill test procedures.
6. [`06-george-town-directory.md`](./06-george-town-directory.md) — Maps, local contacts, pricing breakdowns.
