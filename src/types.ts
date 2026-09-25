export type UserRole = 'Researcher' | 'Policymaker' | 'Admin' | 'Citizen';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  state?: string;
  district?: string;
  designation?: string;
  avatarUrl?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: string;
  year: number;
  journal: string;
  doi: string;
  keywords: string[];
  citationCount: number;
  downloads: number;
  views: number;
  pdfUrl?: string;
  datasetsUsed: string[];
  topic: string;
  relevanceScore?: number;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  category: 'Land Records' | 'Satellite' | 'Climate' | 'Socio-Economic' | 'Infrastructure' | 'Policies';
  dataType: 'Raster' | 'Vector' | 'CSV' | 'Database' | 'GeoJSON';
  geographicCoverage: string;
  timeCoverageStart: string;
  timeCoverageEnd: string;
  sizeMb: number;
  recordsCount: number;
  lastUpdated: string;
  source: string;
  accessLevel: 'Public' | 'Authenticated' | 'Policymakers' | 'RestrictedToAdmin';
  previewData: {
    headers: string[];
    sampleRecords: Record<string, any>[];
  };
  statistics?: {
    summaryMetrics: { label: string; value: string }[];
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  sourceState: string;
  sourceDistrict?: string;
  problemStatement: string;
  solutionImplemented: string;
  durationMonths: number;
  costCrores: number;
  disputeReductionPercent: number;
  resolutionTimeReductionPercent: number;
  outcomes: {
    disputeReductionPercent?: number;
    resolutionTimeDays?: number;
    digitalCoveragePercent?: number;
    costPerCaseInr?: number;
    citizenSatisfactionPercent?: number;
    [key: string]: any;
  };
  startDate: string;
  endDate: string;
  keySuccessFactors: string[];
  lessonsLearned: string[];
  similarProblems: string[];
  publicationReferences?: string[];
  featured?: boolean;
}

export interface SimulationParams {
  baseCaseStudies: string[];
  budgetCrores: number;
  timelineYears: number;
  targetDisputeReduction: number;
  district: string;
  state: string;
  includeDigitization: boolean;
  surveyCompletionTarget: number;
  mediationCenters: number;
  trainingBudgetCrores: number;
}

export interface SimulationResult {
  id: string;
  params: SimulationParams;
  predictedDisputeReduction: number; // e.g. 55%
  confidenceScore: number; // e.g. 85%
  predictedResolutionTimeReduction: number; // e.g. 45%
  predictedNewDisputesYear3: number;
  costPerCaseResolved: number;
  timelineProgression: {
    month: number;
    disputeReductionPct: number;
    activeCases: number;
    milestone: string;
  }[];
  scenarios: {
    doNothing: { disputeChange: string; outcomeDescription: string };
    singleProgram: { disputeReductionPct: number; outcomeDescription: string };
    proposedCombined: { disputeReductionPct: number; outcomeDescription: string };
  };
  riskAssessment: {
    implementationRisk: 'Low' | 'Medium' | 'High';
    fundingRisk: 'Low' | 'Medium' | 'High';
    adoptionRisk: 'Low' | 'Medium' | 'High';
    mitigationStrategy: string;
  };
  similarHistoricalCasesCount: number;
  createdAt: string;
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  creatorName: string;
  state: string;
  district: string;
  category: string;
  status: 'Draft' | 'Approved' | 'Implementing' | 'Completed';
  approvalDate: string;
  implementationStart: string;
  timelineMonths: number;
  budgetCrores: number;
  spentCrores: number;
  expectedOutcomes: {
    disputeReductionPct: number;
    resolutionTimeImprovementPct: number;
    satisfactionTargetPct: number;
  };
  actualOutcomes: {
    disputesCurrent: number;
    disputesBaseline: number;
    currentReductionPct: number;
    resolutionTimeCurrentYears: number;
    resolutionTimeBaselineYears: number;
    satisfactionCurrentPct: number;
  };
  simulationResults?: SimulationResult;
  responsibleDepartments: string[];
  caseStudiesBasedOn: string[];
  milestones: {
    id: string;
    phase: string;
    title: string;
    targetMonth: number;
    status: 'Completed' | 'In Progress' | 'Upcoming';
    progressPct: number;
  }[];
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  creatorName: string;
  members: { name: string; role: string; email: string }[];
  datasetsAdded: string[];
  papersAdded: string[];
  notes: { id: string; author: string; text: string; date: string }[];
  status: 'Active' | 'Completed' | 'Archived';
  createdAt: string;
  publishedPaperId?: string;
}

export interface DistrictGISData {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  pendingDisputes: number;
  disputeTrendYoY: number; // percentage e.g. +12
  avgResolutionYears: number;
  landUse: {
    year1995: { urbanPct: number; agPct: number; forestPct: number; otherPct: number };
    year2005: { urbanPct: number; agPct: number; forestPct: number; otherPct: number };
    year2015: { urbanPct: number; agPct: number; forestPct: number; otherPct: number };
    year2025: { urbanPct: number; agPct: number; forestPct: number; otherPct: number };
  };
  urbanLossRatePerYear: number;
  cadastralDigitizedPct: number;
  activeMediationCenters: number;
  vulnerabilityIndex: 'High' | 'Moderate' | 'Low';
}
