import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopNav from "@/components/layout/TopNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Loader2,
  ChevronRight,
} from "lucide-react";
import type {
  PolicyRule,
  PolicyDiff,
  EvalTestCase,
  AgentActivityLog,
  AgentStepStatus,
} from "@/types";
import {
  getPolicyRules,
  getPolicyDiffs,
  getEvalResults,
  getAgentLog,
} from "@/services/api";
import { mockApplication, mockAssessment, mockOverrides } from "@/data/mock-data";

const statusColors: Record<AgentStepStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/20 text-primary",
  complete: "bg-risk-low/20 text-risk-low",
  error: "bg-risk-high/20 text-risk-high",
};

const decisionBadge = {
  approved: "bg-risk-low/10 text-risk-low border-risk-low/30",
  denied: "bg-risk-high/10 text-risk-high border-risk-high/30",
  conditional: "bg-risk-medium/10 text-risk-medium border-risk-medium/30",
  pending: "bg-muted text-muted-foreground border-border/30",
  overridden: "bg-primary/10 text-primary border-primary/30",
};

export default function AdminDashboard() {
  const [policyRules, setPolicyRules] = useState<PolicyRule[]>([]);
  const [policyDiffs, setPolicyDiffs] = useState<PolicyDiff[]>([]);
  const [evalCases, setEvalCases] = useState<EvalTestCase[]>([]);
  const [agentLog, setAgentLog] = useState<AgentActivityLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [rules, diffs, evals, log] = await Promise.all([
        getPolicyRules(),
        getPolicyDiffs(),
        getEvalResults(),
        getAgentLog("ASM-2024-0847"),
      ]);
      setPolicyRules(rules);
      setPolicyDiffs(diffs);
      setEvalCases(evals);
      setAgentLog(log);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <TopNav />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const passRate = evalCases.filter((c) => c.pass).length;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Internal tools for case management, policy tuning, and agent transparency.
            </p>
          </div>

          <Tabs defaultValue="cases" className="space-y-4">
            <TabsList className="bg-surface-2 border border-border/30">
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="policy">Policy Dashboard</TabsTrigger>
              <TabsTrigger value="agents">Agent Log</TabsTrigger>
            </TabsList>

            {/* ===== CASES TAB ===== */}
            <TabsContent value="cases" className="space-y-4">
              <div className="rounded-xl border border-border/30 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-2">
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Application</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Decision</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    <tr className="hover:bg-surface-2/50 transition-colors">
                      <td className="p-3 font-mono text-xs">{mockApplication.id}</td>
                      <td className="p-3">{mockApplication.company.name.value}</td>
                      <td className="p-3 font-mono font-bold">{mockAssessment.riskScore}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] ${decisionBadge[mockAssessment.decision]}`}>
                          {mockAssessment.decision}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] ${decisionBadge[mockApplication.status]}`}>
                          {mockApplication.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </td>
                    </tr>
                    {/* Mock second row */}
                    <tr className="hover:bg-surface-2/50 transition-colors">
                      <td className="p-3 font-mono text-xs">APP-2024-0843</td>
                      <td className="p-3">RetailMax Corp</td>
                      <td className="p-3 font-mono font-bold">35</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] ${decisionBadge.conditional}`}>
                          conditional
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] ${decisionBadge.overridden}`}>
                          overridden
                        </Badge>
                      </td>
                      <td className="p-3">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Override History */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Overrides</h3>
                {mockOverrides.map((o) => (
                  <div key={o.id} className="p-3 rounded-xl bg-card/60 border border-border/30 flex items-start gap-3">
                    <ArrowRightLeft className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{o.applicationId}</span>
                        <Badge variant="outline" className={`text-[10px] ${decisionBadge[o.originalDecision]}`}>
                          {o.originalDecision}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="outline" className={`text-[10px] ${decisionBadge[o.newDecision]}`}>
                          {o.newDecision}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{o.explanation}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        By {o.overriddenBy} — {new Date(o.overriddenAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ===== POLICY TAB ===== */}
            <TabsContent value="policy" className="space-y-6">
              {/* Current Rules */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Current Policy Rules</h3>
                <div className="grid grid-cols-2 gap-3">
                  {policyRules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-card/60 border border-border/30"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{rule.name}</p>
                        <Badge variant="outline" className="text-[10px]">{rule.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                      <p className="text-lg font-bold font-mono mt-2">
                        {typeof rule.currentValue === "number" && rule.currentValue < 1
                          ? `${(rule.currentValue * 100).toFixed(0)}%`
                          : rule.currentValue}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Policy Diffs */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Change History</h3>
                {policyDiffs.map((diff) => (
                  <div key={diff.id} className="p-3 rounded-xl bg-card/60 border border-border/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{new Date(diff.changedAt).toLocaleDateString()}</span>
                      <span className="text-xs font-medium">{diff.ruleName}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-sm">
                      <span className="text-risk-high line-through">{String(diff.previousValue)}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-risk-low">{String(diff.newValue)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{diff.reason}</p>
                  </div>
                ))}
              </div>

              {/* Eval Suite */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Eval Suite</h3>
                  <Badge variant="outline" className={`text-xs ${passRate === evalCases.length ? "text-risk-low border-risk-low/30" : "text-risk-medium border-risk-medium/30"}`}>
                    {passRate}/{evalCases.length} passing
                  </Badge>
                </div>
                <div className="rounded-xl border border-border/30 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-2">
                        <th className="text-left p-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Company</th>
                        <th className="text-left p-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Expected</th>
                        <th className="text-left p-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Actual</th>
                        <th className="text-left p-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Score Δ</th>
                        <th className="text-center p-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Pass</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {evalCases.map((tc) => (
                        <tr key={tc.id} className="hover:bg-surface-2/50">
                          <td className="p-2.5">{tc.companyName}</td>
                          <td className="p-2.5">
                            <Badge variant="outline" className={`text-[10px] ${decisionBadge[tc.expectedDecision]}`}>
                              {tc.expectedDecision} ({tc.expectedScore})
                            </Badge>
                          </td>
                          <td className="p-2.5">
                            <Badge variant="outline" className={`text-[10px] ${decisionBadge[tc.actualDecision]}`}>
                              {tc.actualDecision} ({tc.actualScore})
                            </Badge>
                          </td>
                          <td className="p-2.5 font-mono text-xs">
                            {tc.actualScore - tc.expectedScore > 0 ? "+" : ""}
                            {tc.actualScore - tc.expectedScore}
                          </td>
                          <td className="p-2.5 text-center">
                            {tc.pass ? (
                              <CheckCircle2 className="w-4 h-4 text-risk-low mx-auto" />
                            ) : (
                              <XCircle className="w-4 h-4 text-risk-high mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* ===== AGENT LOG TAB ===== */}
            <TabsContent value="agents" className="space-y-4">
              {agentLog && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Assessment Pipeline — {agentLog.assessmentId}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      Total: {(agentLog.totalDurationMs / 1000).toFixed(1)}s
                    </span>
                  </div>

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border/50" />

                    <div className="space-y-4">
                      {agentLog.steps.map((step, i) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 relative"
                        >
                          {/* Status dot */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${statusColors[step.status]}`}>
                            {step.status === "complete" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : step.status === "error" ? (
                              <XCircle className="w-4 h-4" />
                            ) : step.status === "in-progress" ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-3 rounded-xl bg-card/60 border border-border/30">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{step.name}</h4>
                              {step.durationMs && (
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {(step.durationMs / 1000).toFixed(1)}s
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                            {step.output && (
                              <div className="mt-2 p-2 rounded-md bg-surface-1 border border-border/20">
                                <p className="text-xs font-mono text-foreground/80">{step.output}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
