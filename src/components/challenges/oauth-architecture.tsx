import type { LucideIcon } from "lucide-react";
import { Database, RefreshCw, Server, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface ArchNode {
  label: string;
  sub: string;
  icon: LucideIcon;
  type: "plugin" | "store" | "authserver" | "token";
}

const NODES: ArchNode[] = [
  {
    label: "WordPress Plugin",
    sub: "Donation form handler",
    icon: Server,
    type: "plugin",
  },
  {
    label: "Encrypted Token Store",
    sub: "WP options table",
    icon: Database,
    type: "store",
  },
  {
    label: "SKY API Auth Server",
    sub: "Blackbaud OAuth2",
    icon: RefreshCw,
    type: "authserver",
  },
];

const nodeStyles: Record<ArchNode["type"], { border: string; bg: string; iconColor: string }> = {
  plugin: {
    border: "color-mix(in oklch, var(--primary) 35%, transparent)",
    bg: "color-mix(in oklch, var(--primary) 7%, transparent)",
    iconColor: "var(--primary)",
  },
  store: {
    border: "color-mix(in oklch, var(--accent) 35%, transparent)",
    bg: "color-mix(in oklch, var(--accent) 7%, transparent)",
    iconColor: "var(--accent)",
  },
  authserver: {
    border: "var(--border)",
    bg: "var(--muted)",
    iconColor: "var(--muted-foreground)",
  },
  token: {
    border: "color-mix(in oklch, var(--warning) 30%, transparent)",
    bg: "color-mix(in oklch, var(--warning) 8%, transparent)",
    iconColor: "var(--warning)",
  },
};

export function OAuthArchitecture() {
  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        OAuth2 token lifecycle
      </div>

      {/* Three nodes in a row */}
      <div className="grid grid-cols-3 gap-2">
        {NODES.map((node) => {
          const s = nodeStyles[node.type];
          return (
            <div
              key={node.label}
              className="flex flex-col items-center gap-1.5 px-2 py-3 rounded border text-center"
              style={{ borderColor: s.border, backgroundColor: s.bg }}
            >
              <node.icon className="h-5 w-5 shrink-0" style={{ color: s.iconColor }} />
              <p className="text-xs font-semibold leading-tight">{node.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{node.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Token lifecycle table */}
      <div className="border border-border rounded overflow-hidden">
        <div className="grid grid-cols-3 bg-muted border-b border-border text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="px-3 py-2">Token type</div>
          <div className="px-3 py-2">Lifetime</div>
          <div className="px-3 py-2">Handling</div>
        </div>
        <div className="grid grid-cols-3 text-xs border-b border-border/50">
          <div className="px-3 py-2 font-medium flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-primary shrink-0" />
            Access Token
          </div>
          <div className="px-3 py-2 text-muted-foreground">60 minutes</div>
          <div className="px-3 py-2">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)",
                color: "var(--primary)",
              }}
            >
              Auto-refresh cron
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 text-xs">
          <div className="px-3 py-2 font-medium flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-[color:var(--success)] shrink-0" />
            Refresh Token
          </div>
          <div className="px-3 py-2 text-muted-foreground">Long-lived</div>
          <div className="px-3 py-2">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "color-mix(in oklch, var(--success) 8%, transparent)",
                color: "var(--success)",
              }}
            >
              Encrypted storage
            </span>
          </div>
        </div>
      </div>

      {/* Failure recovery note */}
      <div
        className="flex items-center gap-2 rounded px-3 py-1.5 text-xs"
        style={{
          backgroundColor: "color-mix(in oklch, var(--warning) 6%, transparent)",
          borderColor: "color-mix(in oklch, var(--warning) 20%, transparent)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <AlertCircle className="h-3 w-3 text-[color:var(--warning)] shrink-0" />
        <span className="text-[color:var(--warning)] font-medium">
          Auth failures trigger graceful fallback — donors see a friendly retry, not a blank error
        </span>
      </div>
    </div>
  );
}
