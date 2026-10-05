# 02. Symptom Progression & Diagnostic Triage

## 1. Chronology of Failure (Field Observations)

The breakdown followed a classic cascade failure of an automotive charging system:

```text
[Phase 1: Intermittent Contact]
- Battery light flickers occasionally over bumps or at specific engine harmonic frequencies.
- Root cause: Alternator carbon brushes worn to their wear limits (~2mm) bouncing on slip rings.

[Phase 2: Regulated Output Degradation]
- Headlight illumination brightness fluctuates directly with engine RPM.
- Engine idle speed hunts/surges up and down continuously.
- Root cause: Internal voltage regulator breakdown; ECU senses voltage drops and opens idle air valve to spin alternator faster.

[Phase 3: High-Draw Catastrophe]
- Air conditioner blower turned to setting '4' (max current draw, ~20-25 Amperes).
- EPS (Electric Power Steering) warning illuminates; power assist disables.
- Fuel gauge needle falls to 'E'.
- Transmission green 'D' lamp begins blinking (TCU emergency low-voltage code).
- Root cause: Total alternator cessation. Vehicle running 100% on battery reserve. System voltage drops below 10.5V.

[Phase 4: Dead Stop & No-Crank]
- Engine shut off in Animal House parking lot.
- Slow crank / unable to start.
- Cabin door locks operate (low relay amp draw), but insufficient power to spin starter motor.
- Tightening a loose terminal yielded slightly faster click/turnover, confirming battery was completely drained.
```

---

## 2. On-Site Multimeter Verification Checklist

Before unbolting the alternator, perform this rapid field verification with a Digital Multimeter (DMM):

### Test 1: Static Battery State of Charge
1. Set DMM to **DC Volts (20V range)**.
2. Probe Red (+) to battery positive post, Black (-) to battery negative post.
   - **Result:** `< 11.5V` = Battery is severely discharged. Must be jump-started or slow-charged.

### Test 2: The Jump-Disconnect Confirmation
1. Connect jumper cables from donor vehicle to Fit battery.
2. Run donor engine at 2,000 RPM for 5–10 minutes to feed charge into Fit.
3. Start the 2002 Fit engine. Let it settle into idle.
4. **Disconnect the jumper cables.**
5. Probe the battery terminals immediately with DMM:
   - **PASS (Alternator OK):** Voltage reads **13.8V – 14.5V** steady. (Problem is purely an exhausted battery or faulty ground strap).
   - **FAIL (Alternator Dead):** Voltage reads **<= 12.4V** and steadily drops as spark plugs fire.
   - **FAIL (Immediate Stall):** Engine cuts off immediately upon jumper removal. Alternator field coils or diodes are completely open-circuit.

### Test 3: Load & Ripple Check
1. If the car idles independently, have an assistant rev to 2,000 RPM and turn on headlights and rear defroster.
2. Check voltage:
   - Should remain above **13.2V**.
   - If voltage drops below **12.5V**, the diode rectifier pack or brush set is defective.
