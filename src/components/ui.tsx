import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: ReactNode;
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'slate';
  hint?: string;
}

const accentMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-200' },
};

export function StatCard({ label, value, unit, icon, accent = 'blue', hint }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 tabular-nums truncate">{value}</span>
            {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
          </div>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        {icon && (
          <div className={`shrink-0 rounded-xl p-2.5 ${a.bg} ${a.text} ring-1 ${a.ring}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon && (
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 ring-1 ring-blue-200">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 ring-1 ring-red-200',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  unit?: string;
  placeholder?: string;
  min?: number;
  step?: number;
}

export function InputField({
  label,
  value,
  onChange,
  type = 'number',
  unit,
  placeholder,
  min,
  step,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          step={step}
          className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 tabular-nums outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${unit ? 'pr-14' : ''}`}
        />
        {unit && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

interface OptionSelectorProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: ReactNode }[];
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}

export function OptionSelector<T extends string>({
  label,
  value,
  options,
  onChange,
  columns = 2,
}: OptionSelectorProps<T>) {
  const colMap = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' };
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className={`grid ${colMap[columns]} gap-2`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
              value === opt.value
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            {opt.icon}
            <span className="truncate">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  color?: 'green' | 'amber' | 'red' | 'blue' | 'slate';
}

export function Badge({ children, color = 'slate' }: BadgeProps) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${colors[color]}`}>
      {children}
    </span>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
