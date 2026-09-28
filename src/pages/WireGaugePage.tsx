import { useState, useCallback } from 'react';
import {
  Calculator as CalcIcon,
  Zap,
  Gauge,
  Thermometer,
  Layers,
  Activity,
  Shield,
  Save,
  AlertTriangle,
  CheckCircle2,
  Cable,
} from 'lucide-react';
import { Card, StatCard, SectionHeader, Button, InputField, OptionSelector, Badge } from '@/components/ui';
import type { WireCalcInput, WireCalcResult, PhaseType, Material, InstallationType, SavedCalculation } from '@/types';
import { calculateWire } from '@/utils/calculations';
import { useSettings } from '@/context/SettingsContext';
import { saveCalculation, generateId } from '@/utils/storage';

const installationOptions: { value: InstallationType; label: string }[] = [
  { value: 'conduit', label: 'Conduit' },
  { value: 'tray', label: 'Tray' },
  { value: 'underground', label: 'Underground' },
  { value: 'open_air', label: 'Open Air' },
];

export function WireGaugePage() {
  const { settings } = useSettings();
  const [input, setInput] = useState<WireCalcInput>({
    current: 20,
    voltage: 230,
    phase: settings.phase,
    material: settings.material,
    length: 15,
    installation: 'conduit',
    ambientTemp: settings.ambientTemp,
  });
  const [result, setResult] = useState<WireCalcResult | null>(null);
  const [savedFlag, setSavedFlag] = useState(false);

  const update = useCallback(<K extends keyof WireCalcInput>(key: K, value: WireCalcInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setSavedFlag(false);
  }, []);

  const handleCalculate = () => {
    const res = calculateWire(input);
    setResult(res);
    setSavedFlag(false);
  };

  const handleSave = () => {
    if (!result) return;
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'wire',
      name: `${input.current}A ${input.material} ${input.length}m`,
      date: new Date().toISOString(),
      input,
      result,
    };
    saveCalculation(calc);
    setSavedFlag(true);
  };

  const vdStatus = result
    ? result.voltageDropPercent <= settings.voltageDropLimit
      ? { color: 'green' as const, label: 'Within limit', icon: <CheckCircle2 size={12} /> }
      : { color: 'red' as const, label: 'Exceeds limit', icon: <AlertTriangle size={12} /> }
    : null;

  const utilStatus = result
    ? result.utilizationPercent <= 80
      ? { color: 'green' as const, label: 'Good headroom' }
      : result.utilizationPercent <= 100
        ? { color: 'amber' as const, label: 'Near capacity' }
        : { color: 'red' as const, label: 'Over capacity' }
    : null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Wire Gauge Calculator"
        subtitle="Determine optimal cable size, voltage drop, and protection devices"
        icon={<CalcIcon size={22} />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Input Parameters</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Current"
                  value={input.current}
                  onChange={(v) => update('current', Number(v))}
                  unit="A"
                  min={0.1}
                  step={0.5}
                />
                <InputField
                  label="Voltage"
                  value={input.voltage}
                  onChange={(v) => update('voltage', Number(v))}
                  unit="V"
                  min={1}
                  step={1}
                />
              </div>

              <OptionSelector<PhaseType>
                label="Phase Type"
                value={input.phase}
                onChange={(v) => update('phase', v)}
                options={[
                  { value: 'single', label: 'Single Phase' },
                  { value: 'three', label: 'Three Phase' },
                ]}
              />

              <OptionSelector<Material>
                label="Material"
                value={input.material}
                onChange={(v) => update('material', v)}
                options={[
                  { value: 'copper', label: 'Copper' },
                  { value: 'aluminium', label: 'Aluminium' },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Cable Length"
                  value={input.length}
                  onChange={(v) => update('length', Number(v))}
                  unit="m"
                  min={0.5}
                  step={0.5}
                />
                <InputField
                  label="Ambient Temp"
                  value={input.ambientTemp}
                  onChange={(v) => update('ambientTemp', Number(v))}
                  unit="°C"
                  min={-10}
                  step={1}
                />
              </div>

              <OptionSelector<InstallationType>
                label="Installation Type"
                value={input.installation}
                onChange={(v) => update('installation', v)}
                options={installationOptions}
                columns={4}
              />

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCalculate} className="flex-1" size="md">
                  <CalcIcon size={18} /> Calculate
                </Button>
                {result && (
                  <Button onClick={handleSave} variant="secondary">
                    <Save size={16} /> {savedFlag ? 'Saved' : 'Save'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {!result ? (
            <Card className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                <Cable size={40} />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Enter your parameters and press Calculate to see recommended cable specifications.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Primary result */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Recommended Cable Size</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{result.cableSizeLabel}</span>
                        <span className="text-lg font-medium text-blue-100">{result.awg}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                      <Cable size={28} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {vdStatus && (
                      <span className={`inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm`}>
                        {vdStatus.icon} V Drop {result.voltageDropPercent.toFixed(2)}% — {vdStatus.label}
                      </span>
                    )}
                    {utilStatus && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                        <Activity size={12} /> {result.utilizationPercent.toFixed(0)}% utilized — {utilStatus.label}
                      </span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Detailed stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard label="Voltage Drop" value={result.voltageDrop.toFixed(2)} unit="V" icon={<Zap size={18} />} accent={vdStatus?.color ?? 'blue'} hint={`${result.voltageDropPercent.toFixed(2)}% of supply`} />
                <StatCard label="Power Loss" value={result.powerLoss.toFixed(2)} unit="W" icon={<Activity size={18} />} accent="amber" hint="I²R losses" />
                <StatCard label="Current Capacity" value={String(result.deratedCapacity.toFixed(0))} unit="A" icon={<Gauge size={18} />} accent="green" hint={`Base: ${result.currentCapacity}A`} />
                <StatCard label="Recommended MCB" value={String(result.mcbRating)} unit="A" icon={<Shield size={18} />} accent="blue" hint="Miniature breaker" />
                <StatCard label="Recommended MCCB" value={String(result.mccbRating)} unit="A" icon={<Shield size={18} />} accent="slate" hint="Molded case breaker" />
                <StatCard label="Resistance" value={result.resistance.toFixed(3)} unit="Ω/km" icon={<Layers size={18} />} accent="slate" hint={`${input.material}`} />
              </div>

              {/* Compliance */}
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Compliance Check</h3>
                <div className="space-y-2.5">
                  <ComplianceRow
                    ok={result.voltageDropPercent <= settings.voltageDropLimit}
                    label={`Voltage drop ≤ ${settings.voltageDropLimit}% limit`}
                    detail={`${result.voltageDropPercent.toFixed(2)}% actual`}
                  />
                  <ComplianceRow
                    ok={result.deratedCapacity >= input.current}
                    label="Cable capacity ≥ load current"
                    detail={`${result.deratedCapacity.toFixed(0)}A capacity vs ${input.current}A load`}
                  />
                  <ComplianceRow
                    ok={result.mcbRating <= result.deratedCapacity}
                    label="MCB rating ≤ cable capacity"
                    detail={`${result.mcbRating}A breaker vs ${result.deratedCapacity.toFixed(0)}A cable`}
                  />
                  <ComplianceRow
                    ok={input.ambientTemp <= 40}
                    label="Ambient temperature within range"
                    detail={`${input.ambientTemp}°C ambient`}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComplianceRow({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200">
      <div className="flex items-center gap-2.5">
        {ok ? (
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
        ) : (
          <AlertTriangle size={18} className="shrink-0 text-red-600" />
        )}
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <Badge color={ok ? 'green' : 'red'}>{detail}</Badge>
    </div>
  );
}
