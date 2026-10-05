# Executive Summary: 2002 JDM Honda Fit (RHD) Alternator Diagnosis & Field Brief

> **Source Material:** Strictly synthesized from [`./docs`](./) (`01-vehicle-identification.md` through `06-george-town-directory.md`).  
> **Vehicle:** 2002 Honda Fit (JDM Right-Hand Drive, Chassis: `GD1`, Engine: `L13A` 1.3L i-DSI 8-Plug, 2WD/CVT).  
> **Location:** Stranded at Animal House parking lot, North Sound Road, George Town, Grand Cayman.  
> **Target Audience:** Remote Mechanic (2-minute field triage review).

---

## 1. Breakdown Incident & Electrical Root Cause
The vehicle experienced a textbook cascade failure of its charging system:
1. **Initial Symptoms:** Intermittent dashboard battery light flicker caused by worn carbon brushes (~2 mm remaining) bouncing on rotor slip rings, followed by headlights fluctuating with RPM and idle hunting as the ECU commanded idle air increases to offset falling system voltage.
2. **Total Starvation:** Operating the cabin blower switch on maximum (`setting 4`, pulling 20–25A) with an inoperative alternator exhausted the battery reserve. As system voltage dropped below ~10.5V, the EPS (Electric Power Steering) shut off, the fuel gauge dropped to empty, and the transmission `D` light began flashing in low-voltage fail-safe.
3. **Current State:** Stranded with a severely discharged battery. Tightening a loose terminal marginally improved crank effort but could not start the car.

---

## 2. On-Site Diagnostic Verification (Multimeter)
Before unbolting the alternator, perform this 60-second test:
- **Procedure:** Jump-start the engine from a helper vehicle; run at idle for 2 minutes; **disconnect jumper cables**; measure voltage across battery posts with a DMM set to DC Volts.
- **Pass Criteria:** **13.8V – 14.5V steady** $\rightarrow$ Alternator is charging (issue is strictly battery health or ground strap).
- **Fail Criteria:** **$\le$ 12.4V and continuously dropping** (or immediate engine stall) $\rightarrow$ Alternator is **100% dead**.
- **Load Check:** At 2,000 RPM with headlights and rear defroster ON, voltage must stay $> 13.2\text{V}$; under $12.5\text{V}$ indicates failed diodes or brush contact.  
🔗 *Deep Report:* [`02-symptom-triage.md`](./02-symptom-triage.md)

---

## 3. Parts Interchange & Component Identification
The factory alternator was manufactured by **Mitsubishi Electric** for Honda (80A, 12V/14V, 5-groove serpentine pulley, clockwise rotation, 4-pin oval connector):

| Identification | Part Number | Application / Sourcing Notes |
| :--- | :--- | :--- |
| **Mitsubishi OE (Stamped on Body)** | **`A5TB0091`** / `AHGA56` | Factory original (2001–2005 GD1/GD3) |
| **Honda OEM Assembly** | **`31100-PWA-004`** | Honda parts catalog designation |
| **Universal Aftermarket / Lester** | **`11177N`** | Industry exchange number (NAPA, etc.) |
| **Later Honda / Mitsubishi Revision** | `31100-RSH-004` / `A5TB1391` (`AHGA69`) | Direct bolt-in fitment (~2005–2008) |

> [!WARNING]
> **Component-Level Rebuild Note:**  
> The internal voltage regulator (Gauss ref: `GA225-14V 220910` / Honda `31150-PWA-004`) is **hard-soldered** directly to the rectifier bridge plate (`31127-PWA-004`). It cannot be unbolted or clipped out in the field. Replacing the entire assembly with a tested used or rebuilt unit is required.  
🔗 *Deep Report:* [`01-vehicle-identification.md`](./01-vehicle-identification.md) & [`03-parts-and-interchange.md`](./03-parts-and-interchange.md)

---

## 4. Extraction Methodologies (GD1 Engine Bay)
Due to limited engine bay clearances, choose between two pathways:

