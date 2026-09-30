// ============================================================
// ReBuild – Core Type Definitions
// ============================================================

export type ClearancePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type InspectionStatus = 'NOT_STARTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'RESTRICTED';
export type MaterialCondition = 'GOOD' | 'FAIR' | 'POOR' | 'HAZARDOUS' | 'UNKNOWN';
export type RecoveryStatus =
  | 'DETECTED'
  | 'MAPPED'
  | 'POTENTIALLY_RECOVERABLE'
  | 'UNDER_INSPECTION'
  | 'TESTING_REQUIRED'
  | 'APPROVED_SPECIFIC_REUSE'
  | 'RESTRICTED'
  | 'HAZARDOUS'
  | 'RECOVERED'
  | 'PROCESSED';

export type OperationStatus = 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type OperationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type UserRole = 'COMMAND_OFFICER' | 'FIELD_INSPECTOR' | 'RECOVERY_COORDINATOR';

export type AlertLevel = 'CRITICAL' | 'WARNING' | 'INFO' | 'RECOVERY';

// ─── Debris Site ──────────────────────────────────────────────
export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface MaterialClassification {
  material: string;
  percentage: number;
  estimatedTonnes: number;
}

export interface HazardIndicator {
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface DebrisSite {
  id: string;                          // e.g. RB-DS-014
  zone: string;                        // e.g. Sector B-12
  geoPoint: GeoPoint;
  estimatedTonnes: number;
  materials: MaterialClassification[];
  hazards: HazardIndicator[];
  clearancePriority: ClearancePriority;
  inspectionStatus: InspectionStatus;
  aiConfidence: number;                // 0–100
  reason: string;
  blockedRoute: boolean;
  imageUrl?: string;
  lastUpdated: string;                 // ISO date string
  assignedTeam?: string;
}

// ─── Material Batch / Salvage Passport ───────────────────────
export interface TimelineEvent {
  stage: string;
  date: string | null;
  completed: boolean;
  notes?: string;
}

export interface SalvagePassport {
  batchId: string;                     // e.g. RB-2026-00482
  material: string;
  estimatedQuantity: string;
  quantityUnit: string;
  sourceDebrisSiteId: string;
  sourceName: string;
  gpsCoordinates: string;
  zone: string;
  aiClassificationConfidence: number;
  visualInspection: InspectionStatus;
  materialTesting: InspectionStatus;
  structuralAssessment: InspectionStatus;
  approvedUse: string | null;
  approvalAuthority?: string;
  approvalDate?: string;
  currentLocation: string;
  recoveryStatus: RecoveryStatus;
  condition: MaterialCondition;
  hazardous: boolean;
  timeline: TimelineEvent[];
  inspectionNotes?: string;
  inspectorName?: string;
  testingResults?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Recovery Requirement ─────────────────────────────────────
export interface RecoveryRequirement {
  id: string;
  projectName: string;
  organization: string;
  requiredMaterial: string;
  quantityNeeded: string;
  quantityUnit: string;
  purpose: string;
  location: string;
  urgency: ClearancePriority;
  contactPerson: string;
  contactInfo: string;
  submittedDate: string;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';
}

// ─── Material Match ───────────────────────────────────────────
export interface MaterialMatch {
  id: string;
  passportBatchId: string;
  requirementId: string;
  matchScore: number;        // 0–100
  reasons: string[];
  warnings: string[];
  status: 'POTENTIAL' | 'UNDER_REVIEW' | 'CONFIRMED' | 'REJECTED';
  reviewedBy?: string;
  reviewDate?: string;
}

// ─── Recovery Operation ───────────────────────────────────────
export interface RecoveryOperation {
  id: string;
  name: string;
  type: 'CLEARANCE' | 'INSPECTION' | 'TRANSPORT' | 'RECOVERY' | 'ASSESSMENT';
  priority: OperationPriority;
  status: OperationStatus;
  assignedTeam: string;
  relatedSiteId?: string;
  relatedBatchId?: string;
  startDate: string;
  estimatedCompletion: string;
  progressPercent: number;
  description: string;
  notes?: string;
}

// ─── Notification / Alert ─────────────────────────────────────
export interface AppNotification {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
  relatedType?: 'SITE' | 'BATCH' | 'OPERATION';
}

// ─── KPI Summary ─────────────────────────────────────────────
export interface DashboardKPIs {
  affectedZones: number;
  debrisSites: number;
  criticalClearance: number;
  potentialRecoveryBatches: number;
  underInspection: number;
  verifiedBatches: number;
  hazardousIsolated: number;
  operationsActive: number;
}

// ─── Role ────────────────────────────────────────────────────
export interface UserProfile {
  name: string;
  role: UserRole;
  unit: string;
}
