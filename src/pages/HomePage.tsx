import { Zap, Calculator, Gauge, DollarSign, Bookmark, TrendingUp, Shield, ArrowRight, Cpu } from 'lucide-react';
import { Card, StatCard } from '@/components/ui';
import type { PageId } from '@/components/Navigation';
import { loadSavedCalculations } from '@/utils/storage';
import { cableSpecs } from '@/data/cableData';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const saved = loadSavedCalculations();
  const totalCableSizes = cableSpecs.length;
  const maxAmpacity = cableSpecs[cableSpecs.length - 1].capacityCopper.open_air;

  const tools = [
    {
      id: 'calculator' as PageId,
      title: 'Wire Gauge Calculator',
      description: 'Determine optimal cable size, voltage drop, and breaker ratings',
      icon: Calculator,
      accent: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'ct-selector' as PageId,
      title: 'CT Selector',
      description: 'Select current transformers by ratio, burden, and accuracy class',
      icon: Gauge,
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'price-estimator' as PageId,
      title: 'Cable Price Estimator',
      description: 'Estimate cable costs based on material, size, and quantity',
      icon: DollarSign,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      id: 'saved' as PageId,
      title: 'Saved Calculations',
      description: 'Review and manage your previously saved results',
      icon: Bookmark,
      accent: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 opacity-10">
          <Zap size={200} strokeWidth={1.5} />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-white/20">
            <Cpu size={14} /> IEC 60364 Compliant Engine
          </div>
          <h2 className="mt-4 max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl">
            Professional Wire Gauge Prediction & Cable Selection
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            Calculate optimal cable sizes, voltage drops, breaker ratings, CT ratios, and cost estimates — all in one professional toolkit.
          </p>
          <button
            onClick={() => onNavigate('calculator')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-500"
          >
            Start Calculating <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Cable Sizes" value={String(totalCableSizes)} unit="standards" icon={<TrendingUp size={20} />} accent="blue" hint="1.5 to 300 mm²" />
        <StatCard label="Max Ampacity" value={String(maxAmpacity)} unit="A" icon={<Zap size={20} />} accent="amber" hint="Copper, open air" />
        <StatCard label="Saved Results" value={String(saved.length)} icon={<Bookmark size={20} />} accent="green" hint="Stored locally" />
        <StatCard label="Standards" value="IEC" unit="+ BS" icon={<Shield size={20} />} accent="slate" hint="Compliant methods" />
      </div>

      {/* Tools */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Tools & Calculators</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} onClick={() => onNavigate(tool.id)} className="group p-5 hover:border-blue-300">
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 rounded-2xl bg-gradient-to-br ${tool.accent} p-3 text-white shadow-md`}>
                    <Icon size={24} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900">{tool.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                      Open <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick guide */}
      <Card className="p-5">
        <h3 className="mb-3 text-base font-bold text-slate-900">Quick Reference</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Voltage Drop Limit</p>
            <p className="mt-1 text-sm text-slate-700">Max 5% of supply voltage for general circuits (IEC 60364)</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Derating</p>
            <p className="mt-1 text-sm text-slate-700">Apply correction for ambient temperature, grouping, and thermal insulation</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">MCB / MCCB</p>
            <p className="mt-1 text-sm text-slate-700">Breaker rated current should not exceed cable current carrying capacity</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">CT Selection</p>
            <p className="mt-1 text-sm text-slate-700">Primary current 120% of max load; choose accuracy class by application</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
