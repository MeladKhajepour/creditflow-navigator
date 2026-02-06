// ============================================
// CreditOps Copilot — Type Definitions
// ============================================

// --- Connected Services ---

export type ServiceProvider = "xero" | "quickbooks" | "stripe";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface ConnectedService {
  provider: ServiceProvider;
  status: ConnectionStatus;
  connectedAt?: string;
  dataPoints: string[];
  label: string;
  description: string;
  icon: string;
}

// --- Loan Application ---

export type VerificationSource = "xero" | "quickbooks" | "stripe" | "self-reported" | "onboarding";

export interface VerifiedField<T = string | number> {
  value: T;
  source: VerificationSource;
  verifiedAt?: string;
}

export interface CompanyInfo {
  name: VerifiedField<string>;
  industry: VerifiedField<string>;
  country: VerifiedField<string>;
  yearsInOperation: VerifiedField<number>;
}

export interface FinancialSnapshot {
  annualRevenue: VerifiedField<number>;
  ebitda: VerifiedField<number>;
  totalDebt: VerifiedField<number>;
  cashRunway: VerifiedField<number>;
  netIncome: VerifiedField<number>;
}

export interface LoanRequest {
  amount: VerifiedField<number>;
  termMonths: VerifiedField<number>;
  purpose: VerifiedField<string>;
  interestType: VerifiedField<"fixed" | "variable">;
}

export interface QualitativeInsights {
  loanPurpose: string;
  growthStrategy: string;
  competitiveAdvantage: string;
  useOfFunds: string;
  repaymentPlan: string;
  marketConditions: string;
  teamExperience: string;
  challengesAndRisks: string;
}

export interface LoanApplication {
  id: string;
  company: CompanyInfo;
  financials: FinancialSnapshot;
  loan: LoanRequest;
  qualitative: Partial<QualitativeInsights>;
  connectedServices: ServiceProvider[];
  completionPercent: number;
  submittedAt?: string;
  status: "draft" | "submitted" | "assessed" | "overridden";
}

// --- Assessment Results ---

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Decision = "approved" | "denied" | "conditional";

export interface RiskMetrics {
  probabilityOfDefault: number;
  exposureAtDefault: number;
  lossGivenDefault: number;
  expectedLoss: number;
}

export interface RiskFactor {
  id: string;
  description: string;
  severity: RiskLevel;
  category: string;
}

export interface OSINTFinding {
  category: "country_risk" | "industry_risk" | "news" | "regulatory";
  title: string;
  summary: string;
  severity: RiskLevel;
  source: string;
}

export interface DataSourceSummary {
  verified: number;
  selfReported: number;
  total: number;
  sources: { provider: ServiceProvider; fieldCount: number }[];
}

export interface AssessmentResult {
  id: string;
  applicationId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  decision: Decision;
  recommendedRate: number;
  metrics: RiskMetrics;
  explanation: string;
  riskFactors: RiskFactor[];
  osintFindings: OSINTFinding[];
  dataSources: DataSourceSummary;
  assessedAt: string;
}

// --- Chat ---

export type MessageRole = "ai" | "user";
export type MessageType = "text" | "quick-reply" | "service-prompt" | "assessment-trigger" | "select";

export interface QuickReplyOption {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: string;
  options?: QuickReplyOption[];
  qualitativeField?: keyof QualitativeInsights;
}

// --- Right Panel State ---

export type RightPanelStage = "connect-services" | "application-form" | "assessment-results";

// --- Admin / Policy ---

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  parameter: string;
  currentValue: string | number;
  category: "threshold" | "weight" | "adjustment";
}

export interface PolicyDiff {
  id: string;
  ruleId: string;
  ruleName: string;
  previousValue: string | number;
  newValue: string | number;
  changedAt: string;
  reason: string;
  triggeredBy: string;
}

export interface EvalTestCase {
  id: string;
  companyName: string;
  expectedDecision: Decision;
  actualDecision: Decision;
  expectedScore: number;
  actualScore: number;
  pass: boolean;
}

export interface OverrideRecord {
  id: string;
  applicationId: string;
  originalDecision: Decision;
  newDecision: Decision;
  reason: string;
  explanation: string;
  overriddenBy: string;
  overriddenAt: string;
}

// --- Agent Activity ---

export type AgentStepStatus = "pending" | "in-progress" | "complete" | "error";

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: AgentStepStatus;
  durationMs?: number;
  output?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AgentActivityLog {
  assessmentId: string;
  steps: AgentStep[];
  totalDurationMs: number;
  startedAt: string;
  completedAt?: string;
}

// --- API Service ---

export interface ApiConfig {
  useMockData: boolean;
  baseUrl?: string;
}
