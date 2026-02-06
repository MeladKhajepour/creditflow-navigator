import type {
  ConnectedService,
  LoanApplication,
  AssessmentResult,
  ChatMessage,
  PolicyRule,
  PolicyDiff,
  EvalTestCase,
  OverrideRecord,
  AgentActivityLog,
} from "@/types";

// --- Connected Services ---

export const mockServices: ConnectedService[] = [
  {
    provider: "xero",
    status: "disconnected",
    dataPoints: ["Financial statements", "P&L reports", "Balance sheet", "Cash flow"],
    label: "Xero",
    description: "Accounting & financial reporting",
    icon: "📊",
  },
  {
    provider: "quickbooks",
    status: "disconnected",
    dataPoints: ["Revenue data", "Expense reports", "Tax filings", "Payroll"],
    label: "QuickBooks",
    description: "Business accounting & bookkeeping",
    icon: "📗",
  },
  {
    provider: "stripe",
    status: "disconnected",
    dataPoints: ["Invoice history", "Payment volume", "MRR", "Churn rate"],
    label: "Stripe",
    description: "Payment processing & invoicing",
    icon: "💳",
  },
];

// --- Simulated data pulled from connected services ---

export const xeroFinancialData = {
  annualRevenue: { value: 4200000, source: "xero" as const, verifiedAt: "2024-01-15T10:30:00Z" },
  ebitda: { value: 840000, source: "xero" as const, verifiedAt: "2024-01-15T10:30:00Z" },
  netIncome: { value: 620000, source: "xero" as const, verifiedAt: "2024-01-15T10:30:00Z" },
  cashRunway: { value: 14, source: "xero" as const, verifiedAt: "2024-01-15T10:30:00Z" },
};

export const quickbooksFinancialData = {
  totalDebt: { value: 1200000, source: "quickbooks" as const, verifiedAt: "2024-01-15T10:32:00Z" },
  annualRevenue: { value: 4150000, source: "quickbooks" as const, verifiedAt: "2024-01-15T10:32:00Z" },
};

export const stripeFinancialData = {
  monthlyRecurringRevenue: 352000,
  invoiceCount: 1243,
  paymentVolume: 3800000,
  churnRate: 0.032,
};

// --- Company info (pre-filled from onboarding) ---

export const onboardingCompanyInfo = {
  name: { value: "TechFlow Solutions Ltd", source: "onboarding" as const },
  industry: { value: "SaaS / Enterprise Software", source: "onboarding" as const },
  country: { value: "United Kingdom", source: "onboarding" as const },
  yearsInOperation: { value: 6, source: "onboarding" as const },
};

// --- Loan request basics (also from onboarding) ---

export const onboardingLoanRequest = {
  amount: { value: 750000, source: "onboarding" as const },
  termMonths: { value: 36, source: "onboarding" as const },
  purpose: { value: "Market expansion into DACH region", source: "self-reported" as const },
  interestType: { value: "fixed" as const, source: "onboarding" as const },
};

// --- Mock Application (fully assembled) ---

export const mockApplication: LoanApplication = {
  id: "APP-2024-0847",
  company: onboardingCompanyInfo,
  financials: {
    annualRevenue: xeroFinancialData.annualRevenue,
    ebitda: xeroFinancialData.ebitda,
    totalDebt: quickbooksFinancialData.totalDebt,
    cashRunway: xeroFinancialData.cashRunway,
    netIncome: xeroFinancialData.netIncome,
  },
  loan: onboardingLoanRequest,
  qualitative: {
    loanPurpose: "We're expanding into the DACH region to capture the growing enterprise SaaS market in Germany, Austria, and Switzerland.",
    growthStrategy: "We plan to establish a local sales team in Berlin and localize our product for German-speaking markets.",
    competitiveAdvantage: "Our proprietary workflow engine is 3x faster than competitors and we hold 2 patents on our core technology.",
    useOfFunds: "60% hiring (sales & engineering), 25% product localization, 15% marketing & brand awareness.",
    repaymentPlan: "Revenue from DACH operations projected to cover loan payments within 18 months based on our pipeline.",
  },
  connectedServices: ["xero", "quickbooks"],
  completionPercent: 100,
  submittedAt: "2024-01-15T11:00:00Z",
  status: "assessed",
};

