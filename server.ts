import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  SEED_USERS,
  SEED_PAPERS,
  SEED_DATASETS,
  SEED_CASE_STUDIES,
  SEED_DISTRICTS,
  SEED_PROJECTS,
  SEED_POLICIES,
} from './src/data/seedData';
import { ResearchPaper, Policy, ResearchProject, SimulationResult, SimulationParams, User } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-Memory Database store initialized from seeds
let users: User[] = [...SEED_USERS];
let papers: ResearchPaper[] = [...SEED_PAPERS];
let datasets = [...SEED_DATASETS];
let caseStudies = [...SEED_CASE_STUDIES];
let districts = [...SEED_DISTRICTS];
let projects: ResearchProject[] = [...SEED_PROJECTS];
let policies: Policy[] = [...SEED_POLICIES];
let simulations: Record<string, SimulationResult> = {};

// Active session token store
let currentSessions: Record<string, User> = {
  'demo-token-researcher': users[0],
  'demo-token-policymaker': users[1],
  'demo-token-admin': users[2],
  'demo-token-citizen': users[3],
};

// Current active default user for prototype
let activeUser: User = users[1]; // default to Mr. Rajesh Patel (Policymaker) for immediate demo-readiness

// Helper to authenticate
function getAuthenticatedUser(req: Request): User {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (currentSessions[token]) {
      return currentSessions[token];
    }
  }
  return activeUser;
}

// ==========================================
// AUTHENTICATION APIS
// ==========================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  let user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user && role) {
    user = users.find((u) => u.role === role);
  }
  
  if (!user && email) {
    // If not existing, create a researcher or citizen session
    user = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role: (role as any) || 'Researcher',
      designation: 'Registered Researcher',
    };
    users.push(user);
  }

  if (!user) {
    user = users[0];
  }

  activeUser = user;
  const token = `token-${user.id}-${Date.now()}`;
  currentSessions[token] = user;

  res.json({
    success: true,
    data: {
      accessToken: token,
      user,
    },
    message: `Welcome ${user.fullName} (${user.role})`,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  res.json({
    success: true,
    data: user,
  });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role, userId } = req.body;
  let targetUser = users.find((u) => u.id === userId || u.role === role);
  if (!targetUser) {
    targetUser = users.find((u) => u.role === role) || users[0];
  }
  activeUser = targetUser;
  res.json({
    success: true,
    data: activeUser,
    message: `Switched active role to ${activeUser.role} (${activeUser.fullName})`,
  });
});

// ==========================================
// RESEARCH PAPERS APIS (WITH SEMANTIC SEARCH)
// ==========================================

// Semantic topic keywords dictionary for enhanced semantic discovery
const SEMANTIC_CLUSTERS: Record<string, string[]> = {
  dispute: ['dispute', 'litigation', 'mediation', 'lok adalat', 'conflict', 'court', 'adjudication', 'backlog', 'encroachment', 'resolution'],
  reduce: ['reduce', 'reduction', 'slashed', 'curbed', 'minimizing', 'preventing', 'fast-track', 'speedy', 'quick', 'rapid', 'streamline'],
  urban: ['urban', 'sprawl', 'peri-urban', 'expansion', 'conversion', 'real estate', 'speculative', 'growth', 'infrastructure'],
  agriculture: ['agriculture', 'agricultural', 'farmland', 'agrarian', 'crop', 'vineyard', 'farming', 'smallholder', 'soil', 'irrigation'],
  cadastral: ['cadastral', 'digitization', 'survey', 'drone', 'svamitva', 'orthorectified', 'patta', 'mutation', 'bhoomi', 'cors', 'gps'],
  climate: ['climate', 'drought', 'rainfall', 'precipitation', 'vulnerability', 'temperature', 'monsoon', 'adaptation', 'resilience'],
  forest: ['forest', 'canopy', 'fra', 'tribal', 'indigenous', 'customary', 'deforestation', 'conservation', 'biodiversity'],
};

