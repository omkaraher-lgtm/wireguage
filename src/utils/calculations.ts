import type {
  WireCalcInput,
  WireCalcResult,
  CTCalcInput,
  CTCalcResult,
  PriceCalcInput,
  PriceCalcResult,
  Material,
  PhaseType,
  CTApplicationType,
} from '@/types';
import { cableSpecs, standardMCBs, standardMCCBs, getCableBySize, getPricePerMeter } from '@/data/cableData';

function temperatureDeratingFactor(ambientTemp: number, baseTemp = 30): number {
  if (ambientTemp <= baseTemp) return 1.0;
  const excess = ambientTemp - baseTemp;
  return Math.max(0.82, 1 - excess * 0.005);
}

export const CURRENT_DENSITY: Record<Material, number> = {
  copper: 6,
  aluminium: 4,
};

export function calculateCableSize(current: number, material: Material): number {
  const density = CURRENT_DENSITY[material];
  return current / density;
}

export function selectCableBySize(requiredSize: number): typeof cableSpecs[number] {
  return cableSpecs.find((c) => c.size >= requiredSize) ?? cableSpecs[cableSpecs.length - 1];
}

export function selectCableByCurrent(current: number, material: Material, installation: string): typeof cableSpecs[number] | undefined {
  return cableSpecs.find((c) => {
    const base = material === 'copper' ? c.capacityCopper : c.capacityAluminium;
    const cap = base[installation as keyof typeof base];
    return cap >= current;
  });
}

export function calculateVoltageDrop(
  current: number,
  length: number,
  resistance: number,
  phase: PhaseType,
): number {
  if (phase === 'three') {
    return (Math.sqrt(3) * length * current * resistance) / 1000;
  }
  return (2 * length * current * resistance) / 1000;
}

export function calculatePowerLoss(
  current: number,
  resistance: number,
  length: number,
  conductors: number,
): number {
  const rTotal = (resistance * length) / 1000;
  return conductors * current * current * rTotal;
}

export function calculateWire(params: WireCalcInput): WireCalcResult {
  const { current, voltage, phase, material, length, installation, ambientTemp } = params;
  const deratingFactor = temperatureDeratingFactor(ambientTemp);

  const theoreticalSize = calculateCableSize(current, material);
  const suitableCable = selectCableBySize(theoreticalSize);

  const baseCap = material === 'copper'
    ? suitableCable.capacityCopper[installation]
    : suitableCable.capacityAluminium[installation];

  const deratedCapacity = baseCap * deratingFactor;
  const resistance = material === 'copper'
    ? suitableCable.resistanceCopper
    : suitableCable.resistanceAluminium;

  const conductors = phase === 'three' ? 3 : 2;
  const voltageDrop = calculateVoltageDrop(current, length, resistance, phase);
  const voltageDropPercent = (voltageDrop / voltage) * 100;
  const powerLoss = calculatePowerLoss(current, resistance, length, conductors);

  const mcbRating = standardMCBs.find((r) => r >= current) ?? Math.ceil(current);
  const mccbRating = standardMCCBs.find((r) => r >= current) ?? Math.ceil(current);

  return {
    cableSize: suitableCable.size,
    cableSizeLabel: suitableCable.label,
    awg: suitableCable.awg,
    voltageDrop,
    voltageDropPercent,
    powerLoss,
    currentCapacity: baseCap,
    deratedCapacity,
    mcbRating,
    mccbRating,
    resistance,
    utilizationPercent: (current / deratedCapacity) * 100,
  };
}

export function getCTAccuracyClass(applicationType: CTApplicationType): string {
  switch (applicationType) {
    case 'Metering':
      return '0.5';
    case 'Protection':
      return '5P10';
    case 'Energy Monitoring':
      return '0.2S';
    default:
      return '0.5';
  }
}

export function getCTCoreType(applicationType: CTApplicationType): string {
  switch (applicationType) {
    case 'Metering':
      return 'Metering Core';
    case 'Protection':
      return 'Protection Core';
    case 'Energy Monitoring':
      return 'Measurement Core';
    default:
      return 'Metering Core';
  }
}

export function getCTBurden(applicationType: CTApplicationType, primaryRatedCurrent: number): number {
  const base = Math.ceil(primaryRatedCurrent / 100) * 2.5;
  switch (applicationType) {
    case 'Metering':
      return Math.max(5, base);
    case 'Protection':
      return Math.max(10, base * 2);
    case 'Energy Monitoring':
      return Math.max(5, base);
    default:
      return Math.max(5, base);
  }
}

export function getCTClassDescription(accuracyClass: string, applicationType: CTApplicationType): string {
  const descriptions: Record<string, string> = {
    '0.2S': 'Revenue Metering — high-precision tariff/billing grade',
    '0.2': 'Precision metering — tariff/billing applications',
    '0.5': 'Standard Metering — commercial/industrial metering',
    '1.0': 'Industrial metering — general purpose',
    '3.0': 'General indication/measurement — low accuracy',
    '5P10': 'Protection — 5% accuracy at 10x rated current (ALF=10)',
    '10P10': 'Protection — 10% accuracy at 10x rated current (ALF=10)',
  };
  return descriptions[accuracyClass] ?? `${applicationType} class ${accuracyClass}`;
}

export function calculateCT(params: CTCalcInput): CTCalcResult {
  const { loadCurrent, applicationType, secondaryCurrent = 5 } = params;

  const primaryRatedCurrent = Math.ceil((loadCurrent * 1.2) / 5) * 5;
  const ratioNumeric = Math.round(primaryRatedCurrent / secondaryCurrent);
  const ratio = `${ratioNumeric}:${secondaryCurrent}`;

  const accuracyClass = getCTAccuracyClass(applicationType);
  const coreType = getCTCoreType(applicationType);
  const burdenVA = getCTBurden(applicationType, primaryRatedCurrent);

  const alf = applicationType === 'Protection' ? 10 : 2;
  const kneePointVoltage = Math.ceil(
    (primaryRatedCurrent / ratioNumeric) * (burdenVA + 1.2) * alf * 1.2,
  );

  const modelPrefix = applicationType === 'Protection' ? 'P' : 'M';
  const recommendedModel = `CT-${modelPrefix}${ratioNumeric}-${secondaryCurrent}A-${accuracyClass}`;

  return {
    ratio,
    ratioNumeric,
    coreType,
    accuracyClass,
    accuracyClassDescription: getCTClassDescription(accuracyClass, applicationType),
    kneePointVoltage,
    recommendedModel,
    secondaryCurrent,
    primaryRatedCurrent,
    burdenVA,
    applicationType,
  };
}

export function calculatePrice(params: PriceCalcInput): PriceCalcResult {
  const { cableSize, material, length, quantity } = params;
  const cable = getCableBySize(cableSize) ?? cableSpecs[0];
  const pricePerMeter = getPricePerMeter(cable.size, material) ?? (
    material === 'copper' ? cable.pricePerMeterCopper : cable.pricePerMeterAluminium
  );
  const weight = material === 'copper'
    ? cable.weightCopper
    : cable.weightAluminium;

  const unitPrice = pricePerMeter * length;
  const totalPrice = unitPrice * quantity;
  const copperWeight = weight * length * quantity;

  return {
    unitPrice,
    totalPrice,
    copperWeight,
    pricePerMeter,
  };
}