// --- Mock Assessment ---

export const mockAssessment: AssessmentResult = {
  id: "ASM-2024-0847",
  applicationId: "APP-2024-0847",
  riskScore: 72,
  riskLevel: "medium",
  decision: "conditional",
  recommendedRate: 7.25,
  metrics: {
    probabilityOfDefault: 0.082,
    exposureAtDefault: 750000,
    lossGivenDefault: 0.45,
    expectedLoss: 27675,
  },
  explanation:
    "TechFlow Solutions presents a moderate credit risk profile. Strong revenue growth (4.2M annual) and healthy EBITDA margins (20%) are positive indicators. However, the existing debt-to-revenue ratio of 28.6% and relatively short operational history (6 years) introduce measured risk. The DACH expansion purpose adds geographical diversification but also execution risk. The applicant demonstrated strong qualitative factors including a clear repayment plan and competitive moat with patented technology. Verified financial data from Xero and QuickBooks increases confidence in the assessment. Conditional approval is recommended with covenant requirements.",
  riskFactors: [
    { id: "RF-001", description: "Debt-to-revenue ratio above 25% threshold", severity: "medium", category: "Financial Health" },
    { id: "RF-002", description: "Expansion into new geographic market adds execution risk", severity: "medium", category: "Business Strategy" },
    { id: "RF-003", description: "Industry concentration in enterprise SaaS", severity: "low", category: "Market Risk" },
    { id: "RF-004", description: "Repayment plan relies on projected (not actual) DACH revenue", severity: "high", category: "Repayment Risk" },
  ],
  osintFindings: [
    { category: "country_risk", title: "UK Business Environment", summary: "Stable regulatory environment with moderate economic uncertainty post-Brexit. Business formation rates remain strong.", severity: "low", source: "World Bank" },
    { category: "industry_risk", title: "Enterprise SaaS Market", summary: "Strong growth trajectory with increasing enterprise adoption. Competitive landscape intensifying with 15% YoY new entrants.", severity: "medium", source: "Gartner" },
    { category: "news", title: "TechFlow in press", summary: "Recent Series B coverage in TechCrunch. No negative press or litigation found.", severity: "low", source: "News aggregation" },
    { category: "regulatory", title: "GDPR & Data compliance", summary: "Operating in regulated data environment. No compliance violations found in public records.", severity: "low", source: "ICO Register" },
  ],
  dataSources: {
    verified: 8,
    selfReported: 4,
    total: 12,
    sources: [
      { provider: "xero", fieldCount: 5 },
      { provider: "quickbooks", fieldCount: 3 },
    ],
  },
  assessedAt: "2024-01-15T11:05:00Z",
};

// --- Qualitative Interview Questions ---

export const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-001",
    role: "ai",
    content: "Welcome back! I can see your company profile is already set up from onboarding. Let's connect your financial services on the right panel to pull verified data, then I'll ask you a few qualitative questions to complete your assessment.",
    type: "text",
    timestamp: new Date().toISOString(),
  },
  {
    id: "msg-002",
    role: "ai",
    content: "Please connect at least one financial service on the right to get started. This lets us verify your financial statements automatically.",
    type: "service-prompt",
    timestamp: new Date(Date.now() + 1000).toISOString(),
  },
];

