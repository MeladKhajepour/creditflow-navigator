import type { RiskLevel } from "@/types";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

const levelColors: Record<RiskLevel, string> = {
  low: "hsl(var(--risk-low))",
  medium: "hsl(var(--risk-medium))",
  high: "hsl(var(--risk-high))",
  critical: "hsl(var(--risk-critical))",
};

const levelLabels: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical Risk",
};

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  const color = levelColors[level];
  // SVG arc: score 0-100 mapped to 180° arc
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="100" viewBox="0 0 180 100" className="risk-gauge-shadow">
        {/* Background arc */}
        <path
          d="M 10 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d="M 10 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="text-center -mt-8">
        <p className="text-3xl font-bold font-mono" style={{ color }}>
          {score}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{levelLabels[level]}</p>
      </div>
    </div>
  );
}
