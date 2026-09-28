import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Calculator, Gauge, DollarSign, Cable, Zap, Shield, AlertCircle } from 'lucide-react';
import { Card, SectionHeader, Button, Badge } from '@/components/ui';
import type { SavedCalculation } from '@/types';
import { loadSavedCalculations, deleteCalculation, clearAllCalculations } from '@/utils/storage';

const typeMeta = {
  wire: { label: 'Wire Gauge', icon: Calculator, color: 'blue' as const },
  ct: { label: 'CT Selector', icon: Gauge, color: 'green' as const },
  price: { label: 'Price Estimate', icon: DollarSign, color: 'amber' as const },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function renderSummary(calc: SavedCalculation): { label: string; value: string }[] {
  if (calc.type === 'wire') {
    const r = calc.result as Extract<SavedCalculation['result'], { cableSizeLabel: string }>;
    const i = calc.input as Extract<SavedCalculation['input'], { current: number }>;
    return [
      { label: 'Cable', value: r.cableSizeLabel },
      { label: 'AWG', value: r.awg },
      { label: 'V Drop', value: `${r.voltageDropPercent.toFixed(1)}%` },
      { label: 'MCB', value: `${r.mcbRating}A` },
      { label: 'Load', value: `${i.current}A` },
      { label: 'Length', value: `${i.length}m` },
    ];
  }
  if (calc.type === 'ct') {
    const r = calc.result as Extract<SavedCalculation['result'], { ratio: string }>;
    const i = calc.input as Extract<SavedCalculation['input'], { loadCurrent: number }>;
    return [
      { label: 'Ratio', value: r.ratio },
      { label: 'Class', value: r.accuracyClass },
      { label: 'Core', value: r.coreType },
      { label: 'Load', value: `${i.loadCurrent}A` },
      { label: 'Primary', value: `${r.primaryRatedCurrent}A` },
      { label: 'Secondary', value: `${r.secondaryCurrent}A` },
    ];
  }
  const r = calc.result as Extract<SavedCalculation['result'], { totalPrice: number }>;
  const i = calc.input as Extract<SavedCalculation['input'], { cableSize: number; quantity: number; length: number; material: string }>;
  const currency = '$';
  return [
    { label: 'Total', value: `${currency}${r.totalPrice.toFixed(0)}` },
    { label: 'Per m', value: `${currency}${r.pricePerMeter.toFixed(2)}` },
    { label: 'Size', value: `${i.cableSize}mm²` },
    { label: 'Material', value: i.material },
    { label: 'Qty', value: `${i.quantity}` },
    { label: 'Length', value: `${i.length}m` },
  ];
}

export function SavedCalculationsPage() {
  const [calcs, setCalcs] = useState<SavedCalculation[]>([]);
  const [filter, setFilter] = useState<'all' | 'wire' | 'ct' | 'price'>('all');

  useEffect(() => {
    setCalcs(loadSavedCalculations());
  }, []);

  const handleDelete = (id: string) => {
    deleteCalculation(id);
    setCalcs(loadSavedCalculations());
  };

  const handleClearAll = () => {
    clearAllCalculations();
    setCalcs([]);
  };

  const filtered = filter === 'all' ? calcs : calcs.filter((c) => c.type === filter);
  const counts = {
    all: calcs.length,
    wire: calcs.filter((c) => c.type === 'wire').length,
    ct: calcs.filter((c) => c.type === 'ct').length,
    price: calcs.filter((c) => c.type === 'price').length,
  };

  const filterTabs: { id: typeof filter; label: string; icon: typeof Bookmark }[] = [
    { id: 'all', label: 'All', icon: Bookmark },
    { id: 'wire', label: 'Wire Gauge', icon: Calculator },
    { id: 'ct', label: 'CT Selector', icon: Gauge },
    { id: 'price', label: 'Price', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Saved Calculations"
        subtitle="Review and manage your previously saved results"
        icon={<Bookmark size={22} />}
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
        {calcs.length > 0 && (
          <Button onClick={handleClearAll} variant="danger" size="sm" className="ml-auto">
            <Trash2 size={14} /> Clear All
          </Button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
          <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
            <AlertCircle size={40} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            {calcs.length === 0
              ? 'No saved calculations yet. Run a calculation and save it to see it here.'
              : 'No calculations match this filter.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((calc) => {
            const meta = typeMeta[calc.type];
            const Icon = meta.icon;
            const summary = renderSummary(calc);
            return (
              <Card key={calc.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2.5 ${meta.color === 'blue' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' : meta.color === 'green' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{calc.name}</p>
                      <p className="text-xs text-slate-400">{formatDate(calc.date)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(calc.id)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-4">
                  <Badge color={meta.color}>{meta.label}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {summary.map((s, idx) => (
                    <div key={idx} className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                      <p className="text-xs font-medium text-slate-400">{s.label}</p>
                      <p className="text-sm font-bold text-slate-800 tabular-nums truncate">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Type-specific icon row */}
                {calc.type === 'wire' && (
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1"><Cable size={13} /> Cable</span>
                    <span className="inline-flex items-center gap-1"><Zap size={13} /> V Drop</span>
                    <span className="inline-flex items-center gap-1"><Shield size={13} /> Breaker</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
