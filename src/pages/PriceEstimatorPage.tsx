import { useState, useCallback, useMemo } from 'react';
import { DollarSign, Save, Layers, Weight, Cable, Calculator as CalcIcon, Search, Table } from 'lucide-react';
import { Card, StatCard, SectionHeader, Button, InputField, OptionSelector, Badge } from '@/components/ui';
import type { PriceCalcInput, PriceCalcResult, Material, SavedCalculation } from '@/types';
import { calculatePrice } from '@/utils/calculations';
import { cableSpecs, cablePriceDatabase, searchCablePrices } from '@/data/cableData';
import { useSettings } from '@/context/SettingsContext';
import { saveCalculation, generateId } from '@/utils/storage';

export function PriceEstimatorPage() {
  const { settings } = useSettings();
  const [input, setInput] = useState<PriceCalcInput>({
    cableSize: 2.5,
    material: settings.material,
    length: 100,
    quantity: 1,
  });
  const [result, setResult] = useState<PriceCalcResult | null>(null);
  const [savedFlag, setSavedFlag] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPriceTable, setShowPriceTable] = useState(false);

  const update = useCallback(<K extends keyof PriceCalcInput>(key: K, value: PriceCalcInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setSavedFlag(false);
  }, []);

  const handleCalculate = () => {
    setResult(calculatePrice(input));
    setSavedFlag(false);
  };

  const handleSave = () => {
    if (!result) return;
    const calc: SavedCalculation = {
      id: generateId(),
      type: 'price',
      name: `${input.cableSize}mm² ${input.material} ×${input.quantity}`,
      date: new Date().toISOString(),
      input,
      result,
    };
    saveCalculation(calc);
    setSavedFlag(true);
  };

  const currency = settings.currency;

  const filteredPrices = useMemo(
    () => searchCablePrices(searchQuery, input.material),
    [searchQuery, input.material],
  );

  const selectedCable = cableSpecs.find((c) => c.size === input.cableSize);
  const selectedPrice = input.material === 'copper'
    ? selectedCable?.pricePerMeterCopper
    : selectedCable?.pricePerMeterAluminium;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cable Price Estimator"
        subtitle="Estimate cable costs from the built-in price database"
        icon={<DollarSign size={22} />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Estimate Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cable Size</label>
                <select
                  value={input.cableSize}
                  onChange={(e) => update('cableSize', Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {cableSpecs.map((c) => (
                    <option key={c.size} value={c.size}>
                      {c.label} — {c.awg}
                    </option>
                  ))}
                </select>
              </div>

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
                  label="Length per Run"
                  value={input.length}
                  onChange={(v) => update('length', Number(v))}
                  unit="m"
                  min={1}
                  step={1}
                />
                <InputField
                  label="Quantity"
                  value={input.quantity}
                  onChange={(v) => update('quantity', Number(v))}
                  unit="runs"
                  min={1}
                  step={1}
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Selected Cable</span>
                  <Badge color="blue">{selectedCable?.label}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Unit price</span>
                  <span className="font-semibold text-slate-700 tabular-nums">
                    {currency}{selectedPrice}/m
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCalculate} className="flex-1">
                  <CalcIcon size={18} /> Estimate
                </Button>
                {result && (
                  <Button onClick={handleSave} variant="secondary">
                    <Save size={16} /> {savedFlag ? 'Saved' : 'Save'}
                  </Button>
                )}
              </div>

              <button
                onClick={() => setShowPriceTable((v) => !v)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Table size={16} /> {showPriceTable ? 'Hide' : 'Show'} Price Database ({cablePriceDatabase.length} sizes)
              </button>
            </div>
          </Card>
        </div>

        {/* Results + Price table */}
        <div className="lg:col-span-3 space-y-4">
          {/* Price database table */}
          {showPriceTable && (
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Cable Price Database</h3>
                <div className="relative w-48">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search size or AWG..."
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto rounded-xl ring-1 ring-slate-200">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5">AWG</th>
                      <th className="px-4 py-2.5 text-right">Copper/m</th>
                      <th className="px-4 py-2.5 text-right">Aluminium/m</th>
                      <th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPrices.map((entry) => {
                      const isActive = entry.size === input.cableSize;
                      return (
                        <tr
                          key={entry.size}
                          className={`cursor-pointer transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                          onClick={() => {
                            update('cableSize', entry.size);
                            setShowPriceTable(false);
                          }}
                        >
                          <td className="px-4 py-2.5 font-semibold text-slate-800">{entry.label}</td>
                          <td className="px-4 py-2.5 text-slate-500">{entry.awg}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-medium text-amber-700">{currency}{entry.pricePerMeterCopper.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-medium text-slate-600">{currency}{entry.pricePerMeterAluminium.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-right">
                            {isActive && <Badge color="blue">Selected</Badge>}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredPrices.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                          No matching cable sizes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Click any row to select that cable size. Total Cost = Length × Price per Meter × Quantity.
              </p>
            </Card>
          )}

          {!result ? (
            <Card className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center">
              <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                <DollarSign size={40} />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Select cable size, material, and quantity to generate a price estimate.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">Total Estimated Cost</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tabular-nums">{currency}{result.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge color="slate">{input.quantity} {input.quantity === 1 ? 'run' : 'runs'}</Badge>
                    <Badge color="slate">{input.length}m each</Badge>
                    <Badge color="slate">{input.material}</Badge>
                    <Badge color="slate">{selectedCable?.label}</Badge>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard
                  label="Unit Price"
                  value={`${currency}${result.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={<DollarSign size={18} />}
                  accent="amber"
                  hint={`Per run (${input.length}m)`}
                />
                <StatCard
                  label="Price per Meter"
                  value={`${currency}${result.pricePerMeter.toFixed(2)}`}
                  icon={<Layers size={18} />}
                  accent="blue"
                />
                <StatCard
                  label="Total Length"
                  value={String(input.length * input.quantity)}
                  unit="m"
                  icon={<Cable size={18} />}
                  accent="slate"
                />
                <StatCard
                  label="Metal Weight"
                  value={result.copperWeight.toFixed(1)}
                  unit="kg"
                  icon={<Weight size={18} />}
                  accent="green"
                  hint={input.material}
                />
                <StatCard
                  label="Total Cost"
                  value={`${currency}${result.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  icon={<DollarSign size={18} />}
                  accent="amber"
                />
                <StatCard
                  label="Cost per Meter"
                  value={`${currency}${(result.totalPrice / (input.length * input.quantity)).toFixed(2)}`}
                  icon={<Layers size={18} />}
                  accent="blue"
                />
              </div>

              <Card className="p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Cost Breakdown</h3>
                <div className="space-y-2">
                  <CostRow label="Cable unit price" value={`${currency}${result.pricePerMeter.toFixed(2)}/m × ${input.length}m`} />
                  <CostRow label="Per run subtotal" value={`${currency}${result.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                  <CostRow label="Quantity multiplier" value={`× ${input.quantity}`} />
                  <div className="border-t border-slate-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">Grand Total</span>
                      <span className="text-lg font-bold text-amber-600 tabular-nums">
                        {currency}{result.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Total Cost = Length × Price per Meter × Quantity. Prices are indicative estimates based on standard market rates.
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700 tabular-nums">{value}</span>
    </div>
  );
}
