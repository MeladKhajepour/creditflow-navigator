import type {
  ConnectedService,
  LoanApplication,
  AssessmentResult,
  ServiceProvider,
  PolicyRule,
  PolicyDiff,
  EvalTestCase,
  OverrideRecord,
  AgentActivityLog,
  ApiConfig,
} from "@/types";
import {
  mockServices,
  mockApplication,
  mockAssessment,
  mockPolicyRules,
  mockPolicyDiffs,
  mockEvalCases,
  mockOverrides,
  mockAgentLog,
} from "@/data/mock-data";

const config: ApiConfig = {
  useMockData: true,
  baseUrl: "",
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Service Connection ---

export async function getAvailableServices(): Promise<ConnectedService[]> {
  if (config.useMockData) {
    await delay(300);
    return [...mockServices];
  }
  throw new Error("Backend not configured");
}

export async function connectService(provider: ServiceProvider): Promise<ConnectedService> {
  if (config.useMockData) {
    await delay(1500); // Simulate OAuth flow
    return {
      ...mockServices.find((s) => s.provider === provider)!,
      status: "connected",
      connectedAt: new Date().toISOString(),
    };
  }
  throw new Error("Backend not configured");
}

// --- Application ---

export async function getApplication(): Promise<LoanApplication> {
  if (config.useMockData) {
    await delay(200);
    return { ...mockApplication };
  }
  throw new Error("Backend not configured");
}

export async function submitApplication(application: LoanApplication): Promise<LoanApplication> {
  if (config.useMockData) {
    await delay(800);
    return { ...application, status: "submitted", submittedAt: new Date().toISOString() };
  }
  throw new Error("Backend not configured");
}

// --- Assessment ---

export async function getAssessment(applicationId: string): Promise<AssessmentResult> {
  if (config.useMockData) {
    await delay(3000); // Simulate processing
    return { ...mockAssessment, applicationId };
  }
  throw new Error("Backend not configured");
}

// --- Policy ---

export async function getPolicyRules(): Promise<PolicyRule[]> {
  if (config.useMockData) {
    await delay(300);
    return [...mockPolicyRules];
  }
  throw new Error("Backend not configured");
}

export async function getPolicyDiffs(): Promise<PolicyDiff[]> {
  if (config.useMockData) {
    await delay(300);
    return [...mockPolicyDiffs];
  }
  throw new Error("Backend not configured");
}

export async function getEvalResults(): Promise<EvalTestCase[]> {
  if (config.useMockData) {
    await delay(300);
    return [...mockEvalCases];
  }
  throw new Error("Backend not configured");
}

// --- Overrides ---

export async function getOverrides(): Promise<OverrideRecord[]> {
  if (config.useMockData) {
    await delay(300);
    return [...mockOverrides];
  }
  throw new Error("Backend not configured");
}

export async function overrideDecision(
  applicationId: string,
  reason: string,
  explanation: string,
  newDecision: "approved" | "denied" | "conditional"
): Promise<OverrideRecord> {
  if (config.useMockData) {
    await delay(1200);
    return {
      id: `OR-${Date.now()}`,
      applicationId,
      originalDecision: "denied",
      newDecision,
      reason,
      explanation,
      overriddenBy: "Current Analyst",
      overriddenAt: new Date().toISOString(),
    };
  }
  throw new Error("Backend not configured");
}

// --- Agent Log ---

export async function getAgentLog(assessmentId: string): Promise<AgentActivityLog> {
  if (config.useMockData) {
    await delay(400);
    return { ...mockAgentLog, assessmentId };
  }
  throw new Error("Backend not configured");
}

// --- Config ---

export function setApiConfig(newConfig: Partial<ApiConfig>) {
  Object.assign(config, newConfig);
}
