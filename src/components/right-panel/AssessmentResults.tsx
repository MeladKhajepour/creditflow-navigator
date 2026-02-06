import { motion } from "framer-motion";
import { useAppState } from "@/context/AppContext";
import RiskGauge from "./RiskGauge";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Shield,
  Globe,
  Newspaper,
  Scale,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

const severityIcon = {
  low: <CheckCircle2 className="w-3.5 h-3.5 text-risk-low" />,
  medium: <AlertTriangle className="w-3.5 h-3.5 text-risk-medium" />,
  high: <XCircle className="w-3.5 h-3.5 text-risk-high" />,
  critical: <XCircle className="w-3.5 h-3.5 text-risk-critical" />,
};

const osintIcon = {
  country_risk: <Globe className="w-3.5 h-3.5" />,
  industry_risk: <TrendingUp className="w-3.5 h-3.5" />,
  news: <Newspaper className="w-3.5 h-3.5" />,
  regulatory: <Scale className="w-3.5 h-3.5" />,
};

const decisionColors = {
  approved: "bg-risk-low/10 text-risk-low border-risk-low/30",
  denied: "bg-risk-high/10 text-risk-high border-risk-high/30",
  conditional: "bg-risk-medium/10 text-risk-medium border-risk-medium/30",
};

export default function AssessmentResults() {
  const { assessment, isAssessing } = useAppState();
  const [osintOpen, setOsintOpen] = useState(false);

  if (isAssessing || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">Running Assessment</p>
          <p className="text-xs text-muted-foreground">AI agents are analyzing your application...</p>
        </div>
        <div className="flex gap-2">
          {["Orchestration", "Research", "Scoring", "Synthesis", "Final"].map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${i < 3 ? "bg-primary animate-pulse-glow" : "bg-muted"}`} />
              <span className="text-[9px] text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { riskScore, riskLevel, decision, recommendedRate, metrics, explanation, riskFactors, osintFindings, dataSources } = assessment;

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Decision Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-xl border text-center ${decisionColors[decision]}`}
      >
        <p className="text-xs uppercase tracking-widest font-semibold mb-1">Decision</p>
        <p className="text-2xl font-bold capitalize">{decision}</p>
        <p className="text-sm mt-1">Recommended Rate: {recommendedRate}%</p>
      </motion.div>

      {/* Risk Gauge + Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 flex justify-center"
        >
          <RiskGauge score={riskScore} level={riskLevel} />
        </motion.div>

        {[
          { label: "Probability of Default", value: `${(metrics.probabilityOfDefault * 100).toFixed(1)}%`, sub: "PD" },
          { label: "Exposure at Default", value: `$${metrics.exposureAtDefault.toLocaleString()}`, sub: "EAD" },
          { label: "Loss Given Default", value: `${(metrics.lossGivenDefault * 100).toFixed(0)}%`, sub: "LGD" },
          { label: "Expected Loss", value: `$${metrics.expectedLoss.toLocaleString()}`, sub: "EL" },
        ].map((m, i) => (
          <motion.div
            key={m.sub}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="p-3 rounded-xl bg-card/60 border border-border/30"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-bold font-mono">{m.value}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{m.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl bg-card/60 border border-border/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">AI Rationale</h3>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{explanation}</p>
      </motion.div>

      {/* Data Sources Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-4 rounded-xl bg-card/60 border border-border/30"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Data Sources</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex h-2 rounded-full overflow-hidden bg-muted">
              <div
                className="bg-verified rounded-full"
                style={{ width: `${(dataSources.verified / dataSources.total) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {dataSources.verified}/{dataSources.total} verified
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          {dataSources.sources.map((s) => (
            <Badge key={s.provider} variant="outline" className="text-[10px] border-verified/30 text-verified">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
              {s.provider} ({s.fieldCount} fields)
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Risk Factors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Flagged Risk Factors</h3>
        {riskFactors.map((rf) => (
          <div key={rf.id} className="flex items-start gap-2.5 p-3 rounded-lg bg-card/40 border border-border/20">
            {severityIcon[rf.severity]}
            <div>
              <p className="text-sm">{rf.description}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{rf.category}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* OSINT Findings */}
      <Collapsible open={osintOpen} onOpenChange={setOsintOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">OSINT Research</h3>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${osintOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2 mt-2">
            {osintFindings.map((finding, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-card/40 border border-border/20">
                <div className="mt-0.5 text-muted-foreground">{osintIcon[finding.category]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{finding.title}</p>
                    {severityIcon[finding.severity]}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{finding.summary}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Source: {finding.source}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
