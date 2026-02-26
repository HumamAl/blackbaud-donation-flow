import type { LucideIcon } from "lucide-react";
import { ArrowRight, CreditCard, Shield, Key, Server, CheckCircle } from "lucide-react";

interface FlowStep {
  label: string;
  sub: string;
  icon: LucideIcon;
  highlight?: boolean;
  status?: "secure";
}

const BBMS_FLOW: FlowStep[] = [
  {
    label: "Donor enters card",
    sub: "BBMS iframe",
    icon: CreditCard,
  },
  {
    label: "Iframe captures",
    sub: "Cross-origin isolation",
    icon: Shield,
    highlight: true,
  },
  {
    label: "Blackbaud tokenizes",
    sub: "PCI DSS scope",
    icon: Key,
    highlight: true,
  },
  {
    label: "Token returned",
    sub: "PostMessage callback",
    icon: Server,
  },
  {
    label: "Gift created",
    sub: "SKY API call",
    icon: CheckCircle,
  },
];

export function FlowDiagram() {
  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Payment tokenization flow
      </div>

      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start gap-1 flex-wrap">
        {BBMS_FLOW.map((step, i) => (
          <div key={step.label} className="flex items-center gap-1">
            <div
              className="flex flex-col items-center gap-1 px-3 py-2 rounded border text-center min-w-[100px]"
              style={{
                borderColor: step.highlight
                  ? "color-mix(in oklch, var(--primary) 40%, transparent)"
                  : "var(--border)",
                backgroundColor: step.highlight
                  ? "color-mix(in oklch, var(--primary) 6%, transparent)"
                  : "var(--card)",
              }}
            >
              <step.icon
                className="h-4 w-4 shrink-0"
                style={{ color: step.highlight ? "var(--primary)" : "var(--muted-foreground)" }}
              />
              <p className="text-xs font-medium leading-tight">{step.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{step.sub}</p>
            </div>
            {i < BBMS_FLOW.length - 1 && (
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col gap-1">
        {BBMS_FLOW.map((step, i) => (
          <div key={step.label} className="flex flex-col">
            <div
              className="flex items-center gap-3 px-3 py-2 rounded border"
              style={{
                borderColor: step.highlight
                  ? "color-mix(in oklch, var(--primary) 40%, transparent)"
                  : "var(--border)",
                backgroundColor: step.highlight
                  ? "color-mix(in oklch, var(--primary) 6%, transparent)"
                  : "var(--card)",
              }}
            >
              <step.icon
                className="h-4 w-4 shrink-0"
                style={{ color: step.highlight ? "var(--primary)" : "var(--muted-foreground)" }}
              />
              <div>
                <p className="text-xs font-medium">{step.label}</p>
                <p className="text-[10px] text-muted-foreground">{step.sub}</p>
              </div>
            </div>
            {i < BBMS_FLOW.length - 1 && (
              <div className="flex justify-center py-0.5">
                <div className="w-px h-3 bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PCI note */}
      <div
        className="flex items-center gap-2 rounded px-3 py-1.5 text-xs"
        style={{
          backgroundColor: "color-mix(in oklch, var(--primary) 5%, transparent)",
          borderColor: "color-mix(in oklch, var(--primary) 15%, transparent)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <Shield className="h-3 w-3 text-primary shrink-0" />
        <span className="text-primary font-medium">
          Raw card data never reaches the WordPress server
        </span>
      </div>
    </div>
  );
}
