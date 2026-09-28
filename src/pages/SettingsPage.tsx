import { Settings as SettingsIcon, Sliders, Thermometer, DollarSign, Bell, RotateCcw, Info, Zap } from 'lucide-react';
import { Card, SectionHeader, Button, InputField, OptionSelector, Badge } from '@/components/ui';
import { useSettings } from '@/context/SettingsContext';

export function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        subtitle="Configure default parameters and preferences"
        icon={<SettingsIcon size={22} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calculation defaults */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sliders size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Calculation Defaults</h3>
          </div>

          <div className="space-y-4">
            <InputField
              label="Voltage Drop Limit"
              value={settings.voltageDropLimit}
              onChange={(v) => updateSettings({ voltageDropLimit: Number(v) })}
              unit="%"
              min={1}
              step={0.5}
            />

            <InputField
              label="Default Ambient Temperature"
              value={settings.ambientTemp}
              onChange={(v) => updateSettings({ ambientTemp: Number(v) })}
              unit="°C"
              min={-10}
              step={1}
            />

            <OptionSelector
              label="Default Material"
              value={settings.material}
              onChange={(v) => updateSettings({ material: v })}
              options={[
                { value: 'copper', label: 'Copper' },
                { value: 'aluminium', label: 'Aluminium' },
              ]}
            />

            <OptionSelector
              label="Default Phase Type"
              value={settings.phase}
              onChange={(v) => updateSettings({ phase: v })}
              options={[
                { value: 'single', label: 'Single Phase' },
                { value: 'three', label: 'Three Phase' },
              ]}
            />
          </div>
        </Card>

        {/* Preferences */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Display Preferences</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Currency Symbol</label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="$">$ — USD</option>
                  <option value="€">€ — EUR</option>
                  <option value="£">£ — GBP</option>
                  <option value="₹">₹ — INR</option>
                  <option value="¥">¥ — JPY</option>
                  <option value="A$">A$ — AUD</option>
                  <option value="C$">C$ — CAD</option>
                </select>
              </div>

              <OptionSelector
                label="Temperature Unit"
                value={settings.temperatureUnit}
                onChange={(v) => updateSettings({ temperatureUnit: v })}
                options={[
                  { value: 'celsius', label: 'Celsius (°C)' },
                  { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
                ]}
              />
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bell size={18} className="text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Auto-Save</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Save calculations automatically</p>
                <p className="mt-0.5 text-xs text-slate-400">Store every result to your saved list</p>
              </div>
              <ToggleSwitch
                checked={settings.autoSave}
                onChange={(v) => updateSettings({ autoSave: v })}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Info card */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 ring-1 ring-blue-200">
            <Info size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">About These Calculations</h3>
            <p className="mt-1 text-sm text-slate-500">
              All calculations are based on IEC 60364 and BS 7671 standards for cable selection, voltage drop, and breaker sizing.
              Current carrying capacities are derived from standard tables for copper and aluminium conductors with appropriate derating factors.
              Results are engineering estimates — always verify with local electrical codes and a qualified engineer before installation.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge color="blue"><Zap size={12} /> IEC 60364</Badge>
              <Badge color="blue">BS 7671</Badge>
              <Badge color="blue">IEC 60044</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Reset */}
      <div className="flex justify-end">
        <Button onClick={resetSettings} variant="danger">
          <RotateCcw size={16} /> Reset to Defaults
        </Button>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`}
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}
