import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface ChallengeCardProps {
  index: number;
  title: string;
  description: string;
  outcome?: string;
  children?: ReactNode;
}

export function ChallengeCard({
  index,
  title,
  description,
  outcome,
  children,
}: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="bg-card border border-border rounded p-5 space-y-4"
      style={{ boxShadow: "0 1px 2px oklch(0 0 0 / 0.06)" }}
    >
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-sm font-bold text-muted-foreground tabular-nums w-7 shrink-0">
            {stepNumber}
          </span>
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed pl-10">
          {description}
        </p>
      </div>

      {/* Visualization slot */}
      {children && <div className="pl-0">{children}</div>}

      {/* Outcome statement */}
      {outcome && (
        <div
          className="flex items-start gap-2 rounded px-3 py-2"
          style={{
            backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
            borderColor: "color-mix(in oklch, var(--success) 15%, transparent)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-[color:var(--success)]" />
          <p className="text-sm font-medium text-[color:var(--success)]">{outcome}</p>
        </div>
      )}
    </div>
  );
}
