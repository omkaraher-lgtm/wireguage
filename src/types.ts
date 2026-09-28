export type PhaseType = 'single' | 'three';
export type Material = 'copper' | 'aluminium';
export type InstallationType = 'conduit' | 'tray' | 'underground' | 'open_air';

export interface WireCalcInput {
  current: number;
  voltage: number;
  phase: PhaseType;
  material: Material;
  length: number;
  installation: InstallationType;
  ambientTemp: number;
}

export interface WireCalcResult {
  cableSize: number;
  cableSizeLabel: string;
  awg: string;
  voltageDrop: number;
  voltageDropPercent: number;
  powerLoss: number;
  currentCapacity: number;
  mcbRating: number;
  mccbRating: number;
  resistance: number;
  deratedCapacity: number;
  utilizationPercent: number;
}

export type CTApplicationType = 'Metering' | 'Protection' | 'Energy Monitoring';

export interface CTCalcInput {
  loadCurrent: number;
  applicationType: CTApplicationType;
  secondaryCurrent?: number;
}

export interface CTCalcResult {
  ratio: string;
  ratioNumeric: number;
  coreType: string;
  accuracyClass: string;
  accuracyClassDescription: string;
  kneePointVoltage: number;
  recommendedModel: string;
  secondaryCurrent: number;
  primaryRatedCurrent: number;
  burdenVA: number;
  applicationType: CTApplicationType;
}

export interface PriceCalcInput {
  cableSize: number;
  material: Material;
  length: number;
  quantity: number;
}

export interface PriceCalcResult {
  unitPrice: number;
  totalPrice: number;
  copperWeight: number;
  pricePerMeter: number;
}

export interface SavedCalculation {
  id: string;
  type: 'wire' | 'ct' | 'price';
  name: string;
  date: string;
  input: WireCalcInput | CTCalcInput | PriceCalcInput;
  result: WireCalcResult | CTCalcResult | PriceCalcResult;
}

export interface Settings {
  voltageDropLimit: number;
  ambientTemp: number;
  material: Material;
  phase: PhaseType;
  currency: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  autoSave: boolean;
}