function computeSemanticScore(paper: ResearchPaper, query: string): number {
  if (!query) return 100;
  const qTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  const paperText = `${paper.title} ${paper.abstract} ${paper.keywords.join(' ')} ${paper.topic}`.toLowerCase();

  // Exact match bonus
  for (const term of qTerms) {
    if (paperText.includes(term)) {
      score += 25;
    }
  }

  // Concept cluster expansion (Semantic similarity)
  for (const [clusterKey, synonyms] of Object.entries(SEMANTIC_CLUSTERS)) {
    const queryHasCluster = qTerms.some((t) => t.includes(clusterKey) || synonyms.some((s) => s.includes(t) || t.includes(s)));
    if (queryHasCluster) {
      const matchCount = synonyms.filter((s) => paperText.includes(s)).length;
      score += Math.min(matchCount * 12, 45);
    }
  }

  // Citation impact boost (popular high-quality papers rank appropriately)
  score += Math.min(Math.floor(paper.citationCount / 15), 20);

  return Math.min(score, 100);
}

app.get('/api/papers/search', (req: Request, res: Response) => {
  const query = ((req.query.q as string) || '').trim();
  const topic = (req.query.topic as string) || '';
  const yearFrom = parseInt((req.query.yearFrom as string) || '1995', 10);
  const yearTo = parseInt((req.query.yearTo as string) || '2026', 10);
  const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
  const limit = Math.max(1, parseInt((req.query.limit as string) || '15', 10));
  const sortBy = (req.query.sortBy as string) || 'relevance';

  let filtered = papers.filter((p) => {
    if (topic && topic !== 'all' && p.topic !== topic) return false;
    if (p.year < yearFrom || p.year > yearTo) return false;
    return true;
  });

  // Calculate dynamic semantic relevance score
  const scoredPapers = filtered.map((p) => ({
    ...p,
    relevanceScore: computeSemanticScore(p, query),
  }));

  if (query) {
    scoredPapers.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  } else if (sortBy === 'citations') {
    scoredPapers.sort((a, b) => b.citationCount - a.citationCount);
  } else if (sortBy === 'newest') {
    scoredPapers.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
  } else {
    scoredPapers.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  const totalCount = scoredPapers.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginated = scoredPapers.slice(startIndex, startIndex + limit);

  res.json({
    success: true,
    data: {
      results: paginated,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    },
    message: `Found ${totalCount} research papers for "${query || 'all topics'}"`,
  });
});

app.get('/api/papers/:id', (req: Request, res: Response) => {
  const paper = papers.find((p) => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ success: false, message: 'Research paper not found' });
  }
  // increment views
  paper.views += 1;
  res.json({ success: true, data: paper });
});

app.post('/api/papers/:id/download', (req: Request, res: Response) => {
  const paper = papers.find((p) => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ success: false, message: 'Research paper not found' });
  }
  paper.downloads += 1;
  res.json({
    success: true,
    data: {
      pdfUrl: `/downloads/${paper.id}.pdf`,
      paperTitle: paper.title,
      downloadCount: paper.downloads,
    },
    message: 'Paper downloaded successfully',
  });
});

app.get('/api/papers/:id/related', (req: Request, res: Response) => {
  const paper = papers.find((p) => p.id === req.params.id);
  if (!paper) return res.status(404).json({ success: false, message: 'Paper not found' });

  const related = papers
    .filter((p) => p.id !== paper.id && (p.topic === paper.topic || p.keywords.some((k) => paper.keywords.includes(k))))
    .slice(0, 4);

  res.json({ success: true, data: related });
});

app.post('/api/papers', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (user.role === 'Citizen') {
    return res.status(403).json({ success: false, message: 'Citizens cannot publish research papers' });
  }

  const { title, abstract, keywords, topic, datasetsUsed, journal } = req.body;
  if (!title || !abstract) {
    return res.status(400).json({ success: false, message: 'Title and abstract are required' });
  }

  const newPaper: ResearchPaper = {
    id: `paper-${Date.now()}`,
    title,
    abstract,
    authors: [user.fullName, 'National Research Contributor'],
    publicationDate: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear(),
    journal: journal || 'National Land Policy & Governance Innovation Portal',
    doi: `10.2139/kshetrax.${Date.now()}`,
    keywords: keywords || ['land governance', 'evidence-based policy'],
    citationCount: 1,
    downloads: 0,
    views: 12,
    datasetsUsed: datasetsUsed || ['ds-land-records-cadastral'],
    topic: topic || 'land_disputes',
    relevanceScore: 99,
  };

  papers.unshift(newPaper);

  res.json({
    success: true,
    data: newPaper,
    message: 'Research paper published and indexed successfully in semantic search!',
  });
});

