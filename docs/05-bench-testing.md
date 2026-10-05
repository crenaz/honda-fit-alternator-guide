# 05. Bench Testing Methodology

## Overview
Never install a replacement alternator (whether secondhand from Cartronics or rebuilt in Industrial Park) without bench testing it first. Doing so avoids repeating the complex GD1 installation procedure if the replacement has a latent fault.

---

## 1. Professional Auto-Electric Bench Test (Recommended)
Bring the unbolted unit to an auto-electrical shop in George Town (such as **Car Clinic** on Dorcy Drive or **Tony's Toys** on Sherwood Drive).
- **Test:** The alternator is mounted on an electric motor dyno with variable resistor loads.
- **Verification:** Measures actual output current (should reach near 80A under load) and ripple voltage from the diode pack.

---

## 2. DIY Workshop Drill Bench Test

If testing in a private workshop or home garage, you can verify basic excitation and voltage regulation using a corded high-torque drill.

### Wiring Schematic

```text
                  [ 12V BATTERY ]
                 /               \
    (-) Negative /                 \ (+) Positive
                /                   \
      [ Vice / Case ]       [ B+ Terminal ] <--- Multimeter (+) Red Lead
                \                   /
     Multimeter  \                 /
     (-) Black    \               /
     Lead          \             /
                    [ IG / L Pins ] <--- 12V (+) Excitation via jumper wires
```

### Connector Pinout (4-Pin Mitsubishi Plug)
Looking directly into the alternator harness receptacle:
- **Pin 1 (IG - Ignition):** Supplies 12V switch power to energize the internal voltage regulator IC.
- **Pin 2 (C - Computer / FR):** Communicates field duty cycle to Honda ECU (can be left open for bench test).
- **Pin 3 (L - Lamp):** Feeds dashboard battery indicator (connect to 12V+ via a small 12V bulb or 500-ohm resistor, or jump directly for brief test).
- **Pin 4 (FR - Field Reference):** Left open during basic bench testing.

### Test Procedure
1. **Clamp Body:** Securely mount the alternator in a heavy steel bench vice by its lower mounting ear.
2. **Ground Connection:** Run a heavy 10 AWG jumper cable from 12V battery negative `(-)` to the metal casing or vice.
3. **Power Connection:** Run a 10 AWG cable from 12V battery positive `(+)` to the threaded B+ output post.
4. **Excite Regulator:** Connect a jumper wire from 12V positive `(+)` to the **IG** and **L** pins.
5. **Connect Multimeter:** Set to DC Volts (20V). Red probe to B+ post, Black probe to casing. The meter will show resting battery voltage (~12.5V).
6. **Spin Pulley:** Fit an appropriate socket onto a high-speed drill, seat it on the pulley nut, and spin **clockwise**.

### Evaluation Criteria
- **PASS:** Output immediately climbs to **13.8V – 14.5V** as the drill reaches operating RPM.
- **FAIL (No Output):** Voltage stays flat at battery voltage (~12.4V) or drops. Rotor open-circuit, worn brushes, or dead regulator.
- **FAIL (Overvoltage):** Voltage exceeds 15.2V. Regulator shorted (will boil battery).
