import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Copy,
  Check,
  Phone,
  MapPin,
  Wrench,
  Cpu,
  Gauge,
  FileText,
  RotateCw,
  Printer,
  Sliders,
  BatteryCharging,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  ExternalLink,
  Clock,
  Sparkles,
  DollarSign
} from 'lucide-react';

// --- TYPES & INTERFACES ---
type SectionTab = 'triage' | 'parts' | 'removal' | 'bench' | 'logistics';
type SimState = 'resting' | 'idling' | 'jumpers';
type RemovalMethod = 'A' | 'B';

interface PinData {
  badge: string;
  name: string;
  wireColor: string;
  description: string;
  hookup: string;
  reading: string;
  tip: string;
}

// --- APP COMPONENT ---
export default function App() {
  // Theme state: dark (workshop default) or light (Caribbean sunlight)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('FIT_SPEC_THEME');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<SectionTab>('triage');
  const [viewAllDossier, setViewAllDossier] = useState<boolean>(false);

  // Multimeter Simulator State
  const [simState, setSimState] = useState<SimState>('jumpers');
  const [voltage, setVoltage] = useState<number>(11.8);

  // Removal Procedures State
  const [removalMethod, setRemovalMethod] = useState<RemovalMethod>('A');
  const [completedStepsA, setCompletedStepsA] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('FIT_SPEC_STEPS_A');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [completedStepsB, setCompletedStepsB] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('FIT_SPEC_STEPS_B');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Tooling checklist state
  const [checkedTools, setCheckedTools] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('FIT_SPEC_TOOLS');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Limp transit checklist state
  const [limpSteps, setLimpSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('FIT_SPEC_LIMP_STEPS');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bench Pinout visualizer state
  const [selectedPin, setSelectedPin] = useState<'ig' | 'c' | 'fr' | 'l'>('ig');

  // Copy feedback tracking
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync theme with document element
  useEffect(() => {
    localStorage.setItem('FIT_SPEC_THEME', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist checklists
  useEffect(() => {
    localStorage.setItem('FIT_SPEC_STEPS_A', JSON.stringify(completedStepsA));
  }, [completedStepsA]);

  useEffect(() => {
    localStorage.setItem('FIT_SPEC_STEPS_B', JSON.stringify(completedStepsB));
  }, [completedStepsB]);

  useEffect(() => {
    localStorage.setItem('FIT_SPEC_TOOLS', JSON.stringify(checkedTools));
  }, [checkedTools]);

  useEffect(() => {
    localStorage.setItem('FIT_SPEC_LIMP_STEPS', JSON.stringify(limpSteps));
  }, [limpSteps]);

  // Copy to clipboard helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Multimeter presets
  const handleSimPreset = (state: SimState) => {
    setSimState(state);
    if (state === 'resting') setVoltage(12.1);
    if (state === 'idling') setVoltage(14.1);
    if (state === 'jumpers') setVoltage(11.8);
  };

  // Evaluation derived from current voltage
  const voltageEval = useMemo(() => {
    if (voltage < 11.8) {
      return {
        status: 'CRITICAL FAIL',
        badgeColor: 'bg-red-600 text-white',
        border: 'border-red-600',
        textColor: 'text-red-500',
        summary: `FAIL: System at ${voltage.toFixed(1)}V - Alternator dead, total battery depletion!`,
        cause: 'Rotor brushes completely eroded (<1.5mm) or shorted stator winding. No current generation; vehicle running on remaining residual cell chemistry.',
        action: 'DO NOT crank further. Disconnect negative terminal immediately to preserve cell plates for recovery jump.'
      };
    } else if (voltage >= 11.8 && voltage <= 12.4) {
      return {
        status: 'WARNING / DISCHARGING',
        badgeColor: 'bg-amber-600 text-white',
        border: 'border-amber-500',
        textColor: 'text-amber-500',
        summary: `FAIL: System at ${voltage.toFixed(1)}V - Alternator dead, operating purely on battery reserve.`,
        cause: 'Diode rectifier breakdown or carbon brushes failing slip ring contact. Field coils inactive; Electric Power Steering (EPS) shutdown imminent.',
        action: 'Prepare for complete alternator replacement. Review parts interchange and Cayman supplier directory.'
      };
    } else if (voltage > 12.4 && voltage < 13.8) {
      return {
        status: 'UNDERCHARGING',
        badgeColor: 'bg-yellow-600 text-white',
        border: 'border-yellow-500',
        textColor: 'text-yellow-400',
        summary: `MARGINAL: System at ${voltage.toFixed(1)}V - Inadequate excitation or high resistance loop on B+ cable.`,
        cause: 'Partial diode bridge failure, glazed/slipping 5PK serpentine belt, or oxidized B+ lug connection. Cannot sustain A/C load.',
        action: 'Check belt deflection (must be 5-10mm under 98N thumb load) and inspect clean copper grounding at chassis.'
      };
    } else if (voltage >= 13.8 && voltage <= 14.6) {
      return {
        status: 'NOMINAL PASS',
        badgeColor: 'bg-emerald-600 text-white',
        border: 'border-emerald-500',
        textColor: 'text-emerald-400',
        summary: `PASS: System at ${voltage.toFixed(1)}V - Live regulated charging output across 4-pin ECU loop.`,
        cause: 'Rotor field excitation, Gauss IC regulator, and 8-diode bridge operating strictly within Honda factory GD1 specifications.',
        action: 'System healthy. Verify terminal torque: B+ nut to 8 N·m, lower pivot bolt to 45 N·m.'
      };
    } else {
      return {
        status: 'HAZARD OVERCHARGE',
        badgeColor: 'bg-red-700 text-white animate-pulse',
        border: 'border-red-500',
        textColor: 'text-red-400',
        summary: `HAZARD: System at ${voltage.toFixed(1)}V - Extreme overvoltage! Risk of ECU and battery cell boil-off.`,
        cause: 'Shorted internal voltage regulator power transistor causing uninhibited rotor saturation. B+ unregulated.',
        action: 'SHUT DOWN ENGINE IMMEDIATELY. Continued operation will blow ECU fuses and boil battery electrolyte fluid.'
      };
    }
  }, [voltage]);

  // 4-Pin Receptacle Data
  const pinDetailsMap: Record<string, PinData> = {
    ig: {
      badge: 'TERMINAL IG',
      name: 'Ignition Switched Power (+12V)',
      wireColor: 'BLK / YEL TRACER',
      description: 'Provides 12V key-on switched excitation power to energize the internal IC regulator circuitry and field coil transistors.',
      hookup: 'Connect 12V (+) jumper lead from test battery directly to Pin IG to wake internal regulator IC before spinning.',
      reading: 'Key-on: 12.0V - 12.6V battery voltage. Regulates charging loop up to 14.2V when driven.',
      tip: 'During bench testing, jumpering IG without spin will draw ~0.2A - 0.4A standby quiescent current.'
    },
    c: {
      badge: 'TERMINAL C',
      name: 'Computer Field Control (ECU)',
      wireColor: 'WHITE / GREEN TRACER',
      description: 'Carries a PWM (Pulse Width Modulation) command signal from Honda PWA ECU to command low or high charging duty modes.',
      hookup: 'Leave disconnected during standard DIY drill bench tests (internally defaults to normal 14V charging).',
      reading: '0V to 5V variable duty pulse from ECM. Floats high to ~12V internal pull-up when unplugged.',
      tip: 'Grounding Pin C manually drops regulator output to low-mode (~12.5V) to reduce engine drag during hard acceleration.'
    },
    fr: {
      badge: 'TERMINAL FR',
      name: 'Field Return (Monitor Feedback)',
      wireColor: 'WHITE / RED TRACER',
      description: 'Feeds real-time alternator electrical load data back to the GD1 ECU to adjust Idle Air Control Valve (IACV) compensation.',
      hookup: 'Leave floating for drill test or attach oscilloscope to verify frequency modulation.',
      reading: 'Square wave frequency signal proportional to rotor field duty cycle (0% to 100%).',
      tip: 'NEVER connect battery positive directly to FR without a 1k-ohm resistor! FR is a low-power digital transistor output.'
    },
    l: {
      badge: 'TERMINAL L',
      name: 'Charge Indicator Lamp Driver',
      wireColor: 'WHITE / BLUE TRACER',
      description: 'Controls the instrument cluster battery warning icon on the dashboard by providing a switched ground path.',
      hookup: 'Connect to 12V (+) through a 12V 3W test lamp bulb or 500-ohm resistor. (DO NOT connect directly to +12V without load).',
      reading: '0.8V to 1.5V when stationary (Lamp ON). Jumps to 13.8V - 14.2V when rotor spins (Lamp turns OFF).',
      tip: 'If your test light stays glowing bright while the drill spins at 2,000 RPM, the diode trio or regulator is blown.'
    }
  };

  // Toggle step helper
  const toggleStepA = (step: number) => {
    setCompletedStepsA(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const toggleStepB = (step: number) => {
    setCompletedStepsB(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const toggleTool = (idx: number) => {
    setCheckedTools(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleLimp = (idx: number) => {
    setLimpSteps(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-[#0D1117] text-[#DFE2EB]'
        : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      {/* 1. STICKY DUAL-ENVIRONMENT HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
        theme === 'dark'
          ? 'bg-[#10141A]/90 border-[#30363D]'
          : 'bg-white/90 border-[#CBD5E1] shadow-sm'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Branding & Vehicle Status */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="bg-[#E60012] text-white px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider shrink-0 shadow-sm">
                TYPE R
              </span>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
                    FIT-SPEC
                  </span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 font-bold border border-red-500/30 flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span className="truncate">STRANDED: ANIMAL HOUSE</span>
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#4CD7F6] truncate">
                  GD1 • 1.3L L13A i-DSI • RHD JDM • George Town, Grand Cayman
                </div>
              </div>
            </div>

            {/* Right: Controls & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Print / PDF Button */}
              <button
                type="button"
                onClick={() => window.print()}
                title="Print Technical Field Dossier (PDF)"
                className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
                  theme === 'dark'
                    ? 'border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-white hover:border-[#4CD7F6]'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>

              {/* View All / Tabbed Toggle */}
              <button
                type="button"
                onClick={() => setViewAllDossier(!viewAllDossier)}
                title="Toggle between single tab and complete continuous dossier"
                className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
                  viewAllDossier
                    ? 'border-[#06B6D4] bg-[#06B6D4]/15 text-[#06B6D4] font-bold'
                    : theme === 'dark'
                    ? 'border-[#30363D] bg-[#161B22] text-[#8B949E] hover:text-white'
                    : 'border-[#CBD5E1] bg-white text-[#475569]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden md:inline">{viewAllDossier ? 'Full Dossier' : 'Tabbed'}</span>
              </button>

              {/* Dark / Light Mode Switch */}
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Sunlight and Workshop Mode"
                className={`p-2 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? 'border-[#30363D] bg-[#161B22] text-amber-400 hover:bg-[#21262D]'
                    : 'border-[#CBD5E1] bg-white text-slate-800 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Jump Pills for Fast Switching */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-1 text-xs font-mono">
            {[
              { id: 'triage', label: '1. Triage', icon: Zap },
              { id: 'parts', label: '2. Parts', icon: Cpu },
              { id: 'removal', label: '3. Removal', icon: Wrench },
              { id: 'bench', label: '4. Bench Test', icon: Sliders },
              { id: 'logistics', label: '5. George Town', icon: MapPin },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as SectionTab);
                    if (viewAllDossier) {
                      const el = document.getElementById(`section-${tab.id}`);
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0 transition-all font-semibold ${
                    isSelected
                      ? 'bg-[#06B6D4] text-slate-950 shadow-sm'
                      : theme === 'dark'
                      ? 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#30363D]'
                      : 'bg-white text-[#475569] hover:text-black border border-[#CBD5E1]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-8">
        
        {/* VEHICLE IDENTIFIER CARD */}
        <section className={`rounded-xl border p-4 sm:p-5 relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-[#161B22] border-[#30363D]'
            : 'bg-white border-[#CBD5E1] shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-[#E60012] text-white text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                  GD1 CHASSIS
                </span>
                <span className="text-xs font-mono text-[#06B6D4] font-semibold">
                  RHD • 1.3L L13A i-DSI • 8-VALVE TWIN-SPARK
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                2002 JDM Honda Fit Field Dossier
              </h1>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                Emergency Alternator Charging System Triage &amp; Rapid Replacement Protocol
              </p>
            </div>

            {/* Vehicle Outline Silhouette Graphic */}
            <div className={`w-36 h-16 sm:w-44 sm:h-20 rounded-lg border flex items-center justify-center p-1.5 shrink-0 ${
              theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
            }`}>
              <svg viewBox="0 0 200 90" className="w-full h-full" fill="none" stroke="currentColor">
                {/* Clean technical wireframe of Honda Fit GD1 */}
                <path
                  d="M10 65 L28 65 M56 65 L144 65 M172 65 L190 65"
                  strokeWidth="2.5"
                  className="stroke-[#06B6D4]"
                />
                {/* Wheels */}
                <circle cx="42" cy="65" r="14" strokeWidth="2.5" className="stroke-[#06B6D4]" />
                <circle cx="42" cy="65" r="6" strokeWidth="1.5" className="stroke-red-500" />
                <circle cx="158" cy="65" r="14" strokeWidth="2.5" className="stroke-[#06B6D4]" />
                <circle cx="158" cy="65" r="6" strokeWidth="1.5" className="stroke-red-500" />
                {/* GD1 body outline */}
                <path
                  d="M12 60 L18 52 C24 44, 40 40, 56 36 L100 18 C115 15, 135 15, 160 22 C178 28, 185 45, 188 60"
                  strokeWidth="2"
                  className={theme === 'dark' ? 'stroke-white' : 'stroke-slate-900'}
                />
                {/* Greenhouse & Windows */}
                <path
                  d="M62 36 L98 22 C110 20, 130 20, 150 25 L156 38 L62 38 Z"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                  className="stroke-[#4CD7F6]"
                />
                <text x="75" y="78" fill="currentColor" className="text-[8px] font-mono font-bold fill-[#8B949E]">
                  GD1-1002941
                </text>
              </svg>
            </div>
          </div>
        </section>

        {/* SECTION 1: TRIAGE & MULTIMETER SIMULATOR */}
        {(viewAllDossier || activeTab === 'triage') && (
          <div id="section-triage" className="space-y-6">
            {/* Stranded Emergency Incident Banner */}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
                    INCIDENT REPORT // GRAND CAYMAN
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 text-[#4CD7F6]">
                    LAT 19.3015° N • LON 81.3789° W
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold">
                  Stranded: Animal House Lot (North Sound Rd, George Town)
                </h2>
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-700'}`}>
                  0.0V regulated alternator output detected. Stranded alongside North Sound Rd next to Parker&apos;s Cayman. Battery surface charge rapidly depleting. Requires verified bench triage and direct replacement.
                </p>
              </div>
            </div>

            {/* DIGITAL MULTIMETER (DMM) SIMULATOR */}
            <div className={`rounded-xl border p-4 sm:p-6 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-md'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-inherit">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#06B6D4]/15 text-[#06B6D4]">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#06B6D4] font-bold block">
                      DMM TELEMETRY BENCH
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">Digital Multimeter Simulator</h3>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE BENCH
                </span>
              </div>

              {/* State Presets */}
              <div className="grid grid-cols-3 gap-2 my-4">
                {[
                  { id: 'resting', label: 'Resting Bat (Off)', v: 12.1 },
                  { id: 'idling', label: 'Engine Idling', v: 14.1 },
                  { id: 'jumpers', label: 'Jump Removed', v: 11.8 },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSimPreset(item.id as SimState)}
                    className={`py-2 px-2 text-center rounded-lg text-xs font-mono font-bold transition-all ${
                      simState === item.id
                        ? 'bg-[#06B6D4] text-slate-950 shadow-sm'
                        : theme === 'dark'
                        ? 'bg-[#21262D] text-[#8B949E] hover:text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* LCD Multimeter Display */}
              <div className={`rounded-xl p-5 sm:p-6 my-4 border flex flex-col items-center justify-center relative overflow-hidden ${
                theme === 'dark' ? 'bg-[#0A0E14] border-[#30363D]' : 'bg-slate-900 border-slate-700 text-white'
              }`}>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8B949E] mb-1">
                  DC VOLTAGE // TERMINAL B+ TO GROUND
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${voltageEval.textColor}`}>
                    {voltage.toFixed(1)}
                  </span>
                  <span className="text-xl font-mono text-[#8B949E] font-bold">VDC</span>
                </div>

                {/* Slider */}
                <div className="w-full max-w-md mt-5 space-y-1.5">
                  <input
                    type="range"
                    min="10.0"
                    max="15.5"
                    step="0.1"
                    value={voltage}
                    onChange={e => {
                      setVoltage(parseFloat(e.target.value));
                      setSimState('jumpers');
                    }}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#8B949E] px-1">
                    <span>10.0V (Depleted)</span>
                    <span className="text-amber-400">11.8V (Warning)</span>
                    <span className="text-emerald-400">13.8V - 14.6V (Nominal)</span>
                    <span className="text-red-400">15.0V+ (Overvolt)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Verdict Banner */}
              <div className={`rounded-lg p-3.5 border ${voltageEval.border} ${
                theme === 'dark' ? 'bg-[#10141A]' : 'bg-slate-50'
              } flex items-start gap-3`}>
                <div className="mt-0.5 shrink-0">
                  {voltage >= 13.8 && voltage <= 14.6 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : voltage < 11.8 || voltage > 14.8 ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${voltageEval.badgeColor}`}>
                      {voltageEval.status}
                    </span>
                    <span className="text-xs font-mono text-[#8B949E]">
                      {voltage < 12.4 ? 'CHARGING COLLAPSE' : voltage > 14.8 ? 'REGULATOR SHORT' : 'REGULATED'}
                    </span>
                  </div>
                  <p className="text-sm font-bold font-mono text-inherit">
                    {voltageEval.summary}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    <strong>Mechanic Assessment:</strong> {voltageEval.cause}
                  </p>
                  <p className="text-xs text-[#06B6D4] font-mono">
                    <strong>Immediate Directive:</strong> {voltageEval.action}
                  </p>
                </div>
              </div>

              {/* Quick Jump Action */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('parts');
                    const el = document.getElementById('section-parts');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#06B6D4] text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 hover:bg-[#4CD7F6] transition-all"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Cross-Reference Replacement Units (OE A5TB0091)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* VOLTAGE BENCHMARK THRESHOLDS */}
            <div className={`rounded-xl border p-4 sm:p-5 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#8B949E]">
                  HONDA GD1 FACTORY VOLTAGE SPECIFICATIONS
                </h4>
                <span className="text-[11px] font-mono text-[#4CD7F6]">TEST SPEC: SAE J56</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className={`p-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-red-500/30' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="text-xs font-mono font-bold text-red-500 flex items-center justify-between">
                    <span>&lt; 12.4V</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20">CRITICAL FAIL</span>
                  </div>
                  <div className="text-xs font-bold mt-1">Discharging Reserve</div>
                  <div className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Alternator dead. EPS safety cut-off triggers below 10.5V.
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="text-xs font-mono font-bold text-emerald-500 flex items-center justify-between">
                    <span>13.8V – 14.5V</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20">NOMINAL PASS</span>
                  </div>
                  <div className="text-xs font-bold mt-1">Normal Charging</div>
                  <div className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Healthy diode trio and internal Gauss GA225-14V IC regulation.
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-amber-500/30' : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="text-xs font-mono font-bold text-amber-500 flex items-center justify-between">
                    <span>&gt; 14.8V</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20">OVERCHARGE</span>
                  </div>
                  <div className="text-xs font-bold mt-1">Regulator Short</div>
                  <div className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Transistor saturated full-field. Boils battery acid; disconnect.
                  </div>
                </div>
              </div>
            </div>

            {/* BREAKDOWN FAILURE CASCADE TIMELINE */}
            <div className={`rounded-xl border p-4 sm:p-6 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base sm:text-lg">
                    Failure Cascade Timeline (Animal House Incident)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  CRITICAL CASCADE PATH
                </span>
              </div>

              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-inherit pl-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-inherit" />
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-500 font-bold">PHASE 01: INITIAL DEGRADATION</span>
                    <span className="text-[#8B949E]">T-48h</span>
                  </div>
                  <h4 className="text-sm font-bold mt-0.5">Brush Contact Bounce &amp; Slip Ring Sparking</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Intermittent dash battery icon flicker during bumps. Carbon brushes eroded (&lt;2mm); spring tension insufficient to keep continuous slip ring contact at high engine RPM.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-inherit" />
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-500 font-bold">PHASE 02: EXCITATION COLLAPSE</span>
                    <span className="text-[#8B949E]">T-3h</span>
                  </div>
                  <h4 className="text-sm font-bold mt-0.5">Idle Surge &amp; IACV Hunting</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Headlight pulsation at stoplights. GD1 ECU Idle Air Control Valve (IACV) hunts up to 1,100 RPM attempting to spin alternator above cut-in speed, masking progressive field failure.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-red-500 ring-4 ring-inherit" />
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-red-500 font-bold">PHASE 03: ELECTRICAL COLLAPSE</span>
                    <span className="text-[#8B949E]">T-15min</span>
                  </div>
                  <h4 className="text-sm font-bold mt-0.5">High-Amp Load Trigger (Cabin Blower 4 @ 25A)</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Caribbean midday heat: A/C button pressed and cabin blower knob turned to Speed 4 (~25-Amp thermal resistor circuit draw). Battery voltage collapsed under 10.5V. Electric Power Steering (EPS) computer shut down, instrument cluster &apos;D&apos; indicator blinked.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-red-600 ring-4 ring-inherit" />
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-red-600 font-bold">PHASE 04: IMMOBILIZATION</span>
                    <span className="text-[#8B949E]">T-0 (CURRENT)</span>
                  </div>
                  <h4 className="text-sm font-bold mt-0.5">Engine Stall &amp; Starter Rapid Click</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Total battery reserve exhaustion in Animal House parking lot. L13A dual-spark i-DSI ignition coils starved of voltage, triggering engine cutoff. Starter solenoid clicks rapidly with 10.4V resting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PARTS INTERCHANGE & SOURCING */}
        {(viewAllDossier || activeTab === 'parts') && (
          <div id="section-parts" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#06B6D4] font-bold">
                  CROSS-REFERENCE // FIT GD1 L13A
                </span>
                <h2 className="text-xl font-black tracking-tight">Parts Interchange &amp; Sourcing Matrix</h2>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1 w-fit">
                <Check className="w-3.5 h-3.5" /> 5 VERIFIED FITMENTS
              </span>
            </div>

            {/* CRITICAL REPAIR WARNING: SOLDERED REGULATOR */}
            <div className="rounded-xl bg-red-500/15 border-2 border-red-500/60 p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-red-600 text-white shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                    CRITICAL FIELD CONSTRAINT: HARD-SOLDERED REGULATOR
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-inherit">
                    Roadside Brush / Regulator Swap is NOT DIY-Feasible
                  </h3>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-700'}`}>
                    The internal voltage regulator (<code className="font-mono font-bold text-inherit">Gauss GA225-14V / Honda 31150-PWA-004</code>) is factory-soldered with heavy lead pins directly to the 8-diode rectifier bridge. Replacing brushes or regulator alone requires a high-wattage workshop desoldering gun and bench dismantling. <strong>A complete tested assembly replacement is mandatory for field recovery.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Click-to-Copy Master Part Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  key: 'honda-oem',
                  title: 'HONDA GENUINE OEM',
                  partNo: '31100-PWA-004',
                  subtitle: 'First-gen factory fitment (2001-2005)',
                  badge: 'Direct JDM GD1',
                  color: 'text-[#4CD7F6]',
                  spec: 'L13A / L15A 1.3L-1.5L JDM production'
                },
                {
                  key: 'mitsubishi-oe',
                  title: 'MITSUBISHI FACTORY OE',
                  partNo: 'A5TB0091',
                  altNo: 'AHGA56',
                  subtitle: 'Body-stamped code on stator barrel',
                  badge: 'Original Manufacturer',
                  color: 'text-emerald-400',
                  spec: '12V 80A 5-Groove Serpentine CW rotation'
                },
                {
                  key: 'lester-aftermarket',
                  title: 'UNIVERSAL AFTERMARKET',
                  partNo: '11177N',
                  subtitle: 'Lester / NAPA North American catalog',
                  badge: 'Standard Catalog',
                  color: 'text-amber-400',
                  spec: 'Direct replacement unit for GD1 / GD3 chassis'
                },
                {
                  key: 'facelift-oem',
                  title: 'LATE FACELIFT OEM',
                  partNo: '31100-RSH-004',
                  altNo: 'A5TB1391',
                  subtitle: 'Facelift GD1/GD2 (2005-2008)',
                  badge: 'Direct Bolt-In',
                  color: 'text-cyan-400',
                  spec: '100% backward-compatible bolt pattern & plug'
                },
                {
                  key: 'gauss-reg',
                  title: 'INTERNAL VOLTAGE REGULATOR',
                  partNo: 'GA225-14V',
                  altNo: 'Gauss 220910',
                  subtitle: 'Soldered internal IC regulator unit',
                  badge: 'Bench Rebuild Only',
                  color: 'text-red-400',
                  spec: 'Requires 80W soldering iron & desolder wick'
                }
              ].map(part => {
                const isCopied = copiedKey === part.key;
                return (
                  <div
                    key={part.key}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[#8B949E]">{part.title}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-[#4CD7F6]">
                          {part.badge}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${part.color}`}>
                          {part.partNo}
                        </span>
                        {part.altNo && (
                          <span className="text-xs font-mono font-bold text-[#8B949E]">
                            / {part.altNo}
                          </span>
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                        {part.subtitle}
                      </div>
                      <div className="text-[11px] font-mono text-[#06B6D4] mt-2">
                        {part.spec}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#8B949E]">Click to copy part #</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(part.partNo, part.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : theme === 'dark'
                            ? 'bg-[#21262D] text-[#DFE2EB] hover:bg-[#30363D]'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied!' : 'Copy #'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PHYSICAL SPECS & BENCHMARK VERIFICATION */}
            <div className={`rounded-xl border p-4 sm:p-5 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#06B6D4]" />
                  <span>Physical &amp; Electrical Architecture (GD1 OEM Specs)</span>
                </h3>
                <span className="text-xs font-mono text-[#8B949E]">ISO 8854 STD</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-slate-50'}`}>
                  <span className="text-[#8B949E] block text-[10px]">RATED OUTPUT</span>
                  <span className="text-emerald-400 font-bold text-base">80 Amps</span>
                  <span className="text-[10px] text-[#8B949E] block">Peak @ 6,000 RPM</span>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-slate-50'}`}>
                  <span className="text-[#8B949E] block text-[10px]">PULLEY PROFILE</span>
                  <span className="text-[#06B6D4] font-bold text-base">5-Groove</span>
                  <span className="text-[10px] text-[#8B949E] block">5PK Serpentine Belt</span>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-slate-50'}`}>
                  <span className="text-[#8B949E] block text-[10px]">ROTATION</span>
                  <span className="text-amber-400 font-bold text-base">Clockwise</span>
                  <span className="text-[10px] text-[#8B949E] block">Viewed from nose</span>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-slate-50'}`}>
                  <span className="text-[#8B949E] block text-[10px]">PLUG STYLE</span>
                  <span className="text-cyan-400 font-bold text-base">4-Pin Oval</span>
                  <span className="text-[10px] text-[#8B949E] block">Green waterproof lock</span>
                </div>
              </div>

              {/* Bench Verification Output Benchmark Bar */}
              <div className="mt-4 pt-4 border-t border-inherit space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Cold Curb Idle (1,500 RPM) Output:</span>
                  <span className="font-bold text-emerald-400">32A @ 13.5V (Nominal)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#06B6D4] w-[40%]" />
                </div>
                <div className="flex justify-between text-xs font-mono pt-1">
                  <span>Hot High-Rev (6,000 RPM) Full Field:</span>
                  <span className="font-bold text-emerald-400">82A @ 14.2V (Nominal)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[100%]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: STEP-BY-STEP REMOVAL PROCEDURES */}
        {(viewAllDossier || activeTab === 'removal') && (
          <div id="section-removal" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#06B6D4] font-bold">
                  MECHANICAL EXTRACTION PROTOCOL
                </span>
                <h2 className="text-xl font-black tracking-tight">Step-by-Step Removal Procedures</h2>
              </div>

              {/* Method Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg border bg-inherit">
                <button
                  type="button"
                  onClick={() => setRemovalMethod('A')}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    removalMethod === 'A'
                      ? 'bg-[#06B6D4] text-slate-950 shadow-sm'
                      : 'text-[#8B949E] hover:text-white'
                  }`}
                >
                  <span>Method A (Bumper/Rad Tilt)</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 text-white font-bold">PRO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRemovalMethod('B')}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                    removalMethod === 'B'
                      ? 'bg-[#06B6D4] text-slate-950 shadow-sm'
                      : 'text-[#8B949E] hover:text-white'
                  }`}
                >
                  <span>Method B (Intake Plenum)</span>
                </button>
              </div>
            </div>

            {/* MANDATORY TOOLKIT CHECKLIST */}
            <div className={`rounded-xl border p-4 sm:p-5 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#06B6D4]" />
                  <h3 className="font-bold text-sm">Mandatory Tooling Checklist</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckedTools([])}
                  className="text-[11px] font-mono text-[#8B949E] hover:text-[#06B6D4]"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 1, name: '10mm Socket & Box Wrench', purpose: 'Battery ground clamp & B+ stud wire nut' },
                  { id: 2, name: '12mm Deep & Shallow Sockets', purpose: 'Upper adjuster slider bolt & lower 12mm pivot' },
                  { id: 3, name: '14mm Box Wrench / Breaker Bar', purpose: 'Aux belt tensioner release & pivot leverage' },
                  { id: 4, name: '6-Inch 3/8" Drive Socket Extension', purpose: 'MANDATORY for lower pivot bolt access over oil filter', alert: true },
                  { id: 5, name: 'Pry Bar or Heavy Flathead', purpose: 'Overcoming tight factory bushing press fit' },
                  { id: 6, name: 'Bumper Clip Pry Tool / Phillips #2', purpose: 'Fascia clips and fender liner screws' },
                ].map(tool => {
                  const isChecked = checkedTools.includes(tool.id);
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : tool.alert
                          ? 'border-red-500/40 bg-red-500/5 text-inherit'
                          : theme === 'dark'
                          ? 'border-[#30363D] bg-[#0D1117] text-inherit'
                          : 'border-[#CBD5E1] bg-slate-50 text-inherit'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-500'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{tool.name}</span>
                          {tool.alert && (
                            <span className="text-[10px] font-bold text-red-500 bg-red-500/20 px-1 py-0.2 rounded">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <div className={`text-[11px] truncate ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                          {tool.purpose}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CRITICAL LOWER BOLT CALLOUT */}
            <div className="rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/40 p-4 sm:p-5 flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-[#06B6D4] text-slate-950 shrink-0 mt-0.5">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#06B6D4]">
                    PRO MECHANIC WARNING // BLIND ACCESS
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-white font-bold">
                    REAR OIL FILTER APERTURE
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold">
                  The Hidden Lower 12mm Pivot Bolt (45 N·m / 33 lb-ft)
                </h3>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-700'}`}>
                  Do NOT attempt to unbolt the lower pivot bolt from the top of the engine bay! Reach from directly underneath the vehicle, locating the aperture immediately above the spin-on oil filter casing. Use a 12mm socket paired with a <strong>6-inch extension</strong>. Push socket straight in, loosen the 45 N·m torque, and withdraw the long shoulder bolt.
                </p>
              </div>
            </div>

            {/* METHOD A: BUMPER & RAD TILT (PRO RECOMMENDED) */}
            {removalMethod === 'A' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      RECOMMENDED // 45 MIN TIME BUDGET
                    </span>
                    <span className="text-xs font-mono text-[#8B949E]">
                      Leaves A/C pressurized and coolant loop intact
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#06B6D4] font-bold">
                    {completedStepsA.length} / 7 Steps Completed
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      step: 1,
                      title: 'Disconnect Battery Negative Terminal',
                      detail: 'Loosen 10mm ground clamp bolt and wrap terminal in clean rag. Eliminates direct dead short risk and protects 90A fusible link at the live alternator B+ stud.',
                      tool: '10mm wrench',
                      warning: 'MANDATORY FIRST STEP'
                    },
                    {
                      step: 2,
                      title: 'Remove Front Bumper Fascia',
                      detail: 'Extract 4 upper grille push clips, 2 inner fender liner screws (8mm/Phillips), and 6 bottom splash tray clips. Pop the fascia edges free from fender tabs and unplug fog lamp harness if equipped.',
                      tool: 'Clip tool, 8mm socket'
                    },
                    {
                      step: 3,
                      title: 'Tilt Radiator Core Forward (2 to 3 Inches)',
                      detail: 'Unbolt 2 top radiator upper bracket clamps (10mm) and 2 AC condenser bracket bolts. Carefully tilt the entire assembly forward. DO NOT disconnect rubber radiator hoses or evacuate A/C refrigerant.',
                      tool: '10mm socket',
                      highlight: 'Leaves refrigerant and coolant intact!'
                    },
                    {
                      step: 4,
                      title: 'Disconnect Alternator Electrical Connections',
                      detail: 'Peel black rubber boot off B+ terminal, extract 10mm nut and ring terminal. Depress thumb latch on rear green 4-pin harness connector [IG-C-FR-L] and pull straight out. Unclip wiring loom anchor.',
                      tool: '10mm socket'
                    },
                    {
                      step: 5,
                      title: 'Relieve Belt Tension & Remove Upper Slider Bracket',
                      detail: 'Loosen upper 12mm adjustment slider bolt, back off long tensioner screw, rotate alternator toward cylinder block, and slip 5PK serpentine belt off pulley. Unbolt upper bracket completely.',
                      tool: '12mm wrench'
                    },
                    {
                      step: 6,
                      title: 'Extract Lower 12mm Pivot Bolt from Underneath',
                      detail: 'Reaching from below directly above the oil filter, slide 6-inch extension onto the long lower pivot bolt head. Break loose (45 N·m), thread out fully, and pull the long shoulder bolt out.',
                      tool: '12mm socket + 6" extension',
                      critical: true
                    },
                    {
                      step: 7,
                      title: 'Rotate and Extract Forward Through Radiator Gap',
                      detail: 'Lever alternator with a pry bar to overcome the tight rear friction bushing. Rotate alternator pulley-side up and slide straight forward through the clearance opening created by the tilted radiator.',
                      tool: 'Pry bar',
                      highlight: 'Extraction complete! Ready for bench inspection.'
                    }
                  ].map(item => {
                    const isDone = completedStepsA.includes(item.step);
                    return (
                      <div
                        key={item.step}
                        onClick={() => toggleStepA(item.step)}
                        className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                          isDone
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : theme === 'dark'
                            ? 'border-[#30363D] bg-[#161B22] hover:border-[#06B6D4]'
                            : 'border-[#CBD5E1] bg-white hover:border-[#06B6D4] shadow-sm'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : item.critical
                            ? 'bg-red-500 text-white'
                            : theme === 'dark'
                            ? 'bg-[#21262D] text-[#06B6D4]'
                            : 'bg-slate-200 text-slate-800'
                        }`}>
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.step}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-bold ${isDone ? 'line-through text-[#8B949E]' : 'text-inherit'}`}>
                              {item.title}
                            </span>
                            {item.warning && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                                {item.warning}
                              </span>
                            )}
                            {item.highlight && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                {item.highlight}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs leading-relaxed ${isDone ? 'line-through opacity-60' : theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                            {item.detail}
                          </p>
                          <div className="text-[11px] font-mono text-[#06B6D4] flex items-center gap-2">
                            <span>TOOL: {item.tool}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* METHOD B: TOP INTAKE MANIFOLD / EGR STUDS (ALTERNATIVE) */}
            {removalMethod === 'B' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ALTERNATIVE // ~2.5 HRS TIME BUDGET
                  </span>
                  <span className="text-xs font-mono text-[#06B6D4] font-bold">
                    {completedStepsB.length} / 5 Steps Completed
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                  <strong>Notice:</strong> Use Method B only if front bumper screws/clips are rusted solid or after-market front aero prevents bumper skin removal.
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      step: 1,
                      title: 'Disconnect Battery Negative & Air Cleaner Box',
                      detail: 'Remove 10mm ground clamp. Unclip air filter housing, loosen throttle body intake hose clamp, disconnect IAT sensor.',
                      tool: '10mm socket, flathead'
                    },
                    {
                      step: 2,
                      title: 'Disassemble Upper Plastic Intake Chamber',
                      detail: 'Unbolt 5x 10mm bolts and 2x 10mm nuts securing upper intake plenum to cylinder head. Unhook vacuum lines and throttle cable.',
                      tool: '10mm deep socket'
                    },
                    {
                      step: 3,
                      title: 'Remove Metal EGR Pipe & Studs',
                      detail: 'Unbolt 2x 12mm bolts on EGR pipe. Use a double-nut technique (threading two M8 nuts tightly together) to extract the lower manifold mounting studs to gain vertical clearance.',
                      tool: '12mm wrench, dual M8 nuts'
                    },
                    {
                      step: 4,
                      title: 'Unbolt Alternator Upper & Lower Mounts',
                      detail: 'Loosen tensioner, slip 5PK serpentine belt. Extract lower 12mm pivot bolt from underneath over oil filter.',
                      tool: '12mm socket + 6" extension'
                    },
                    {
                      step: 5,
                      title: 'Lift Alternator Vertically Out of Engine Bay',
                      detail: 'Wiggle alternator upward through the cavity between engine valve cover and firewall bulkhead. Take care not to pinch brake master cylinder lines.',
                      tool: 'Gloves / careful lift'
                    }
                  ].map(item => {
                    const isDone = completedStepsB.includes(item.step);
                    return (
                      <div
                        key={item.step}
                        onClick={() => toggleStepB(item.step)}
                        className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                          isDone
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : theme === 'dark'
                            ? 'border-[#30363D] bg-[#161B22]'
                            : 'border-[#CBD5E1] bg-white shadow-sm'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                          isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-white'
                        }`}>
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.step}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <span className={`text-sm font-bold block ${isDone ? 'line-through text-[#8B949E]' : 'text-inherit'}`}>
                            {item.title}
                          </span>
                          <p className={`text-xs ${isDone ? 'line-through opacity-60' : theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                            {item.detail}
                          </p>
                          <span className="text-[11px] font-mono text-[#06B6D4]">TOOL: {item.tool}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FACTORY TORQUE SPECIFICATIONS TABLE */}
            <div className={`rounded-xl border p-4 sm:p-5 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#8B949E]">
                  HONDA OEM REASSEMBLY TORQUE SPECIFICATIONS
                </span>
                <span className="text-[11px] font-mono text-[#06B6D4]">GD1 FACTORY SERVICE MANUAL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div>
                    <span className="font-bold block text-sm">Lower 12mm Pivot Bolt</span>
                    <span className="text-[11px] text-[#8B949E]">Long shoulder bolt into engine lug</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-base block">45 N·m</span>
                    <span className="text-[10px] text-[#8B949E]">33 lb-ft</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div>
                    <span className="font-bold block text-sm">Upper Slider Bolt</span>
                    <span className="text-[11px] text-[#8B949E]">12mm adjustment tensioner bracket</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-base block">22 N·m</span>
                    <span className="text-[10px] text-[#8B949E]">16 lb-ft</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div>
                    <span className="font-bold block text-sm text-amber-400">B+ Terminal Nut</span>
                    <span className="text-[11px] text-[#8B949E]">DO NOT OVERTIGHTEN (Brittle insulator)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold text-base block">8.0 N·m</span>
                    <span className="text-[10px] text-[#8B949E]">71 lb-in (6 lb-ft)</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div>
                    <span className="font-bold block text-sm">Serpentine Belt Deflection</span>
                    <span className="text-[11px] text-[#8B949E]">98 N (22 lb) thumb press mid-span</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#06B6D4] font-bold text-base block">5 – 10 mm</span>
                    <span className="text-[10px] text-[#8B949E]">Used belt: 7–11 mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: 4-PIN HARNESS & DRILL BENCH TEST */}
        {(viewAllDossier || activeTab === 'bench') && (
          <div id="section-bench" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#06B6D4] font-bold">
                  DIAGNOSTIC TEST BENCH // PINOUT VISUALIZER
                </span>
                <h2 className="text-xl font-black tracking-tight">4-Pin Green Plug &amp; DIY Drill Rig</h2>
              </div>
              <span className="text-xs font-mono bg-[#06B6D4]/10 text-[#06B6D4] px-2 py-1 rounded border border-[#06B6D4]/20 w-fit">
                MITSUBISHI A-CIRCUIT SPEC
              </span>
            </div>

            {/* INTERACTIVE 2x2 CONNECTOR DIAGRAM */}
            <div className={`rounded-xl border p-4 sm:p-6 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold">Female Harness Socket (Face View)</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                    Looking directly into green oval connector on back of alternator (Locking notch TOP)
                  </p>
                </div>
                <span className="text-xs font-mono text-[#06B6D4] font-bold">TAP PIN TO INSPECT</span>
              </div>

              {/* Physical Oval Connector Chassis representation */}
              <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center my-2 max-w-sm mx-auto relative ${
                theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-100 border-slate-300'
              }`}>
                {/* Simulated Locking Tab on Top */}
                <div className="w-20 h-4 bg-emerald-600 rounded-t-lg -mt-8 mb-2 flex items-center justify-center shadow-md">
                  <span className="text-[9px] font-mono text-white font-bold tracking-tighter">LOCK TAB TOP</span>
                </div>

                {/* 2x2 Terminal Grid */}
                <div className="grid grid-cols-2 gap-4 w-full p-4 rounded-xl border-2 border-emerald-600 bg-emerald-950/20">
                  {[
                    { id: 'ig', label: 'IG', name: 'IGNITION (+12V)', pinCol: 'Top Left' },
                    { id: 'c', label: 'C', name: 'ECU CONTROL', pinCol: 'Top Right' },
                    { id: 'fr', label: 'FR', name: 'FIELD RETURN', pinCol: 'Bottom Left' },
                    { id: 'l', label: 'L', name: 'DASH LAMP', pinCol: 'Bottom Right' },
                  ].map(pin => {
                    const isSelected = selectedPin === pin.id;
                    return (
                      <button
                        key={pin.id}
                        type="button"
                        onClick={() => setSelectedPin(pin.id as 'ig' | 'c' | 'fr' | 'l')}
                        className={`h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all p-2 relative ${
                          isSelected
                            ? 'border-[#06B6D4] bg-[#06B6D4]/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.03]'
                            : theme === 'dark'
                            ? 'border-[#30363D] bg-[#161B22] text-[#8B949E] hover:border-slate-500'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span className={`text-2xl font-mono font-black ${
                          isSelected ? 'text-[#06B6D4]' : 'text-inherit'
                        }`}>
                          {pin.label}
                        </span>
                        <span className="text-[10px] font-mono font-bold truncate max-w-full">
                          {pin.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] font-mono text-[#8B949E] mt-3">
                  RHD GD1 HARNESS // MITSUBISHI #A005TA6391
                </div>
              </div>

              {/* Pin Inspection Drawer */}
              {selectedPin && (
                <div className={`mt-5 p-4 sm:p-5 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                } space-y-3`}>
                  <div className="flex items-center justify-between border-b border-inherit pb-2.5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#06B6D4] text-slate-950 text-xs font-mono font-bold px-2 py-0.5 rounded">
                        {pinDetailsMap[selectedPin].badge}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base">
                        {pinDetailsMap[selectedPin].name}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-black/30">
                      WIRE: {pinDetailsMap[selectedPin].wireColor}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-700'}`}>
                    {pinDetailsMap[selectedPin].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className={`p-3 rounded-lg border text-xs font-mono ${
                      theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1]'
                    }`}>
                      <span className="text-[#06B6D4] font-bold block mb-1">BENCH TEST HOOKUP:</span>
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}>
                        {pinDetailsMap[selectedPin].hookup}
                      </span>
                    </div>

                    <div className={`p-3 rounded-lg border text-xs font-mono ${
                      theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1]'
                    }`}>
                      <span className="text-emerald-400 font-bold block mb-1">DMM EXPECTED SIGNAL:</span>
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}>
                        {pinDetailsMap[selectedPin].reading}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-xs font-mono text-[#06B6D4] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pro Mechanic Tip:</strong> {pinDetailsMap[selectedPin].tip}</span>
                  </div>
                </div>
              )}
            </div>

            {/* DIY DRILL SPIN TEST RIG PROCEDURE & SCHEMATIC */}
            <div className={`rounded-xl border p-4 sm:p-6 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base sm:text-lg">DIY Drill Spin Test Rig Walkthrough</h3>
                </div>
                <span className="text-xs font-mono text-[#8B949E]">1,500+ RPM REQUIRED</span>
              </div>

              {/* ASCII Schematic Diagram */}
              <div className={`p-4 rounded-xl font-mono text-[11px] sm:text-xs overflow-x-auto border ${
                theme === 'dark' ? 'bg-[#0A0E14] border-[#30363D] text-[#06B6D4]' : 'bg-slate-900 border-slate-700 text-cyan-300'
              }`}>
                <pre className="leading-tight">
{`+-------------------------------------------------------------------------+
|                      BENCH TEST SCHEMATIC WIRING                        |
|                                                                         |
|  [ 12V TEST BATTERY ]                                                   |
|    (+) POSITIVE ------------+------------+---------------- (B+ STUD)    |
|                             |            |                              |
|                             | (500Ω)     |                              |
|                             v            v                              |
|                          [L PIN]      [IG PIN]                          |
|                                                                         |
|    (-) NEGATIVE                                                         |
|         |                                                               |
|         +------------------> [ HEAVY BENCH VICE ]                       |
|                                      ^                                  |
|                                      | Ground Contact                   |
|                             [ ALTERNATOR CASING ]                       |
|                                      |                                  |
|                                 (Pulley Nut)                            |
|                                      ^                                  |
|                                      | 24mm Socket                      |
|                             [ CORDED DRILL ] (Clockwise Spin >1500 RPM) |
+-------------------------------------------------------------------------+`}
                </pre>
              </div>

              {/* Step by Step Execution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className={`p-3.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div className="font-mono font-bold text-[#06B6D4] mb-1">STEP 1: SECURE IN VICE</div>
                  <p className={theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}>
                    Clamp alternator lower mounting lug firmly into heavy bench vice. Ensure metal-to-metal contact for ground return path.
                  </p>
                </div>

                <div className={`p-3.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div className="font-mono font-bold text-[#06B6D4] mb-1">STEP 2: WIRE EXCITATION LEADS</div>
                  <p className={theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}>
                    Connect 12V (+) to heavy B+ stud. Jumper 12V (+) to Pin IG. Wire a test light bulb between 12V (+) and Pin L.
                  </p>
                </div>

                <div className={`p-3.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div className="font-mono font-bold text-[#06B6D4] mb-1">STEP 3: CLOCKWISE DRILL ENGAGEMENT</div>
                  <p className={theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}>
                    Fit socket onto pulley nut. Set drill to <strong>FORWARD (Clockwise)</strong> direction. Accelerate smoothly past 1,500 RPM cut-in threshold.
                  </p>
                </div>

                <div className={`p-3.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div className="font-mono font-bold text-[#06B6D4] mb-1">STEP 4: MEASURE B+ VOLTAGE</div>
                  <p className={theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}>
                    Place red multimeter probe on B+ stud and black probe on alternator body. Observe live charging regulation.
                  </p>
                </div>
              </div>

              {/* Bench Pass/Fail Decision Matrix */}
              <div className="mt-5 space-y-2">
                <div className="text-xs font-mono font-bold text-[#8B949E] uppercase tracking-wider">
                  BENCH TEST VERDICT MATRIX
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <span className="font-bold text-emerald-400 block">PASS: 13.8V – 14.5V</span>
                    <span className="text-[11px] text-[#8B949E]">
                      Output jumps into regulation and test bulb extinguishes. Ready to install!
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <span className="font-bold text-red-400 block">FAIL: &le; 12.4V</span>
                    <span className="text-[11px] text-[#8B949E]">
                      Voltage stays at battery rest level. Worn brushes or blown rectifier diode.
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="font-bold text-amber-400 block">DANGER: &gt; 15.2V</span>
                    <span className="text-[11px] text-[#8B949E]">
                      Overvoltage run-away. Shorted internal regulator. Unit must be replaced.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: GEORGE TOWN DIRECTORY & NO-TOW LIMP PROTOCOL */}
        {(viewAllDossier || activeTab === 'logistics') && (
          <div id="section-logistics" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#06B6D4] font-bold">
                  LOCAL LOGISTICS // GEORGE TOWN, GRAND CAYMAN
                </span>
                <h2 className="text-xl font-black tracking-tight">Industrial Park Directory &amp; Limp Protocol</h2>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                SAVE CI$75 – CI$100 TOW FEE
              </span>
            </div>

            {/* STAGING LOCATION & EMERGENCY ROUTE */}
            <div className={`rounded-xl border p-4 sm:p-5 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-sm sm:text-base">Animal House Staging &amp; Industrial Corridor</h3>
                </div>
                <span className="text-xs font-mono text-[#06B6D4]">SECTOR: NORTH SOUND RD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono mb-4">
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-slate-50'}`}>
                  <span className="text-[#8B949E] block text-[10px]">CURRENT BREAKDOWN STAGING</span>
                  <span className="font-bold text-sm text-red-400">Animal House Lot</span>
                  <span className="text-[11px] text-[#8B949E] block">North Sound Rd, George Town</span>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-slate-50'}`}>
                  <span className="text-[#8B949E] block text-[10px]">WALK ACCESS (PARKER&apos;S)</span>
                  <span className="font-bold text-sm text-[#06B6D4]">&lt; 100m North</span>
                  <span className="text-[11px] text-[#8B949E] block">Walkable for multimeters &amp; tools</span>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-[#0D1117]' : 'bg-slate-50'}`}>
                  <span className="text-[#8B949E] block text-[10px]">INDUSTRIAL PARK CORRIDOR</span>
                  <span className="font-bold text-sm text-emerald-400">500m – 1.2km</span>
                  <span className="text-[11px] text-[#8B949E] block">Direct run via Seymour Dr</span>
                </div>
              </div>

              {/* EMERGENCY NO-TOW LIMP CHECKLIST */}
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BatteryCharging className="w-5 h-5 text-red-500" />
                    <h4 className="font-bold text-sm text-red-400 uppercase font-mono">
                      Emergency &quot;No-Tow&quot; 1.6km Limp Checklist
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                    5-10 MIN TRANSIT ONLY
                  </span>
                </div>

                <p className="text-xs text-red-200">
                  <strong>Critical Warning:</strong> If the cabin blower fan knob is left on Speed 4, it draws <strong>~25 Amps</strong> and will starve the i-DSI ignition coils, causing the engine to stall dead in traffic within 90 seconds!
                </p>

                <div className="space-y-2 text-xs font-mono">
                  {[
                    { id: 1, title: 'Blower Fan strictly on "0"', desc: 'Verify cabin HVAC fan dial physically clicks off (0). Eliminates 25-Amp thermal resistor circuit discharge.' },
                    { id: 2, title: 'Total Electrical Blackout', desc: 'Headlights OFF, stereo unit OFF, A/C push-button OFF, unplug 12V cigarette lighter adapters.' },
                    { id: 3, title: '15-Minute Donor Jump Saturation', desc: 'Hook booster cables to donor vehicle and run at 2,000 RPM for 15 full minutes before attempting departure to build reserve surface charge.' },
                    { id: 4, title: 'Continuous Momentum via Seymour Dr', desc: 'Pull out from Animal House, turn right onto Seymour Dr into Industrial Park. Avoid excessive idling at stop signs.' },
                  ].map(step => {
                    const isDone = limpSteps.includes(step.id);
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => toggleLimp(step.id)}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                          isDone
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-black/30 border-red-500/20 text-inherit hover:border-red-500/40'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isDone ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-500'
                        }`}>
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <span className={`font-bold block ${isDone ? 'line-through text-[#8B949E]' : 'text-inherit'}`}>
                            {step.title}
                          </span>
                          <span className={`text-[11px] ${isDone ? 'line-through opacity-60' : 'text-[#8B949E]'}`}>
                            {step.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* VERIFIED GEORGE TOWN INDUSTRIAL SUPPLIER CARDS */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base font-mono uppercase tracking-wider text-[#8B949E]">
                  VERIFIED LOCAL SUPPLIERS // ONE-TAP DIAL
                </h3>
                <span className="text-xs font-mono text-[#06B6D4]">4 HUBS GEO-TAGGED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Cartronics Auto Parts */}
                <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-[#E60012] text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                          #1 PICK FOR USED JDM
                        </span>
                        <h4 className="text-base font-black mt-1">Cartronics Auto Parts</h4>
                        <div className="text-xs font-mono text-[#06B6D4]">
                          20 Saturn Close (behind Saxon Ins)
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        CI$50 – $80
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                      Primary importer of Japanese Domestic Market front-cuts and engines. Carries tested OEM A5TB0091 alternator pulls for L13A / L15A.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-inherit flex gap-2">
                    <a
                      href="tel:+13459494446"
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500 transition-all shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call (345) 949-4446</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('+13459494446', 'phone-cartronics')}
                      className={`p-2 rounded-lg border text-xs font-mono ${
                        theme === 'dark' ? 'border-[#30363D] bg-[#21262D]' : 'border-[#CBD5E1] bg-slate-100'
                      }`}
                      title="Copy Number"
                    >
                      {copiedKey === 'phone-cartronics' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. Parker's Cayman */}
                <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-emerald-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                          &lt; 100M WALK FROM STAGING
                        </span>
                        <h4 className="text-base font-black mt-1">Parker&apos;s Cayman</h4>
                        <div className="text-xs font-mono text-[#06B6D4]">
                          327 North Sound Rd (Adjacent to Animal House)
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        TOOLS &amp; DMM
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                      Closest physical store. Walk over directly to buy 10mm/12mm wrench sets, digital multimeters, heavy-gauge booster cables, or battery terminal cleaner.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-inherit flex gap-2">
                    <a
                      href="tel:+13459490599"
                      className="flex-1 py-2 px-3 rounded-lg bg-[#06B6D4] text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#4CD7F6] transition-all shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call (345) 949-0599</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('+13459490599', 'phone-parkers')}
                      className={`p-2 rounded-lg border text-xs font-mono ${
                        theme === 'dark' ? 'border-[#30363D] bg-[#21262D]' : 'border-[#CBD5E1] bg-slate-100'
                      }`}
                      title="Copy Number"
                    >
                      {copiedKey === 'phone-parkers' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. Tony's Toys Automotive */}
                <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-slate-700 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                          DIAGNOSTIC &amp; SCRAP YARD
                        </span>
                        <h4 className="text-base font-black mt-1">Tony&apos;s Toys Automotive</h4>
                        <div className="text-xs font-mono text-[#06B6D4]">
                          91 Sherwood Dr (Industrial Park)
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        YARD &amp; BAYS
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                      Full diagnostic repair bays, electrical load testers, and active scrap inventory for GD1/GD3 chassis parts.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-inherit flex gap-2">
                    <a
                      href="tel:+13459468697"
                      className="flex-1 py-2 px-3 rounded-lg border font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm bg-slate-700 text-white hover:bg-slate-600"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call (345) 946-8697</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('+13459468697', 'phone-tonys')}
                      className={`p-2 rounded-lg border text-xs font-mono ${
                        theme === 'dark' ? 'border-[#30363D] bg-[#21262D]' : 'border-[#CBD5E1] bg-slate-100'
                      }`}
                      title="Copy Number"
                    >
                      {copiedKey === 'phone-tonys' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 4. Car Clinic Ltd. */}
                <div className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                  theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-amber-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                          BENCH OVERHAUL &amp; DYNO
                        </span>
                        <h4 className="text-base font-black mt-1">Car Clinic Ltd.</h4>
                        <div className="text-xs font-mono text-[#06B6D4]">
                          147A Dorcy Dr (Industrial Park)
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        CI$75 – $100
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8B949E]' : 'text-slate-600'}`}>
                      Alternator bench overhaul, diode rectifier soldering, carbon brush replacement, and electric dynamometer testing station.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-inherit flex gap-2">
                    <a
                      href="tel:+13459497080"
                      className="flex-1 py-2 px-3 rounded-lg border font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm bg-slate-700 text-white hover:bg-slate-600"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call (345) 949-7080</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('+13459497080', 'phone-clinic')}
                      className={`p-2 rounded-lg border text-xs font-mono ${
                        theme === 'dark' ? 'border-[#30363D] bg-[#21262D]' : 'border-[#CBD5E1] bg-slate-100'
                      }`}
                      title="Copy Number"
                    >
                      {copiedKey === 'phone-clinic' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CAYMAN REPLACEMENT COST MATRIX */}
            <div className={`rounded-xl border p-4 sm:p-5 transition-all ${
              theme === 'dark' ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#CBD5E1] shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">Cayman Replacement Cost Comparison</h3>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div>
                    <span className="font-bold text-emerald-400 text-sm block">Used OEM A5TB0091 (Tested)</span>
                    <span className="text-[11px] text-[#8B949E]">Cartronics / Local Yard Salvage • Direct Bolt-on</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-base">CI$50 – $80</span>
                    <span className="text-[10px] text-emerald-500 font-bold block">BEST VALUE</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div>
                    <span className="font-bold text-inherit text-sm block">Professional Bench Rebuild</span>
                    <span className="text-[11px] text-[#8B949E]">Car Clinic (New regulator/brushes soldered) • Same-day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold text-base">CI$75 – $100</span>
                    <span className="text-[10px] text-[#8B949E] block">Labor &amp; Parts</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#0D1117] border-[#30363D]' : 'bg-slate-50 border-[#CBD5E1]'
                }`}>
                  <div>
                    <span className="font-bold text-red-400 text-sm block">Brand New Aftermarket Unit</span>
                    <span className="text-[11px] text-[#8B949E]">NAPA / Kirk (Part #11177N) • High Import Duty</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-bold text-base">CI$160 – $240</span>
                    <span className="text-[10px] text-[#8B949E] block">High Expense</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FIXED MOBILE FOOTER NAVIGATION BAR */}
      <nav className={`fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-lg px-2 py-2 transition-all ${
        theme === 'dark'
          ? 'bg-[#0A0E14]/95 border-[#30363D]'
          : 'bg-white/95 border-[#CBD5E1] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          {[
            { id: 'triage', label: 'TRIAGE', icon: Zap },
            { id: 'parts', label: 'PARTS', icon: Cpu },
            { id: 'removal', label: 'REMOVAL', icon: Wrench },
            { id: 'bench', label: 'BENCH', icon: Sliders },
            { id: 'logistics', label: 'LOGISTICS', icon: MapPin },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as SectionTab);
                  if (viewAllDossier) {
                    const el = document.getElementById(`section-${tab.id}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-lg text-xs font-mono font-bold transition-all min-h-[44px] ${
                  isCurrent
                    ? 'text-[#06B6D4] bg-[#06B6D4]/10'
                    : theme === 'dark'
                    ? 'text-[#8B949E] hover:text-white'
                    : 'text-[#475569] hover:text-black'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