// ==========================================
// DATASETS APIS
// ==========================================
app.get('/api/datasets', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let filtered = [...datasets];

  if (category && category !== 'All') {
    filtered = filtered.filter((d) => d.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    data: {
      datasets: filtered,
      totalCount: filtered.length,
    },
  });
});

app.get('/api/datasets/:id', (req: Request, res: Response) => {
  const dataset = datasets.find((d) => d.id === req.params.id);
  if (!dataset) {
    return res.status(404).json({ success: false, message: 'Dataset not found' });
  }
  res.json({ success: true, data: dataset });
});

app.get('/api/datasets/:id/preview', (req: Request, res: Response) => {
  const dataset = datasets.find((d) => d.id === req.params.id);
  if (!dataset) {
    return res.status(404).json({ success: false, message: 'Dataset not found' });
  }
  res.json({
    success: true,
    data: dataset.previewData,
    metadata: {
      recordsCount: dataset.recordsCount,
      sizeMb: dataset.sizeMb,
      lastUpdated: dataset.lastUpdated,
    },
  });
});

app.get('/api/datasets/:id/download', (req: Request, res: Response) => {
  const dataset = datasets.find((d) => d.id === req.params.id);
  if (!dataset) {
    return res.status(404).json({ success: false, message: 'Dataset not found' });
  }

  const format = (req.query.format as string) || 'csv';
  res.json({
    success: true,
    data: {
      datasetId: dataset.id,
      name: dataset.name,
      format,
      downloadUrl: `https://data.gov.in/kshetrax/${dataset.id}.${format}`,
      fileSizeMb: dataset.sizeMb,
      exportedAt: new Date().toISOString(),
    },
    message: `Generated export for ${dataset.name} in ${format.toUpperCase()} format.`,
  });
});

// ==========================================
// CASE STUDIES APIS
// ==========================================
app.get('/api/case-studies', (req: Request, res: Response) => {
  const { state, problem } = req.query;
  let filtered = [...caseStudies];

  if (state && state !== 'All') {
    filtered = filtered.filter((cs) => cs.sourceState.toLowerCase() === (state as string).toLowerCase());
  }

  if (problem) {
    const p = (problem as string).toLowerCase();
    filtered = filtered.filter(
      (cs) =>
        cs.title.toLowerCase().includes(p) ||
        cs.problemStatement.toLowerCase().includes(p) ||
        cs.similarProblems.some((sp) => sp.toLowerCase().includes(p))
    );
  }

  res.json({
    success: true,
    data: filtered,
    totalCount: filtered.length,
  });
});

app.get('/api/case-studies/:id', (req: Request, res: Response) => {
  const cs = caseStudies.find((c) => c.id === req.params.id);
  if (!cs) {
    return res.status(404).json({ success: false, message: 'Case study not found' });
  }
  res.json({ success: true, data: cs });
});