export const interviewQuestions: ChatMessage[] = [
  {
    id: "q-001",
    role: "ai",
    content: "Great, your financial data is being pulled in. Now let's talk about the qualitative side. Can you describe in your own words why you're seeking this loan and what it will enable for your business?",
    type: "text",
    timestamp: "",
    qualitativeField: "loanPurpose",
  },
  {
    id: "q-002",
    role: "ai",
    content: "What's your growth strategy for the next 12–24 months? How does this loan fit into that plan?",
    type: "text",
    timestamp: "",
    qualitativeField: "growthStrategy",
  },
  {
    id: "q-003",
    role: "ai",
    content: "What would you say is your company's key competitive advantage or moat in the market?",
    type: "text",
    timestamp: "",
    qualitativeField: "competitiveAdvantage",
  },
  {
    id: "q-004",
    role: "ai",
    content: "How do you plan to allocate the loan funds? Can you give a rough percentage breakdown?",
    type: "text",
    timestamp: "",
    qualitativeField: "useOfFunds",
  },
  {
    id: "q-005",
    role: "ai",
    content: "What's your plan for repaying this loan? What revenue streams or milestones will support repayment?",
    type: "text",
    timestamp: "",
    qualitativeField: "repaymentPlan",
  },
  {
    id: "q-006",
    role: "ai",
    content: "How would you describe the current market conditions in your industry? Are there any headwinds or tailwinds you're navigating?",
    type: "text",
    timestamp: "",
    qualitativeField: "marketConditions",
  },
  {
    id: "q-007",
    role: "ai",
    content: "Tell me about your leadership team. What relevant experience do they bring to executing this growth plan?",
    type: "text",
    timestamp: "",
    qualitativeField: "teamExperience",
  },
  {
    id: "q-008",
    role: "ai",
    content: "Finally, what do you see as the biggest risks or challenges to your business in the near term? How are you mitigating them?",
    type: "text",
    timestamp: "",
    qualitativeField: "challengesAndRisks",
  },
  {
    id: "q-009",
    role: "ai",
    content: "Thank you for sharing all of that — it really helps paint a full picture. Your financial data and qualitative insights are ready. Would you like to submit for assessment?",
    type: "quick-reply",
    timestamp: "",
    options: [
      { label: "Submit for Assessment", value: "submit" },
      { label: "Let me review first", value: "review" },
    ],
  },
];

// --- Policy Rules ---

export const mockPolicyRules: PolicyRule[] = [
  { id: "PR-001", name: "Max Debt-to-Revenue Ratio", description: "Maximum acceptable ratio of total debt to annual revenue", parameter: "max_debt_revenue_ratio", currentValue: 0.35, category: "threshold" },
  { id: "PR-002", name: "Min EBITDA Margin", description: "Minimum EBITDA margin for automatic approval", parameter: "min_ebitda_margin", currentValue: 0.15, category: "threshold" },
  { id: "PR-003", name: "Revenue Weight", description: "Weight assigned to revenue in scoring model", parameter: "revenue_weight", currentValue: 0.25, category: "weight" },
  { id: "PR-004", name: "Industry Risk Weight", description: "Weight assigned to industry risk factors", parameter: "industry_risk_weight", currentValue: 0.15, category: "weight" },
  { id: "PR-005", name: "Country Risk Adjustment", description: "Risk score adjustment based on country of operation", parameter: "country_risk_adj", currentValue: 0.05, category: "adjustment" },
  { id: "PR-006", name: "Verified Data Bonus", description: "Score improvement when data is independently verified", parameter: "verified_data_bonus", currentValue: 5, category: "adjustment" },
  { id: "PR-007", name: "Min Cash Runway (months)", description: "Minimum months of cash runway required", parameter: "min_cash_runway", currentValue: 6, category: "threshold" },
  { id: "PR-008", name: "Max Loan-to-Revenue", description: "Maximum loan amount as proportion of revenue", parameter: "max_loan_revenue", currentValue: 0.25, category: "threshold" },
];

export const mockPolicyDiffs: PolicyDiff[] = [
  { id: "PD-001", ruleId: "PR-001", ruleName: "Max Debt-to-Revenue Ratio", previousValue: 0.30, newValue: 0.35, changedAt: "2024-01-14T09:00:00Z", reason: "Override: Too strict for growth-stage companies", triggeredBy: "Analyst Override" },
  { id: "PD-002", ruleId: "PR-006", ruleName: "Verified Data Bonus", previousValue: 3, newValue: 5, changedAt: "2024-01-10T14:30:00Z", reason: "Increased incentive for verified data submission", triggeredBy: "Policy Review" },
];

