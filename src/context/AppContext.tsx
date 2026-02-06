import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  RightPanelStage,
  ConnectedService,
  LoanApplication,
  AssessmentResult,
  ChatMessage,
  ServiceProvider,
  QualitativeInsights,
} from "@/types";
import {
  mockServices,
  initialChatMessages,
  interviewQuestions,
  onboardingCompanyInfo,
  onboardingLoanRequest,
  xeroFinancialData,
  quickbooksFinancialData,
} from "@/data/mock-data";

interface AppState {
  // Panel state
  rightPanelStage: RightPanelStage;
  setRightPanelStage: (stage: RightPanelStage) => void;

  // Services
  services: ConnectedService[];
  connectService: (provider: ServiceProvider) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  currentQuestionIndex: number;
  advanceQuestion: () => void;
  interviewComplete: boolean;

  // Application
  application: Partial<LoanApplication>;
  updateQualitativeField: (field: keyof QualitativeInsights, value: string) => void;

  // Assessment
  assessment: AssessmentResult | null;
  setAssessment: (result: AssessmentResult) => void;
  isAssessing: boolean;
  setIsAssessing: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [rightPanelStage, setRightPanelStage] = useState<RightPanelStage>("connect-services");
  const [services, setServices] = useState<ConnectedService[]>([...mockServices]);
  const [messages, setMessages] = useState<ChatMessage[]>([...initialChatMessages]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [application, setApplication] = useState<Partial<LoanApplication>>({
    // Pre-filled from onboarding
    company: onboardingCompanyInfo,
    loan: onboardingLoanRequest,
    qualitative: {},
    connectedServices: [],
    completionPercent: 0,
    status: "draft",
  });
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  const connectServiceHandler = useCallback((provider: ServiceProvider) => {
    setServices((prev) =>
      prev.map((s) =>
        s.provider === provider
          ? { ...s, status: "connected" as const, connectedAt: new Date().toISOString() }
          : s
      )
    );

    // Auto-populate financial data from the connected service
    setApplication((prev) => {
      const updated = { ...prev };
      updated.connectedServices = [...(prev.connectedServices || []), provider];

      if (!updated.financials) {
        updated.financials = {} as any;
      }

      if (provider === "xero") {
        updated.financials = {
          ...updated.financials!,
          annualRevenue: xeroFinancialData.annualRevenue,
          ebitda: xeroFinancialData.ebitda,
          netIncome: xeroFinancialData.netIncome,
          cashRunway: xeroFinancialData.cashRunway,
        };
      } else if (provider === "quickbooks") {
        updated.financials = {
          ...updated.financials!,
          totalDebt: quickbooksFinancialData.totalDebt,
          // Only override revenue if not already verified
          ...(updated.financials?.annualRevenue?.source !== "xero"
            ? { annualRevenue: quickbooksFinancialData.annualRevenue }
            : {}),
        };
      }

      // Recalculate completion
      updated.completionPercent = calculateCompletion(updated);

      return updated;
    });
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const advanceQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      const next = prev + 1;
      if (next >= interviewQuestions.length) {
        setInterviewComplete(true);
        return prev;
      }
      const question = interviewQuestions[next];
      setMessages((msgs) => [
        ...msgs,
        { ...question, timestamp: new Date().toISOString(), id: `q-live-${next}` },
      ]);
      return next;
    });
  }, []);

  const updateQualitativeField = useCallback((field: keyof QualitativeInsights, value: string) => {
    setApplication((prev) => {
      const updated = {
        ...prev,
        qualitative: {
          ...(prev.qualitative || {}),
          [field]: value,
        },
      };
      updated.completionPercent = calculateCompletion(updated);
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        rightPanelStage,
        setRightPanelStage,
        services,
        connectService: connectServiceHandler,
        messages,
        addMessage,
        currentQuestionIndex,
        advanceQuestion,
        interviewComplete,
        application,
        updateQualitativeField,
        assessment,
        setAssessment,
        isAssessing,
        setIsAssessing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function calculateCompletion(app: Partial<LoanApplication>): number {
  let filled = 0;
  const total = 14; // company(4) + financials(5) + loan basics(3) + at least 2 qualitative

  // Company (pre-filled from onboarding)
  const c = app.company as any;
  if (c?.name?.value) filled++;
  if (c?.industry?.value) filled++;
  if (c?.country?.value) filled++;
  if (c?.yearsInOperation?.value) filled++;

  // Financials (from connected services)
  const f = app.financials as any;
  if (f?.annualRevenue?.value) filled++;
  if (f?.ebitda?.value) filled++;
  if (f?.totalDebt?.value) filled++;
  if (f?.cashRunway?.value) filled++;
  if (f?.netIncome?.value) filled++;

  // Loan basics (from onboarding)
  const l = app.loan as any;
  if (l?.amount?.value) filled++;
  if (l?.termMonths?.value) filled++;
  if (l?.purpose?.value) filled++;

  // Qualitative (from chat interview)
  const q = app.qualitative;
  if (q?.loanPurpose) filled++;
  if (q?.growthStrategy) filled++;

  return Math.min(100, Math.round((filled / total) * 100));
}
