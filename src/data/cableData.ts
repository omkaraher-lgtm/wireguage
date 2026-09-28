import type { InstallationType, Material } from '@/types';
export interface CableSpec {
  size: number;
  label: string;
  awg: string;
  resistanceCopper: number;
  resistanceAluminium: number;
  capacityCopper: Record<InstallationType, number>;
  capacityAluminium: Record<InstallationType, number>;
  pricePerMeterCopper: number;
  pricePerMeterAluminium: number;
  weightCopper: number;
  weightAluminium: number;
}

export const cableSpecs: CableSpec[] = [
  {
    size: 1,
    label: '1 mm²',
    awg: '18 AWG',
    resistanceCopper: 18.1,
    resistanceAluminium: 28.2,
    capacityCopper: { conduit: 14, tray: 16, underground: 18, open_air: 19 },
    capacityAluminium: { conduit: 11, tray: 12.5, underground: 14, open_air: 15 },
    pricePerMeterCopper: 1.8,
    pricePerMeterAluminium: 1.0,
    weightCopper: 0.0089,
    weightAluminium: 0.0027,
  },
  {
    size: 1.5,
    label: '1.5 mm²',
    awg: '16 AWG',
    resistanceCopper: 12.1,
    resistanceAluminium: 19.4,
    capacityCopper: { conduit: 17.5, tray: 20, underground: 22, open_air: 23 },
    capacityAluminium: { conduit: 13.5, tray: 15.5, underground: 17, open_air: 18 },
    pricePerMeterCopper: 2.5,
    pricePerMeterAluminium: 1.5,
    weightCopper: 0.0134,
    weightAluminium: 0.0041,
  },
  {
    size: 2.5,
    label: '2.5 mm²',
    awg: '14 AWG',
    resistanceCopper: 7.41,
    resistanceAluminium: 12.1,
    capacityCopper: { conduit: 24, tray: 27, underground: 30, open_air: 32 },
    capacityAluminium: { conduit: 18.5, tray: 21, underground: 23, open_air: 25 },
    pricePerMeterCopper: 3.8,
    pricePerMeterAluminium: 2.2,
    weightCopper: 0.0223,
    weightAluminium: 0.0068,
  },
  {
    size: 4,
    label: '4 mm²',
    awg: '12 AWG',
    resistanceCopper: 4.61,
    resistanceAluminium: 7.41,
    capacityCopper: { conduit: 32, tray: 36, underground: 40, open_air: 43 },
    capacityAluminium: { conduit: 25, tray: 28, underground: 31, open_air: 33 },
    pricePerMeterCopper: 5.5,
    pricePerMeterAluminium: 3.2,
    weightCopper: 0.0357,
    weightAluminium: 0.0108,
  },
  {
    size: 6,
    label: '6 mm²',
    awg: '10 AWG',
    resistanceCopper: 3.08,
    resistanceAluminium: 4.61,
    capacityCopper: { conduit: 41, tray: 46, underground: 51, open_air: 55 },
    capacityAluminium: { conduit: 32, tray: 36, underground: 40, open_air: 43 },
    pricePerMeterCopper: 8.0,
    pricePerMeterAluminium: 4.5,
    weightCopper: 0.0535,
    weightAluminium: 0.0162,
  },
  {
    size: 10,
    label: '10 mm²',
    awg: '8 AWG',
    resistanceCopper: 1.83,
    resistanceAluminium: 3.08,
    capacityCopper: { conduit: 57, tray: 63, underground: 70, open_air: 75 },
    capacityAluminium: { conduit: 44, tray: 49, underground: 54, open_air: 58 },
    pricePerMeterCopper: 12.0,
    pricePerMeterAluminium: 7.0,
    weightCopper: 0.0892,
    weightAluminium: 0.0270,
  },
  {
    size: 16,
    label: '16 mm²',
    awg: '6 AWG',
    resistanceCopper: 1.15,
    resistanceAluminium: 1.91,
    capacityCopper: { conduit: 76, tray: 85, underground: 94, open_air: 100 },
    capacityAluminium: { conduit: 59, tray: 66, underground: 73, open_air: 78 },
    pricePerMeterCopper: 18.0,
    pricePerMeterAluminium: 10.5,
    weightCopper: 0.1428,
    weightAluminium: 0.0432,
  },
  {
    size: 25,
    label: '25 mm²',
    awg: '4 AWG',
    resistanceCopper: 0.727,
    resistanceAluminium: 1.20,
    capacityCopper: { conduit: 101, tray: 112, underground: 124, open_air: 133 },
    capacityAluminium: { conduit: 78, tray: 87, underground: 96, open_air: 103 },
    pricePerMeterCopper: 28.0,
    pricePerMeterAluminium: 16.0,
    weightCopper: 0.2235,
    weightAluminium: 0.0676,
  },
  {
    size: 35,
    label: '35 mm²',
    awg: '2 AWG',
    resistanceCopper: 0.524,
    resistanceAluminium: 0.868,
    capacityCopper: { conduit: 125, tray: 138, underground: 153, open_air: 164 },
    capacityAluminium: { conduit: 97, tray: 108, underground: 119, open_air: 128 },
    pricePerMeterCopper: 38.0,
    pricePerMeterAluminium: 22.0,
    weightCopper: 0.3129,
    weightAluminium: 0.0946,
  },
  {
    size: 50,
    label: '50 mm²',
    awg: '1/0 AWG',
    resistanceCopper: 0.387,
    resistanceAluminium: 0.641,
    capacityCopper: { conduit: 151, tray: 168, underground: 186, open_air: 199 },
    capacityAluminium: { conduit: 117, tray: 131, underground: 145, open_air: 155 },
    pricePerMeterCopper: 55.0,
    pricePerMeterAluminium: 32.0,
    weightCopper: 0.4470,
    weightAluminium: 0.1352,
  },
  {
    size: 70,
    label: '70 mm²',
    awg: '2/0 AWG',
    resistanceCopper: 0.268,
    resistanceAluminium: 0.443,
    capacityCopper: { conduit: 192, tray: 213, underground: 236, open_air: 253 },
    capacityAluminium: { conduit: 149, tray: 166, underground: 184, open_air: 197 },
    pricePerMeterCopper: 75.0,
    pricePerMeterAluminium: 44.0,
    weightCopper: 0.6258,
    weightAluminium: 0.1893,
  },
  {
    size: 95,
    label: '95 mm²',
    awg: '3/0 AWG',
    resistanceCopper: 0.193,
    resistanceAluminium: 0.320,
    capacityCopper: { conduit: 232, tray: 258, underground: 285, open_air: 306 },
    capacityAluminium: { conduit: 180, tray: 201, underground: 222, open_air: 238 },
    pricePerMeterCopper: 105.0,
    pricePerMeterAluminium: 62.0,
    weightCopper: 0.8493,
    weightAluminium: 0.2570,
  },
  {
    size: 120,
    label: '120 mm²',
    awg: '4/0 AWG',
    resistanceCopper: 0.153,
    resistanceAluminium: 0.253,
    capacityCopper: { conduit: 269, tray: 299, underground: 330, open_air: 354 },
    capacityAluminium: { conduit: 209, tray: 233, underground: 257, open_air: 276 },
    pricePerMeterCopper: 135.0,
    pricePerMeterAluminium: 80.0,
    weightCopper: 1.0731,
    weightAluminium: 0.3246,
  },
  {
    size: 150,
    label: '150 mm²',
    awg: '300 kcmil',
    resistanceCopper: 0.124,
    resistanceAluminium: 0.206,
    capacityCopper: { conduit: 309, tray: 343, underground: 379, open_air: 407 },
    capacityAluminium: { conduit: 240, tray: 267, underground: 295, open_air: 317 },
    pricePerMeterCopper: 170.0,
    pricePerMeterAluminium: 100.0,
    weightCopper: 1.3413,
    weightAluminium: 0.4057,
  },
  {
    size: 185,
    label: '185 mm²',
    awg: '350 kcmil',
    resistanceCopper: 0.0991,
    resistanceAluminium: 0.164,
    capacityCopper: { conduit: 353, tray: 392, underground: 433, open_air: 465 },
    capacityAluminium: { conduit: 274, tray: 305, underground: 337, open_air: 362 },
    pricePerMeterCopper: 210.0,
    pricePerMeterAluminium: 125.0,
    weightCopper: 1.6543,
    weightAluminium: 0.5004,
  },
  {
    size: 240,
    label: '240 mm²',
    awg: '500 kcmil',
    resistanceCopper: 0.0754,
    resistanceAluminium: 0.125,
    capacityCopper: { conduit: 415, tray: 461, underground: 509, open_air: 546 },
    capacityAluminium: { conduit: 322, tray: 359, underground: 396, open_air: 426 },
    pricePerMeterCopper: 270.0,
    pricePerMeterAluminium: 160.0,
    weightCopper: 2.1461,
    weightAluminium: 0.6492,
  },
  {
    size: 300,
    label: '300 mm²',
    awg: '600 kcmil',
    resistanceCopper: 0.0601,
    resistanceAluminium: 0.100,
    capacityCopper: { conduit: 477, tray: 530, underground: 585, open_air: 628 },
    capacityAluminium: { conduit: 370, tray: 412, underground: 455, open_air: 489 },
    pricePerMeterCopper: 340.0,
    pricePerMeterAluminium: 200.0,
    weightCopper: 2.6827,
    weightAluminium: 0.8115,
  },
  {
    size: 400,
    label: '400 mm²',
    awg: '800 kcmil',
    resistanceCopper: 0.0470,
    resistanceAluminium: 0.0778,
    capacityCopper: { conduit: 546, tray: 606, underground: 669, open_air: 718 },
    capacityAluminium: { conduit: 423, tray: 470, underground: 519, open_air: 557 },
    pricePerMeterCopper: 440.0,
    pricePerMeterAluminium: 260.0,
    weightCopper: 3.5769,
    weightAluminium: 1.0820,
  },
];

