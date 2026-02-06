import { motion } from "framer-motion";
import { useAppState } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, FileText, Send, Building2, MessageSquareText } from "lucide-react";
import type { VerifiedField } from "@/types";

function VerifiedBadge({ source }: { source: string }) {
  if (source === "self-reported") return null;
  const label = source === "onboarding" ? "Onboarding" : source.charAt(0).toUpperCase() + source.slice(1);
  const color = source === "onboarding" ? "text-muted-foreground" : "text-verified";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] ${color} font-medium ml-2`}>
      <CheckCircle2 className="w-3 h-3" />
      {source === "onboarding" ? "From profile" : `Verified via ${label}`}
    </span>
  );
}

function FieldDisplay({ label, field }: { label: string; field?: VerifiedField }) {
  if (!field || field.value === undefined || field.value === "") {
    return (
      <div className="py-2.5 px-3 rounded-lg bg-muted/30 border border-border/30">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-muted-foreground/60 italic">Awaiting data source...</p>
      </div>
    );
  }

  const displayValue =
    typeof field.value === "number" && field.value > 1000
      ? `$${field.value.toLocaleString()}`
      : String(field.value);

  const isVerified = field.source !== "self-reported" && field.source !== "onboarding";

  return (
    <div
      className={`py-2.5 px-3 rounded-lg border ${
        isVerified
          ? "bg-verified/5 border-verified/20"
          : "bg-card/60 border-border/30"
      }`}
    >
      <div className="flex items-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <VerifiedBadge source={field.source} />
      </div>
      <p className="text-sm font-medium mt-0.5">{displayValue}</p>
    </div>
  );
}

export default function ApplicationForm() {
  const { application, setRightPanelStage, setIsAssessing, setAssessment, addMessage } = useAppState();
  const a = application as any;
  const percent = application.completionPercent ?? 0;
  const connectedServices = application.connectedServices ?? [];
  const qualitative = application.qualitative ?? {};
  const qualitativeCount = Object.values(qualitative).filter(Boolean).length;

  const hasFinancials = a.financials?.annualRevenue?.value;
  const canSubmit = hasFinancials && qualitativeCount >= 2;

  const handleSubmit = () => {
    setRightPanelStage("assessment-results");
    setIsAssessing(true);
    addMessage({
      id: `ai-assess-${Date.now()}`,
      role: "ai",
      content: "Running your assessment now. Our AI agents are analyzing your verified financial data alongside your interview responses...",
      type: "text",
      timestamp: new Date().toISOString(),
    });
    import("@/services/api").then(({ getAssessment }) => {
      getAssessment("APP-mock").then((result) => {
        setAssessment(result);
        setIsAssessing(false);
        addMessage({
          id: `ai-done-${Date.now()}`,
          role: "ai",
          content: "Your assessment is complete! Review the detailed results on the right. Ask me anything about the findings.",
          type: "text",
          timestamp: new Date().toISOString(),
        });
      });
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Application Summary</h2>
        </div>
        <div className="flex items-center gap-3">
          <Progress value={percent} className="flex-1 h-1.5" />
          <span className="text-xs font-mono text-muted-foreground">{percent}%</span>
        </div>

        {connectedServices.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Data sources:</span>
            {connectedServices.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="text-[10px] border-verified/30 text-verified"
              >
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Company Info (from onboarding) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company Information</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">From onboarding</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldDisplay label="Company Name" field={a.company?.name} />
          <FieldDisplay label="Industry" field={a.company?.industry} />
          <FieldDisplay label="Country" field={a.company?.country} />
          <FieldDisplay label="Years in Operation" field={a.company?.yearsInOperation} />
        </div>
      </motion.section>

      {/* Financial Snapshot (from connected services) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Financial Data</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {connectedServices.length > 0 ? "From connected services" : "Connect a service to populate"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldDisplay label="Annual Revenue" field={a.financials?.annualRevenue} />
          <FieldDisplay label="EBITDA" field={a.financials?.ebitda} />
          <FieldDisplay label="Total Debt" field={a.financials?.totalDebt} />
          <FieldDisplay label="Cash Runway (months)" field={a.financials?.cashRunway} />
          <div className="col-span-2">
            <FieldDisplay label="Net Income" field={a.financials?.netIncome} />
          </div>
        </div>

        {connectedServices.length === 0 && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
            <AlertTriangle className="w-4 h-4 text-risk-medium shrink-0 mt-0.5" />
            <p className="text-xs text-risk-medium">
              No financial services connected. Go back and connect Xero, QuickBooks, or Stripe to auto-populate verified financial data.
            </p>
          </div>
        )}
      </motion.section>

      {/* Loan Request (from onboarding) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Loan Request</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">From onboarding</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldDisplay label="Loan Amount" field={a.loan?.amount} />
          <FieldDisplay label="Term" field={a.loan?.termMonths ? { ...a.loan.termMonths, value: `${a.loan.termMonths.value} months` } : undefined} />
          <div className="col-span-2">
            <FieldDisplay label="Purpose" field={a.loan?.purpose} />
          </div>
        </div>
      </motion.section>

      {/* Qualitative Insights (from chat interview) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-1.5">
          <MessageSquareText className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Interview Insights</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {qualitativeCount > 0 ? `${qualitativeCount} responses` : "From AI interview"}
          </span>
        </div>
        <div className="space-y-2">
          {[
            { key: "loanPurpose", label: "Loan Purpose" },
            { key: "growthStrategy", label: "Growth Strategy" },
            { key: "competitiveAdvantage", label: "Competitive Advantage" },
            { key: "useOfFunds", label: "Use of Funds" },
            { key: "repaymentPlan", label: "Repayment Plan" },
            { key: "marketConditions", label: "Market Conditions" },
            { key: "teamExperience", label: "Team Experience" },
            { key: "challengesAndRisks", label: "Challenges & Risks" },
          ].map(({ key, label }) => {
            const value = qualitative[key as keyof typeof qualitative];
            if (!value) return null;
            return (
              <div key={key} className="py-2.5 px-3 rounded-lg bg-card/60 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm leading-relaxed text-foreground/90">{value}</p>
              </div>
            );
          })}
          {qualitativeCount === 0 && (
            <div className="py-3 px-3 rounded-lg bg-muted/30 border border-border/30 text-center">
              <p className="text-sm text-muted-foreground/60 italic">
                Complete the AI interview in the chat panel to populate qualitative insights...
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Submit */}
      <Button
        className="w-full"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        <Send className="w-4 h-4 mr-2" />
        Submit for Assessment
      </Button>
      {!canSubmit && (
        <p className="text-[10px] text-center text-muted-foreground">
          {!hasFinancials ? "Connect a financial service to continue" : "Answer at least 2 interview questions to continue"}
        </p>
      )}
    </div>
  );
}