// ==========================================
// POLICY SIMULATION ENGINE (CASE-BASED + REGRESSION)
// ==========================================
app.post('/api/simulations', (req: Request, res: Response) => {
  const params: SimulationParams = req.body;
  const {
    baseCaseStudies = [],
    budgetCrores = 150,
    timelineYears = 3,
    targetDisputeReduction = 50,
    district = 'Nashik',
    state = 'Maharashtra',
    includeDigitization = true,
    surveyCompletionTarget = 90,
    mediationCenters = 8,
    trainingBudgetCrores = 15,
  } = params;

  // Retrieve selected case studies for case-based reasoning
  const selectedCases = caseStudies.filter((c) => baseCaseStudies.includes(c.id));
  const fallbackCase = caseStudies[0];
  const activeCases = selectedCases.length > 0 ? selectedCases : [fallbackCase];

  // Case-based baseline reduction
  const avgHistoricalReduction =
    activeCases.reduce((acc, curr) => acc + (curr.disputeReductionPercent || 40), 0) / activeCases.length;

  // Multi-attribute synergy coefficients
  let combinationSynergy = 1.0;
  if (baseCaseStudies.length >= 2) {
    combinationSynergy = 1.18; // Tamil Nadu + Pune combination synergy from spec
  }

  const budgetFactor = Math.min(Math.max(budgetCrores / 150, 0.6), 1.25);
  const surveyFactor = surveyCompletionTarget / 100;
  const mediationFactor = Math.min(mediationCenters / 6, 1.3);

  // Predicted dispute reduction % (calibrated to ~55% for the standard ₹150Cr / 3yr Nashik combination)
  let rawReduction =
    avgHistoricalReduction *
    combinationSynergy *
    (0.4 * budgetFactor + 0.35 * surveyFactor + 0.25 * mediationFactor);
  rawReduction = Math.min(Math.max(Math.round(rawReduction), 20), 85);

  // Confidence calculation based on case similarity & geographic matching
  let confidence = 75;
  if (activeCases.some((c) => c.sourceState === state)) {
    confidence += 10; // high confidence when verified within same state
  }
  if (baseCaseStudies.length >= 2) {
    confidence += 5;
  }
  confidence = Math.min(confidence, 92);

  // Resolution time reduction
  const resTimeReduction = Math.round(rawReduction * 0.82);

  // Timeline progression (Month 1 to 36)
  const baselineDisputes = 15432;
  const timelineMonths = timelineYears * 12;
  const timelineProgression = [];

  for (let m = 1; m <= timelineMonths; m += 3) {
    // S-curve adoption model
    const progressFraction = Math.pow(m / timelineMonths, 1.7);
    const currentRedPct = Math.round(rawReduction * progressFraction * 10) / 10;
    const activeCasesRemaining = Math.round(baselineDisputes * (1 - currentRedPct / 100));

    let milestone = '';
    if (m === 3) milestone = 'Mediation centers site setup & surveyor onboarding';
    else if (m === 6) milestone = 'Launch of Sub-Divisional Conciliation Lok Adalats';
    else if (m === 12) milestone = '500,000 Cadastral Records Digitized & Geo-referenced';
    else if (m === 18) milestone = 'Mobile Revenue Clinics active across all rural Talukas';
    else if (m === 24) milestone = 'Full digital deed-mutation synchronization live';
    else if (m === 36) milestone = `Target ${rawReduction}% Dispute Reduction Achieved`;

    timelineProgression.push({
      month: m,
      disputeReductionPct: currentRedPct,
      activeCases: activeCasesRemaining,
      milestone,
    });
  }

  const predictedNewDisputes = Math.round(baselineDisputes * (1 - rawReduction / 100));
  const costPerCase = Math.round((budgetCrores * 10000000) / (baselineDisputes - predictedNewDisputes));

  const simulationResult: SimulationResult = {
    id: `sim-${Date.now()}`,
    params,
    predictedDisputeReduction: rawReduction,
    confidenceScore: confidence,
    predictedResolutionTimeReduction: resTimeReduction,
    predictedNewDisputesYear3: predictedNewDisputes,
    costPerCaseResolved: costPerCase,
    timelineProgression,
    scenarios: {
      doNothing: {
        disputeChange: '+12% per annum',
        outcomeDescription: 'Pending disputes swell to 21,680+ by Year 3, resolution lag worsens to 9+ years',
      },
      singleProgram: {
        disputeReductionPct: Math.round(rawReduction * 0.65),
        outcomeDescription: 'Addresses either boundary mapping or dispute mediation, leaving structural bottleneck intact',
      },
      proposedCombined: {
        disputeReductionPct: rawReduction,
        outcomeDescription: `Combines high-precision cadastral mapping with community mediation for sustainable ${rawReduction}% disposal`,
      },
    },
    riskAssessment: {
      implementationRisk: 'Medium',
      fundingRisk: 'Low',
      adoptionRisk: 'Medium',
      mitigationStrategy:
        'Establish quarterly review under District Collector; mandate mobile revenue dispute clinics at sub-district level; provide standardized mediation honorarium.',
    },
    similarHistoricalCasesCount: activeCases.length,
    createdAt: new Date().toISOString(),
  };

  simulations[simulationResult.id] = simulationResult;

  res.json({
    success: true,
    data: simulationResult,
    message: `Policy simulation completed: ${rawReduction}% reduction predicted with ${confidence}% confidence`,
  });
});

