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

// --- Mock Application ---

export const mockApplication: LoanApplication = {
  id: "APP-2024-0847",
  company: {
    name: { value: "TechFlow Solutions Ltd", source: "xero", verifiedAt: "2024-01-15T10:30:00Z" },
    industry: { value: "SaaS / Enterprise Software", source: "self-reported" },
    country: { value: "United Kingdom", source: "xero", verifiedAt: "2024-01-15T10:30:00Z" },
    yearsInOperation: { value: 6, source: "xero", verifiedAt: "2024-01-15T10:30:00Z" },
  },
  financials: {
    annualRevenue: { value: 4200000, source: "xero", verifiedAt: "2024-01-15T10:30:00Z" },
    ebitda: { value: 840000, source: "xero", verifiedAt: "2024-01-15T10:30:00Z" },
    totalDebt: { value: 1200000, source: "quickbooks", verifiedAt: "2024-01-15T10:32:00Z" },
    cashRunway: { value: 14, source: "self-reported" },
    netIncome: { value: 620000, source: "xero", verifiedAt: "2024-01-15T10:30:00Z" },
  },
  loan: {
    amount: { value: 750000, source: "self-reported" },
    termMonths: { value: 36, source: "self-reported" },
    purpose: { value: "Market expansion into DACH region", source: "self-reported" },
    interestType: { value: "fixed", source: "self-reported" },
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
    "TechFlow Solutions presents a moderate credit risk profile. Strong revenue growth (4.2M annual) and healthy EBITDA margins (20%) are positive indicators. However, the existing debt-to-revenue ratio of 28.6% and relatively short operational history (6 years) introduce measured risk. The DACH expansion purpose adds geographical diversification but also execution risk. Verified financial data from Xero and QuickBooks increases confidence in the assessment. Conditional approval is recommended with covenant requirements.",
  riskFactors: [
    { id: "RF-001", description: "Debt-to-revenue ratio above 25% threshold", severity: "medium", category: "Financial Health" },
    { id: "RF-002", description: "Expansion into new geographic market adds execution risk", severity: "medium", category: "Business Strategy" },
    { id: "RF-003", description: "Industry concentration in enterprise SaaS", severity: "low", category: "Market Risk" },
    { id: "RF-004", description: "Cash runway self-reported — not independently verified", severity: "high", category: "Data Quality" },
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

// --- Chat Script ---

export const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-001",
    role: "ai",
    content: "Welcome to CreditOps Copilot. I'll guide you through your credit risk assessment. Let's start by connecting your financial services so we can pull verified data — this significantly strengthens your application.",
    type: "text",
    timestamp: new Date().toISOString(),
  },
  {
    id: "msg-002",
    role: "ai",
    content: "Please connect at least one of the following services on the right panel. You can also skip this step and provide information manually.",
    type: "service-prompt",
    timestamp: new Date(Date.now() + 1000).toISOString(),
  },
];

export const interviewQuestions: ChatMessage[] = [
  {
    id: "q-001",
    role: "ai",
    content: "Great! Let's start with your company details. What is your company name?",
    type: "text",
    timestamp: "",
    fieldMapping: "company.name",
  },
  {
    id: "q-002",
    role: "ai",
    content: "What industry does your company operate in?",
    type: "select",
    timestamp: "",
    fieldMapping: "company.industry",
    options: [
      { label: "SaaS / Enterprise Software", value: "SaaS / Enterprise Software" },
      { label: "Fintech", value: "Fintech" },
      { label: "Healthcare", value: "Healthcare" },
      { label: "E-Commerce", value: "E-Commerce" },
      { label: "Manufacturing", value: "Manufacturing" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    id: "q-003",
    role: "ai",
    content: "Which country is your company headquartered in?",
    type: "select",
    timestamp: "",
    fieldMapping: "company.country",
    options: [
      { label: "United Kingdom", value: "United Kingdom" },
      { label: "United States", value: "United States" },
      { label: "Germany", value: "Germany" },
      { label: "Singapore", value: "Singapore" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    id: "q-004",
    role: "ai",
    content: "What is your annual revenue (USD)?",
    type: "text",
    timestamp: "",
    fieldMapping: "financials.annualRevenue",
  },
  {
    id: "q-005",
    role: "ai",
    content: "What is your EBITDA (USD)?",
    type: "text",
    timestamp: "",
    fieldMapping: "financials.ebitda",
  },
  {
    id: "q-006",
    role: "ai",
    content: "What is the total outstanding debt (USD)?",
    type: "text",
    timestamp: "",
    fieldMapping: "financials.totalDebt",
  },
  {
    id: "q-007",
    role: "ai",
    content: "How much are you looking to borrow (USD)?",
    type: "text",
    timestamp: "",
    fieldMapping: "loan.amount",
  },
  {
    id: "q-008",
    role: "ai",
    content: "What loan term are you looking for?",
    type: "select",
    timestamp: "",
    fieldMapping: "loan.termMonths",
    options: [
      { label: "12 months", value: "12" },
      { label: "24 months", value: "24" },
      { label: "36 months", value: "36" },
      { label: "48 months", value: "48" },
      { label: "60 months", value: "60" },
    ],
  },
  {
    id: "q-009",
    role: "ai",
    content: "What is the purpose of this loan?",
    type: "text",
    timestamp: "",
    fieldMapping: "loan.purpose",
  },
  {
    id: "q-010",
    role: "ai",
    content: "Thank you! I have all the information needed. Would you like to submit your application for assessment?",
    type: "quick-reply",
    timestamp: "",
    options: [
      { label: "Submit for Assessment", value: "submit" },
      { label: "Review my answers", value: "review" },
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

// --- Policy Diffs ---

export const mockPolicyDiffs: PolicyDiff[] = [
  { id: "PD-001", ruleId: "PR-001", ruleName: "Max Debt-to-Revenue Ratio", previousValue: 0.30, newValue: 0.35, changedAt: "2024-01-14T09:00:00Z", reason: "Override: Too strict for growth-stage companies", triggeredBy: "Analyst Override" },
  { id: "PD-002", ruleId: "PR-006", ruleName: "Verified Data Bonus", previousValue: 3, newValue: 5, changedAt: "2024-01-10T14:30:00Z", reason: "Increased incentive for verified data submission", triggeredBy: "Policy Review" },
];

// --- Eval Suite ---

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

// --- Override Records ---

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

// --- Agent Activity ---

export const mockAgentLog: AgentActivityLog = {
  assessmentId: "ASM-2024-0847",
  steps: [
    { id: "AS-001", name: "Orchestration", description: "Coordinating assessment pipeline and validating inputs", status: "complete", durationMs: 1200, output: "All inputs validated. 2 financial services connected. Dispatching to research agents.", startedAt: "2024-01-15T11:00:00Z", completedAt: "2024-01-15T11:00:01Z" },
    { id: "AS-002", name: "Risk Research", description: "OSINT analysis — country risk, industry risk, news monitoring", status: "complete", durationMs: 8500, output: "4 findings: UK stable (low), SaaS competitive (medium), positive press (low), GDPR compliant (low).", startedAt: "2024-01-15T11:00:01Z", completedAt: "2024-01-15T11:00:10Z" },
    { id: "AS-003", name: "Baseline Scoring", description: "Quantitative risk model — PD, EAD, LGD, EL calculations", status: "complete", durationMs: 3200, output: "PD: 8.2%, EAD: $750K, LGD: 45%, EL: $27,675. Base score: 68.", startedAt: "2024-01-15T11:00:10Z", completedAt: "2024-01-15T11:00:13Z" },
    { id: "AS-004", name: "Qualitative Synthesis", description: "Combining quantitative scores with qualitative risk factors", status: "complete", durationMs: 4100, output: "Adjusted score: 72 (+4 verified data bonus). 4 risk factors flagged. Decision: Conditional.", startedAt: "2024-01-15T11:00:13Z", completedAt: "2024-01-15T11:00:17Z" },
    { id: "AS-005", name: "Final Assessment", description: "Generating decision, explanation, and recommendations", status: "complete", durationMs: 2800, output: "Conditional approval at 7.25%. Covenant requirements included. Full report generated.", startedAt: "2024-01-15T11:00:17Z", completedAt: "2024-01-15T11:00:20Z" },
  ],
  totalDurationMs: 19800,
  startedAt: "2024-01-15T11:00:00Z",
  completedAt: "2024-01-15T11:00:20Z",
};
