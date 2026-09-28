import { useState, useCallback } from 'react';
import { Gauge, Save, Zap, Shield, Target, Cable, CheckCircle2, Layers, Cpu } from 'lucide-react';
import { Card, StatCard, SectionHeader, Button, InputField, OptionSelector, Badge } from '@/components/ui';
import type { CTCalcInput, CTCalcResult, CTApplicationType, SavedCalculation } from '@/types';
import { calculateCT } from '@/utils/calculations';
import { saveCalculation, generateId } from '@/utils/storage';

export function CTSelectorPage() {
  const [input, setInput] = useState<CTCalcInput>({
    loadCurrent: 100,
    applicationType: 'Metering',
  });
  const [result, setResult] = useState<CTCalcResult | null>(null);
  const [savedFlag, setSavedFlag] = useState(false);

  const update = useCallback(<K extends keyof CTCalcInput>(key: K, value: CTCalcInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setSavedFlag(false);
  }, []);

  const handleCalculate = () => {
    setResult(calculateCT(input));
    setSavedFlag(false);
  };

  const handleSave = () => {
    if (!result) return;
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'ct',
      name: `CT ${result.ratio} ${input.applicationType}`,
      date: new Date().toISOString(),
      input,
      result,
    };
    saveCalculation(calc);
    setSavedFlag(true);
  };

  const appOptions: { value: CTApplicationType; label: string }[] = [
    { value: 'Metering', label: 'Metering' },
    { value: 'Protection', label: 'Protection' },
    { value: 'Energy Monitoring', label: 'Energy Monitoring' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="CT Selector"
        subtitle="Select current transformers by load current and application type"
        icon={<Gauge size={22} />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">CT Specifications</h3>
            <div className="space-y-4">
              <InputField
                label="Load Current"
                value={input.loadCurrent}
                onChange={(v) => update('loadCurrent', Number(v))}
                unit="A"
                min={1}
                step={1}
              />

              <OptionSelector<CTApplicationType>
                label="Application Type"
                value={input.applicationType}
                onChange={(v) => update('applicationType', v)}
                options={appOptions}
                columns={3}
              />

              {/* Rules reference */}
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Accuracy Class Rules</p>
                <div className="space-y-1.5 text-xs">
                  <RuleRow label="0.2S" detail="Revenue Metering" />
                  <RuleRow label="0.5" detail="Standard Metering" />
                  <RuleRow label="5P10" detail="Protection" />
                  <RuleRow label="10P10" detail="Protection" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCalculate} className="flex-1">
                  <Gauge size={18} /> Select CT
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
                <Gauge size={40} />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Enter your load current and select an application type to get a recommended current transformer specification.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Primary result */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Recommended CT</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{result.ratio}</span>
                        <span className="text-sm font-medium text-emerald-100">ratio</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-emerald-50">{result.recommendedModel}</p>
                    </div>
                    <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                      <Zap size={28} />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge color="green">{`Class ${result.accuracyClass}`}</Badge>
                    <Badge color="blue">{result.coreType}</Badge>
                    <Badge color="slate">{result.applicationType}</Badge>
                  </div>
                </div>
              </Card>

              {/* Detailed stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard label="CT Ratio" value={result.ratio} icon={<Gauge size={18} />} accent="green" hint={`${result.ratioNumeric}:1 transformation`} />
                <StatCard label="Core Type" value={result.coreType} icon={<Cpu size={18} />} accent="blue" />
                <StatCard label="Accuracy Class" value={result.accuracyClass} icon={<Shield size={18} />} accent="slate" />
                <StatCard label="Primary Rated" value={String(result.primaryRatedCurrent)} unit="A" icon={<Zap size={18} />} accent="blue" hint="120% of load" />
                <StatCard label="Secondary Current" value={String(result.secondaryCurrent)} unit="A" icon={<Target size={18} />} accent="green" />
                <StatCard label="Burden" value={String(result.burdenVA)} unit="VA" icon={<Layers size={18} />} accent="amber" />
              </div>

              {/* Accuracy class detail */}
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 ring-1 ring-emerald-200">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Class {result.accuracyClass} — {result.coreType}</p>
                    <p className="mt-1 text-sm text-slate-500">{result.accuracyClassDescription}</p>
                  </div>
                </div>
              </Card>

              {/* Knee point + model */}
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Knee Point Voltage" value={String(result.kneePointVoltage)} unit="V" icon={<Cable size={18} />} accent="blue" hint="Minimum Vk for saturation-free operation" />
                <StatCard label="Model Reference" value={result.recommendedModel} icon={<CheckCircle2 size={18} />} accent="green" />
              </div>

              {/* Selection guidelines */}
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Selection Guidelines</h3>
                <div className="space-y-2.5">
                  <GuidelineRow
                    title="Primary Current Sizing"
                    detail={`Primary rated current = ${result.primaryRatedCurrent}A (120% of ${input.loadCurrent}A load) for accurate measurement range`}
                  />
                  <GuidelineRow
                    title="Accuracy Class Selection"
                    detail={
                      result.applicationType === 'Protection'
                        ? 'Protection CTs use 5P10 / 10P10 class — accuracy limit factor (ALF) of 10x rated current ensures relay operation during faults'
                        : result.applicationType === 'Energy Monitoring'
                          ? 'Energy monitoring uses 0.2S class for revenue-grade sub-metering with wide dynamic range'
                          : 'Standard metering uses 0.5 class — suitable for commercial and industrial billing applications'
                    }
                  />
                  <GuidelineRow
                    title="Core Type"
                    detail={`${result.coreType} is designed for ${result.applicationType.toLowerCase()} applications with appropriate saturation characteristics`}
                  />
                  <GuidelineRow
                    title="Burden"
                    detail={`Rated burden of ${result.burdenVA} VA must exceed the total connected load (wiring + instruments)`}
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

function RuleRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md bg-white px-2 py-0.5 font-mono text-xs font-bold text-slate-700 ring-1 ring-slate-200">{label}</span>
      <span className="text-slate-500">{detail}</span>
    </div>
  );
}

function GuidelineRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