export const standardMCBs = [1, 2, 3, 4, 6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
export const standardMCCBs = [16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500, 630, 800];

export interface CTAccuracyClass {
  class: string;
  description: string;
  application: 'Metering' | 'Protection' | 'Energy Monitoring';
  coreType: string;
}

export const ctAccuracyClasses: CTAccuracyClass[] = [
  { class: '0.2S', description: 'Revenue Metering — high-precision tariff/billing', application: 'Metering', coreType: 'Metering Core' },
  { class: '0.2', description: 'Precision metering (tariff/billing)', application: 'Metering', coreType: 'Metering Core' },
  { class: '0.5', description: 'Standard Metering — commercial/industrial', application: 'Metering', coreType: 'Metering Core' },
  { class: '1.0', description: 'Industrial metering', application: 'Metering', coreType: 'Metering Core' },
  { class: '3.0', description: 'General indication/measurement', application: 'Metering', coreType: 'Metering Core' },
  { class: '0.2S', description: 'Energy Monitoring — revenue-grade sub-metering', application: 'Energy Monitoring', coreType: 'Measurement Core' },
  { class: '0.5', description: 'Energy Monitoring — standard sub-metering', application: 'Energy Monitoring', coreType: 'Measurement Core' },
  { class: '5P10', description: 'Protection — 5% accuracy at 10x rated current', application: 'Protection', coreType: 'Protection Core' },
  { class: '10P10', description: 'Protection — 10% accuracy at 10x rated current', application: 'Protection', coreType: 'Protection Core' },
];

export const ctApplications = [
  'Metering',
  'Protection',
  'Energy Monitoring',
];

export function getCableBySize(size: number): CableSpec | undefined {
  return cableSpecs.find((c) => c.size === size);
}

export interface CablePriceEntry {
  size: number;
  label: string;
  awg: string;
  pricePerMeterCopper: number;
  pricePerMeterAluminium: number;
}

export const cablePriceDatabase: CablePriceEntry[] = cableSpecs.map((c) => ({
  size: c.size,
  label: c.label,
  awg: c.awg,
  pricePerMeterCopper: c.pricePerMeterCopper,
  pricePerMeterAluminium: c.pricePerMeterAluminium,
}));

export function searchCablePrices(query: string, material: Material): CablePriceEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return cablePriceDatabase;
  return cablePriceDatabase.filter((entry) => {
    const price = material === 'copper' ? entry.pricePerMeterCopper : entry.pricePerMeterAluminium;
    return (
      entry.label.toLowerCase().includes(q) ||
      entry.awg.toLowerCase().includes(q) ||
      String(entry.size).includes(q) ||
      String(price).includes(q)
    );
  });
}

export function getPricePerMeter(size: number, material: Material): number | undefined {
  const entry = cablePriceDatabase.find((e) => e.size === size);
  if (!entry) return undefined;
  return material === 'copper' ? entry.pricePerMeterCopper : entry.pricePerMeterAluminium;
}