export const mockEvalCases: EvalTestCase[] = [
  { id: "EC-001", companyName: "CloudNine SaaS", expectedDecision: "approved", actualDecision: "approved", expectedScore: 85, actualScore: 83, pass: true },
  { id: "EC-002", companyName: "QuickShip Logistics", expectedDecision: "conditional", actualDecision: "conditional", expectedScore: 65, actualScore: 68, pass: true },
  { id: "EC-003", companyName: "HealthBridge AI", expectedDecision: "approved", actualDecision: "approved", expectedScore: 78, actualScore: 76, pass: true },
  { id: "EC-004", companyName: "RetailMax Corp", expectedDecision: "denied", actualDecision: "denied", expectedScore: 32, actualScore: 35, pass: true },
  { id: "EC-005", companyName: "GreenEnergy Ltd", expectedDecision: "conditional", actualDecision: "approved", expectedScore: 60, actualScore: 72, pass: false },
  { id: "EC-006", companyName: "DataSync Pro", expectedDecision: "approved", actualDecision: "approved", expectedScore: 88, actualScore: 90, pass: true },
  { id: "EC-007", companyName: "BuildRight Construction", expectedDecision: "denied", actualDecision: "conditional", expectedScore: 40, actualScore: 52, pass: false },
  { id: "EC-008", companyName: "FoodChain Analytics", expectedDecision: "conditional", actualDecision: "conditional", expectedScore: 58, actualScore: 55, pass: true },
];

export const mockOverrides: OverrideRecord[] = [
  {
    id: "OR-001",
    applicationId: "APP-2024-0843",
    originalDecision: "denied",
    newDecision: "conditional",
    reason: "Relationship factor",
    explanation: "Long-standing client with 8-year repayment history. Recent revenue dip due to seasonal factors, not structural decline.",
    overriddenBy: "Sarah Chen",
    overriddenAt: "2024-01-13T16:45:00Z",
  },
];

export const mockAgentLog: AgentActivityLog = {
  assessmentId: "ASM-2024-0847",
  steps: [
    { id: "AS-001", name: "Orchestration", description: "Coordinating assessment pipeline and validating inputs", status: "complete", durationMs: 1200, output: "All inputs validated. 2 financial services connected. 8 qualitative responses collected. Dispatching to research agents.", startedAt: "2024-01-15T11:00:00Z", completedAt: "2024-01-15T11:00:01Z" },
    { id: "AS-002", name: "Risk Research", description: "OSINT analysis — country risk, industry risk, news monitoring", status: "complete", durationMs: 8500, output: "4 findings: UK stable (low), SaaS competitive (medium), positive press (low), GDPR compliant (low).", startedAt: "2024-01-15T11:00:01Z", completedAt: "2024-01-15T11:00:10Z" },
    { id: "AS-003", name: "Baseline Scoring", description: "Quantitative risk model — PD, EAD, LGD, EL calculations from verified financial data", status: "complete", durationMs: 3200, output: "PD: 8.2%, EAD: $750K, LGD: 45%, EL: $27,675. Base score: 68.", startedAt: "2024-01-15T11:00:10Z", completedAt: "2024-01-15T11:00:13Z" },
    { id: "AS-004", name: "Qualitative Synthesis", description: "Analyzing interview responses for business strategy, team strength, and risk awareness", status: "complete", durationMs: 4100, output: "Adjusted score: 72 (+4 verified data bonus). Strong growth strategy, clear repayment plan. 4 risk factors flagged. Decision: Conditional.", startedAt: "2024-01-15T11:00:13Z", completedAt: "2024-01-15T11:00:17Z" },
    { id: "AS-005", name: "Final Assessment", description: "Generating decision, explanation, and recommendations", status: "complete", durationMs: 2800, output: "Conditional approval at 7.25%. Covenant requirements included. Full report generated.", startedAt: "2024-01-15T11:00:17Z", completedAt: "2024-01-15T11:00:20Z" },
  ],
  totalDurationMs: 19800,
  startedAt: "2024-01-15T11:00:00Z",
  completedAt: "2024-01-15T11:00:20Z",
};
