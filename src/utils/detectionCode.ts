// ============================================================
// ReBuild — Detection Code Utility
// ============================================================
//
// Detection Code format:
//   [STATE]-[YEAR]-[DISTRICT CODE 4 digits][SEQUENCE 2 digits][DATE/MONTH 2 digits]
//
// Example:  CG-2026-00152608
//   CG   = Chhattisgarh
//   2026 = Detection year
//   0015 = District code (4 digits, zero-padded)
//   26   = 2-digit sequence
//   08   = Date/month component
//
// The code is deterministic — given the same inputs it always
// returns the same string, so passport IDs stay stable on re-render.
// ============================================================

export interface DetectionCodeParams {
  /** Two-letter state short code, e.g. "CG" */
  stateCode: string;
  /** Detection year, e.g. 2026 */
  year: number;
  /** District code, exactly 4 numeric characters, e.g. "0015" */
  districtCode: string;
  /** 2-digit detection sequence, e.g. "26" */
  sequence: string;
  /** 2-digit date/month component, e.g. "08" */
  dateMonth: string;
}

/**
 * Generates a stable, human-readable Detection Code from structured params.
 *
 * @example
 * generateDetectionCode({ stateCode: "CG", year: 2026, districtCode: "0015", sequence: "26", dateMonth: "08" })
 * // → "CG-2026-00152608"
 */
export function generateDetectionCode(params: DetectionCodeParams): string {
  const { stateCode, year, districtCode, sequence, dateMonth } = params;

  // Normalise inputs
  const state = stateCode.toUpperCase().slice(0, 2).padEnd(2, 'X');
  const yr = String(year);
  const dist = districtCode.padStart(4, '0').slice(0, 4);
  const seq = sequence.padStart(2, '0').slice(0, 2);
  const dm = dateMonth.padStart(2, '0').slice(0, 2);

  return `${state}-${yr}-${dist}${seq}${dm}`;
}

// ─── Supported State Codes ────────────────────────────────────
export const STATE_CODES: Record<string, string> = {
  CG: 'Chhattisgarh',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  DL: 'Delhi',
  UP: 'Uttar Pradesh',
  RJ: 'Rajasthan',
  GJ: 'Gujarat',
  WB: 'West Bengal',
  OD: 'Odisha',
  JH: 'Jharkhand',
  BR: 'Bihar',
  KA: 'Karnataka',
  TN: 'Tamil Nadu',
  TS: 'Telangana',
  AP: 'Andhra Pradesh',
  KL: 'Kerala',
  PB: 'Punjab',
  HR: 'Haryana',
  UK: 'Uttarakhand',
  HP: 'Himachal Pradesh',
  JK: 'Jammu & Kashmir',
  AS: 'Assam',
  AR: 'Arunachal Pradesh',
  GA: 'Goa',
};

// ─── Pre-defined demo Detection Codes ────────────────────────
//
// These are deterministic, stable values used throughout the
// ReBuild demo scenario. They must NOT change between renders.
//
// CG-2026-00152608  ← primary demo (replaces RB-2026-00482)
// CG-2026-00390311  ← replaces RB-2026-00391
// CG-2026-00517114  ← replaces RB-2026-00517
// MP-2026-00602215  ← replaces RB-2026-00602
// MH-2026-00448309  ← replaces RB-2026-00448
// OD-2026-00581206  ← replaces RB-2026-00581

export const DEMO_CODES = {
  /** Primary steel batch — formerly RB-2026-00482 */
  CG_STEEL: generateDetectionCode({ stateCode: 'CG', year: 2026, districtCode: '0015', sequence: '26', dateMonth: '08' }),
  /** Structural steel beams — formerly RB-2026-00391 */
  CG_STEEL_BEAMS: generateDetectionCode({ stateCode: 'CG', year: 2026, districtCode: '0039', sequence: '03', dateMonth: '11' }),
  /** Timber beams — formerly RB-2026-00517 */
  CG_TIMBER: generateDetectionCode({ stateCode: 'CG', year: 2026, districtCode: '0051', sequence: '71', dateMonth: '14' }),
  /** Brick/masonry — formerly RB-2026-00602 */
  MP_BRICK: generateDetectionCode({ stateCode: 'MP', year: 2026, districtCode: '0060', sequence: '22', dateMonth: '15' }),
  /** Concrete rubble — formerly RB-2026-00448 */
  MH_CONCRETE: generateDetectionCode({ stateCode: 'MH', year: 2026, districtCode: '0044', sequence: '83', dateMonth: '09' }),
  /** Mixed plastic/waste — formerly RB-2026-00581 */
  OD_WASTE: generateDetectionCode({ stateCode: 'OD', year: 2026, districtCode: '0058', sequence: '12', dateMonth: '06' }),
} as const;

/** Helper: parse a Detection Code back into its component parts (best-effort). */
export function parseDetectionCode(code: string): {
  stateCode: string;
  stateName: string;
  year: string;
  districtCode: string;
  sequence: string;
  dateMonth: string;
} | null {
  const m = code.match(/^([A-Z]{2})-(\d{4})-(\d{4})(\d{2})(\d{2})$/);
  if (!m) return null;
  return {
    stateCode: m[1],
    stateName: STATE_CODES[m[1]] ?? 'Unknown State',
    year: m[2],
    districtCode: m[3],
    sequence: m[4],
    dateMonth: m[5],
  };
}