app.get('/api/simulations/:id', (req: Request, res: Response) => {
  const sim = simulations[req.params.id];
  if (!sim) {
    return res.status(404).json({ success: false, message: 'Simulation not found' });
  }
  res.json({ success: true, data: sim });
});

// ==========================================
// POLICIES MANAGEMENT & TRACKING
// ==========================================
app.get('/api/policies', (req: Request, res: Response) => {
  res.json({ success: true, data: policies });
});

app.get('/api/policies/:id', (req: Request, res: Response) => {
  const pol = policies.find((p) => p.id === req.params.id);
  if (!pol) return res.status(404).json({ success: false, message: 'Policy not found' });
  res.json({ success: true, data: pol });
});

app.post('/api/policies', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (user.role === 'Researcher' || user.role === 'Citizen') {
    return res.status(403).json({ success: false, message: 'Only Policymakers or Administrators can approve policies' });
  }

  const { title, description, district, state, timelineMonths, budgetCrores, simulationId, baseCaseStudies } = req.body;
  const sim = simulationId ? simulations[simulationId] : undefined;

  const newPolicy: Policy = {
    id: `pol-${Date.now()}`,
    title: title || 'District Comprehensive Land Dispute Modernization Mission',
    description: description || 'Evidence-based policy synthesized from successful state models',
    createdBy: user.id,
    creatorName: user.fullName,
    state: state || user.state || 'Maharashtra',
    district: district || user.district || 'Nashik',
    category: 'Land Governance & Alternative Dispute Resolution',
    status: 'Approved',
    approvalDate: new Date().toISOString().split('T')[0],
    implementationStart: new Date().toISOString().split('T')[0],
    timelineMonths: timelineMonths || 36,
    budgetCrores: budgetCrores || 150,
    spentCrores: 0,
    expectedOutcomes: {
      disputeReductionPct: sim?.predictedDisputeReduction || 55,
      resolutionTimeImprovementPct: sim?.predictedResolutionTimeReduction || 45,
      satisfactionTargetPct: 85,
    },
    actualOutcomes: {
      disputesBaseline: 15432,
      disputesCurrent: 15432,
      currentReductionPct: 0,
      resolutionTimeBaselineYears: 7.2,
      resolutionTimeCurrentYears: 7.2,
      satisfactionCurrentPct: 45,
    },
    simulationResults: sim,
    responsibleDepartments: ['District Revenue Administration', 'Department of Land Records', 'Legal Services Authority'],
    caseStudiesBasedOn: baseCaseStudies || ['cs-tamil-nadu-digital', 'cs-pune-mediation'],
    milestones: [
      { id: 'm-1', phase: 'Phase 1: Setup', title: 'Establish Sub-District Mediation Centers', targetMonth: 6, status: 'In Progress', progressPct: 20 },
      { id: 'm-2', phase: 'Phase 1: Setup', title: 'Deploy Drone Cadastral Survey Teams', targetMonth: 12, status: 'Upcoming', progressPct: 0 },
      { id: 'm-3', phase: 'Phase 2: Rollout', title: 'Operationalize Mobile Dispute Tribunals', targetMonth: 24, status: 'Upcoming', progressPct: 0 },
      { id: 'm-4', phase: 'Phase 3: Impact', title: 'Achieve 55% Dispute Reduction Goal', targetMonth: 36, status: 'Upcoming', progressPct: 0 },
    ],
  };

  policies.unshift(newPolicy);

  res.json({
    success: true,
    data: newPolicy,
    message: 'Policy approved and registered in the National Policy Innovation Registry!',
  });
});

