import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  RightPanelStage,
  ConnectedService,
  LoanApplication,
  AssessmentResult,
  ChatMessage,
  ServiceProvider,
  VerifiedField,
} from "@/types";
import { mockServices, initialChatMessages, interviewQuestions } from "@/data/mock-data";

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
  updateApplicationField: (path: string, value: VerifiedField) => void;
  applicationComplete: boolean;

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 = pre-interview
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [application, setApplication] = useState<Partial<LoanApplication>>({
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
    setApplication((prev) => ({
      ...prev,
      connectedServices: [...(prev.connectedServices || []), provider],
    }));
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

  const updateApplicationField = useCallback((path: string, value: VerifiedField) => {
    setApplication((prev) => {
      const updated = { ...prev };
      const parts = path.split(".");
      let obj: any = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj[parts[i]] = { ...obj[parts[i]] };
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;

      // Calculate completion
      const totalFields = 9;
      let filled = 0;
      const c = updated as any;
      if (c.company?.name?.value) filled++;
      if (c.company?.industry?.value) filled++;
      if (c.company?.country?.value) filled++;
      if (c.financials?.annualRevenue?.value) filled++;
      if (c.financials?.ebitda?.value) filled++;
      if (c.financials?.totalDebt?.value) filled++;
      if (c.loan?.amount?.value) filled++;
      if (c.loan?.termMonths?.value) filled++;
      if (c.loan?.purpose?.value) filled++;
      updated.completionPercent = Math.round((filled / totalFields) * 100);

      return updated;
    });
  }, []);

  const applicationComplete = (application.completionPercent ?? 0) >= 100;

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
        updateApplicationField,
        applicationComplete,
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
