import { Zap, Home, Calculator, Gauge, DollarSign, Bookmark, Settings as SettingsIcon, X } from 'lucide-react';

export type PageId = 'home' | 'calculator' | 'ct-selector' | 'price-estimator' | 'saved' | 'settings';

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof Home;
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calculator', label: 'Wire Gauge Calculator', icon: Calculator },
  { id: 'ct-selector', label: 'CT Selector', icon: Gauge },
  { id: 'price-estimator', label: 'Cable Price Estimator', icon: DollarSign },
  { id: 'saved', label: 'Saved Calculations', icon: Bookmark },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 transform overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 text-white shadow-md shadow-blue-500/30">
              <Zap size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900">Wire Gauge</h1>
              <p className="text-xs font-medium text-slate-500">Predictor Pro</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mx-4 mb-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold text-slate-700">IEC 60364 Compliant</p>
          <p className="mt-1 text-xs text-slate-500">
            Calculations based on IEC and BS standards. Results are estimates — verify with local codes.
          </p>
        </div>
      </aside>
    </>
  );
}

interface TopBarProps {
  onMenuClick: () => void;
  title: string;
}

export function TopBar({ onMenuClick, title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      </div>
    </header>
  );
}