app.get('/api/policies/:id/tracking', (req: Request, res: Response) => {
  const pol = policies.find((p) => p.id === req.params.id) || policies[0];
  res.json({
    success: true,
    data: {
      policy: pol,
      budgetBurnPct: Math.round((pol.spentCrores / pol.budgetCrores) * 100),
      actualVsPredicted: {
        stageMonth: 12,
        actualDisputes: pol.actualOutcomes.disputesCurrent,
        predictedDisputesAtStage: 14100,
        varianceCount: pol.actualOutcomes.disputesCurrent - 14100, // +100 (0.7% variance, on track)
        varianceStatus: 'On Track (Within 1% Tolerance)',
        disputeReductionAchievedPct: pol.actualOutcomes.currentReductionPct,
        projectedMonth36ReductionPct: pol.expectedOutcomes.disputeReductionPct,
      },
    },
  });
});

// ==========================================
// RESEARCH PROJECTS APIS
// ==========================================
app.get('/api/projects', (req: Request, res: Response) => {
  res.json({ success: true, data: projects });
});

app.post('/api/projects', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

  const newProj: ResearchProject = {
    id: `proj-${Date.now()}`,
    title,
    description: description || 'New collaborative research initiative',
    createdBy: user.id,
    creatorName: user.fullName,
    members: [{ name: user.fullName, role: 'Lead Researcher', email: user.email }],
    datasetsAdded: [],
    papersAdded: [],
    notes: [{ id: `n-${Date.now()}`, author: user.fullName, text: 'Project initialized.', date: new Date().toISOString().split('T')[0] }],
    status: 'Active',
    createdAt: new Date().toISOString().split('T')[0],
  };

  projects.unshift(newProj);
  res.json({ success: true, data: newProj, message: 'Research project workspace created' });
});

app.post('/api/projects/:id/papers', (req: Request, res: Response) => {
  const proj = projects.find((p) => p.id === req.params.id);
  if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });
  const { paperId } = req.body;

  if (paperId && !proj.papersAdded.includes(paperId)) {
    proj.papersAdded.push(paperId);
  }

  res.json({ success: true, data: proj, message: 'Research paper linked to project workspace' });
});

app.post('/api/projects/:id/datasets', (req: Request, res: Response) => {
  const proj = projects.find((p) => p.id === req.params.id);
  if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });
  const { datasetId } = req.body;

  if (datasetId && !proj.datasetsAdded.includes(datasetId)) {
    proj.datasetsAdded.push(datasetId);
  }

  res.json({ success: true, data: proj, message: 'Dataset linked to project workspace' });
});

app.post('/api/projects/:id/notes', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const proj = projects.find((p) => p.id === req.params.id);
  if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });
  const { text } = req.body;

  const note = {
    id: `n-${Date.now()}`,
    author: user.fullName,
    text,
    date: new Date().toISOString().split('T')[0],
  };
  proj.notes.push(note);
  res.json({ success: true, data: note, message: 'Collaborator note added' });
});

// ==========================================
// GIS & SPATIAL DATA APIS
// ==========================================
app.get('/api/gis/districts', (req: Request, res: Response) => {
  res.json({ success: true, data: districts });
});

app.get('/api/gis/layers', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'satellite-basemap', name: 'Landsat / Sentinel True Color Satellite Mosaic', defaultVisible: true, type: 'raster' },
      { id: 'cadastral-parcels', name: 'Cadastral Parcel Boundaries & Survey Numbers', defaultVisible: true, type: 'vector' },
      { id: 'land-use-class', name: 'Land Use / Land Cover (LULC) Classification', defaultVisible: true, type: 'vector' },
      { id: 'urban-expansion', name: 'Urban Sprawl & Agricultural Conversion Hotspots', defaultVisible: true, type: 'heatmap' },
      { id: 'dispute-density', name: 'Land Dispute Density & Pending Litigations', defaultVisible: true, type: 'choropleth' },
      { id: 'water-forest-buffer', name: 'Water Bodies & Forest Boundary Reserves', defaultVisible: false, type: 'vector' },
    ],
  });
});

