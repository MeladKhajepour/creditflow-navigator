import { motion } from "framer-motion";
import { useAppState } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, FileText, Send } from "lucide-react";
import type { VerifiedField } from "@/types";

function VerifiedBadge({ source }: { source: string }) {
  if (source === "self-reported") return null;
  const label = source.charAt(0).toUpperCase() + source.slice(1);
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-verified font-medium ml-2">
      <CheckCircle2 className="w-3 h-3" />
      Verified via {label}
    </span>
  );
}

function FieldDisplay({ label, field }: { label: string; field?: VerifiedField }) {
  if (!field || field.value === undefined || field.value === "") {
    return (
      <div className="py-2.5 px-3 rounded-lg bg-muted/30 border border-border/30">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-muted-foreground/60 italic">Awaiting input...</p>
      </div>
    );
  }

  const displayValue =
    typeof field.value === "number" && field.value > 1000
      ? `$${field.value.toLocaleString()}`
      : String(field.value);

  return (
    <div
      className={`py-2.5 px-3 rounded-lg border ${
        field.source !== "self-reported"
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
  const { application, applicationComplete, setRightPanelStage, setIsAssessing, setAssessment, addMessage } = useAppState();
  const a = application as any;
  const percent = application.completionPercent ?? 0;

  const handleSubmit = () => {
    setRightPanelStage("assessment-results");
    setIsAssessing(true);
    addMessage({
      id: `ai-assess-${Date.now()}`,
      role: "ai",
      content: "Running your assessment now. This typically takes about 20 seconds while our AI agents analyze your data...",
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

  const connectedServices = application.connectedServices ?? [];

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Loan Application</h2>
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

      {/* Company Info */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company Information</h3>
        <div className="grid grid-cols-2 gap-2">
          <FieldDisplay label="Company Name" field={a.company?.name} />
          <FieldDisplay label="Industry" field={a.company?.industry} />
          <FieldDisplay label="Country" field={a.company?.country} />
          <FieldDisplay label="Years in Operation" field={a.company?.yearsInOperation} />
        </div>
      </motion.section>

      {/* Financial Snapshot */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Financial Snapshot</h3>
        <div className="grid grid-cols-2 gap-2">
          <FieldDisplay label="Annual Revenue" field={a.financials?.annualRevenue} />
          <FieldDisplay label="EBITDA" field={a.financials?.ebitda} />
          <FieldDisplay label="Total Debt" field={a.financials?.totalDebt} />
          <FieldDisplay label="Cash Runway (months)" field={a.financials?.cashRunway} />
        </div>
      </motion.section>

      {/* Loan Request */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Loan Request</h3>
        <div className="grid grid-cols-2 gap-2">
          <FieldDisplay label="Loan Amount" field={a.loan?.amount} />
          <FieldDisplay label="Term" field={a.loan?.termMonths ? { ...a.loan.termMonths, value: `${a.loan.termMonths.value} months` } : undefined} />
          <div className="col-span-2">
            <FieldDisplay label="Purpose" field={a.loan?.purpose} />
          </div>
        </div>
      </motion.section>

      {/* Unverified warning */}
      {connectedServices.length === 0 && percent > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
          <AlertTriangle className="w-4 h-4 text-risk-medium shrink-0 mt-0.5" />
          <p className="text-xs text-risk-medium">
            All data is self-reported. Connecting a financial service would add verification badges and strengthen your application.
          </p>
        </div>
      )}

      {/* Submit */}
      <Button
        className="w-full"
        disabled={!applicationComplete}
        onClick={handleSubmit}
      >
        <Send className="w-4 h-4 mr-2" />
        Submit for Assessment
      </Button>
    </div>
  );
}