- **Method A: Front Bumper & Radiator Tilt (Recommended):**
  1. Disconnect negative battery terminal (`10mm`).
  2. Remove front bumper cover clips and swing front bumper off.
  3. Unbolt upper radiator/condenser brackets (`10mm`) and tilt assembly forward 2–3 inches (do **not** disconnect hoses or AC lines).
  4. Disconnect B+ output nut (`10mm`) and 4-pin harness plug.
  5. Remove upper 12mm slider bolts.
  6. Reach from underneath the car directly above the oil filter with a **12mm socket and 6-inch extension** to remove the lower long pivot bolt.
  7. Slide alternator straight forward through the front core opening.
- **Method B: Top-Engine Clearance (Bumper On):**
  - Unbolt intake ducting and EGR valve (`12mm`).
  - **CRITICAL:** Extract the threaded EGR mounting studs out of the cylinder head (double-nut method); otherwise they physically block the alternator from sliding up.
- **Torque Specs:**
  - Lower Pivot Bolt: **`45 N·m (33 lb-ft)`**
  - Upper Adjustment Bolts: **`22 N·m (16 lb-ft)`**
  - B+ Output Terminal Nut: **`8 N·m (6 lb-ft)`** (avoid over-torquing brittle plastic insulator)  
🔗 *Deep Report:* [`04-removal-procedures.md`](./04-removal-procedures.md)

---

## 5. Bench Testing Before Installation
To avoid reinstalling a defective unit, verify the replacement on a bench:
- **Terminal Hookup:**
  - Battery `(-)` $\rightarrow$ Alternator casing / mounting tab.
  - Battery `(+)` $\rightarrow$ Threaded B+ output stud.
  - 12V `(+)` Jumpers $\rightarrow$ **Pin 1 (`IG` - Ignition)** and **Pin 3 (`L` - Lamp)** on the 4-pin green connector to excite the regulator.
  - Multimeter Red `(+)` to B+ stud, Black `(-)` to casing.
- **Spin Test:** Spin pulley **clockwise** with a high-torque drill.
  - **PASS:** Output jumps from resting battery voltage (~12.5V) to **13.8V – 14.5V**.
  - **FAIL:** Stays at battery voltage or drops $\rightarrow$ open coils, bad regulator, or worn brushes.  
🔗 *Deep Report:* [`05-bench-testing.md`](./05-bench-testing.md)

---

## 6. George Town Local Sourcing & Short-Transit Logistics
- **Immediate Proximity:** Vehicle is stranded in the Animal House lot on North Sound Rd, $< 100\text{ m}$ from Parker's and $< 800\text{ m}$ from the Industrial Park repair hub.
- **"No-Tow" Short Transit Procedure:**
  - Jump-start and surface-charge battery for 10–15 minutes.
  - **CRITICAL:** Switch cabin blower completely to **`0`** (blower on setting 4 draws ~25A and will stall the car). Turn headlights and stereo **OFF**.
  - Drive the 1.6 km / 2-minute route down Seymour Dr directly to a repair shop. Under spark-and-fuel-only load, a charged battery will sustain 5–10 minutes of driving.
- **Local Sourcing Contacts (George Town):**
  - **Cartronics Auto Parts** (20 Saturn Close, `+1 345-949-4446`): Primary choice for used/salvaged JDM Honda Fit alternators (**`CI$50 – CI$80`**).
  - **Tony's Toys Automotive** (91 Sherwood Dr, `+1 345-946-8697`): Electrical diagnostics, testing bays, and salvage stock.
  - **Car Clinic Ltd.** (147A Dorcy Dr, `+1 345-949-7080`): Dedicated bench rebuilding & dyno testing (**`CI$75 – CI$100`**).
  - **Parker's Cayman** (327 North Sound Rd, `+1 345-949-0599`): Multimeters, booster packs, emergency hand tools.
  - **NAPA / Kirk Motors** (519 Shedden Rd, `+1 345-949-0200`): New aftermarket units (quote Lester **`11177N`**).  
🔗 *Deep Report:* [`06-george-town-directory.md`](./06-george-town-directory.md)