app.get('/api/gis/statistics', (req: Request, res: Response) => {
  const districtName = (req.query.district as string) || 'Nashik';
  const dist = districts.find((d) => d.name.toLowerCase() === districtName.toLowerCase()) || districts[0];
  res.json({ success: true, data: dist });
});

// ==========================================
// DASHBOARDS & ANALYTICS APIS
// ==========================================
app.get('/api/dashboards/:type', (req: Request, res: Response) => {
  const { type } = req.params;
  const user = getAuthenticatedUser(req);

  if (type === 'policymaker' || user.role === 'Policymaker') {
    return res.json({
      success: true,
      data: {
        role: 'Policymaker',
        jurisdiction: 'Maharashtra - Nashik District',
        kpiCards: [
          { label: 'Land Disputes Pending', value: '15,432', change: '+12.0% YoY', trend: 'up', alert: true, baseline: '13,780 in 2023' },
          { label: 'Average Resolution Time', value: '7.2 Years', change: '-5.2% YoY', trend: 'down', alert: false, target: '< 4.0 Years' },
          { label: 'Urban Expansion Rate', value: '2.1% p.a.', change: '+0.4% YoY', trend: 'up', alert: true, context: 'High Peri-Urban Pressure' },
          { label: 'Agricultural Land Loss', value: '1.8% p.a.', change: '+0.3% YoY', trend: 'up', alert: true, context: 'Prime Irrigated Farmland' },
          { label: 'Active Mediation Centers', value: '8 Centers', change: '+4 YoY', trend: 'up', alert: false, target: '15 Centers by Q4' },
          { label: 'Cadastral Resurvey Progress', value: '91.5%', change: '+14% YoY', trend: 'up', alert: false, target: '100% by 2026' },
        ],
        trends5Year: [
          { year: '2021', disputes: 12200, resolutionYears: 7.9, urbanPct: 18.2, agPct: 56.4 },
          { year: '2022', disputes: 13100, resolutionYears: 7.6, urbanPct: 19.5, agPct: 54.8 },
          { year: '2023', disputes: 13780, resolutionYears: 7.4, urbanPct: 20.4, agPct: 53.2 },
          { year: '2024', disputes: 14800, resolutionYears: 7.3, urbanPct: 21.3, agPct: 51.6 },
          { year: '2025', disputes: 15432, resolutionYears: 7.2, urbanPct: 22.4, agPct: 50.2 },
        ],
        disputeTypes: [
          { type: 'Boundary Conflicts & Encroachment', percentage: 40 },
          { type: 'Title Fraud & Mutation Discrepancies', percentage: 35 },
          { type: 'Family Partition & Succession Claims', percentage: 25 },
        ],
        activePolicy: policies[0],
      },
    });
  }

  // Researcher dashboard
  res.json({
    success: true,
    data: {
      role: 'Researcher',
      user: user.fullName,
      stats: {
        activeProjects: projects.length,
        papersIndexed: papers.length,
        datasetsAccessible: datasets.length,
        collaboratorDiscussions: 8,
      },
      featuredPapers: papers.slice(0, 4),
      recentActivity: [
        { time: '10 mins ago', action: 'Downloaded "Urban Expansion and Agricultural Land Loss in India (30-Year Analysis).pdf"' },
        { time: '1 hour ago', action: 'Added 2 papers to project "Urban Growth Study"' },
        { time: 'Yesterday', action: 'Dr. Arvind Swaminathan commented on project workspace' },
      ],
      impactMetrics: {
        viewsCount: 14250,
        downloadsCount: 3820,
        policymakersReached: 285,
        policiesDirectlyInformed: 3,
      },
    },
  });
});

app.get('/api/analytics/usage', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      systemHealth: '100% Operational',
      uptime: '99.98%',
      lastIngestion: 'Today, 02:15 AM',
      activeUsers24h: 1840,
      totalQueries24h: 24500,
      avgQueryLatencyMs: 42,
      databaseParcelsIndexed: '50,420,100',
      researchPapersCount: papers.length,
      datasetsCount: datasets.length,
      caseStudiesCount: caseStudies.length,
    },
  });
});

// Setup Vite development server middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kshetra-X Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
