"use client";

import { useState } from "react";
import { X, Check, RefreshCw } from "lucide-react";

interface BeforeAfterProps {
  before: {
    label: string;
    items: string[];
  };
  after: {
    label: string;
    items: string[];
  };
  interactive?: boolean;
}

export function BeforeAfter({ before, after, interactive = false }: BeforeAfterProps) {
  const [showAfter, setShowAfter] = useState(false);

  if (interactive) {
    return (
      <div className="space-y-3">
        {/* Toggle control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAfter(false)}
            className="text-xs font-medium px-3 py-1 rounded border transition-colors"
            style={{
              borderColor: !showAfter
                ? "color-mix(in oklch, var(--destructive) 40%, transparent)"
                : "var(--border)",
              backgroundColor: !showAfter
                ? "color-mix(in oklch, var(--destructive) 8%, transparent)"
                : "var(--card)",
              color: !showAfter ? "var(--destructive)" : "var(--muted-foreground)",
            }}
          >
            Without idempotency
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className="text-xs font-medium px-3 py-1 rounded border transition-colors"
            style={{
              borderColor: showAfter
                ? "color-mix(in oklch, var(--success) 40%, transparent)"
                : "var(--border)",
              backgroundColor: showAfter
                ? "color-mix(in oklch, var(--success) 8%, transparent)"
                : "var(--card)",
              color: showAfter ? "var(--success)" : "var(--muted-foreground)",
            }}
          >
            With idempotency key
          </button>
        </div>

        {/* Content panel */}
        {!showAfter ? (
          <div
            className="rounded border p-4 space-y-2"
            style={{
              borderColor: "color-mix(in oklch, var(--destructive) 25%, transparent)",
              backgroundColor: "color-mix(in oklch, var(--destructive) 5%, transparent)",
            }}
          >
            <p className="text-xs font-semibold text-destructive uppercase tracking-wide">
              {before.label}
            </p>
            <ul className="space-y-2">
              {before.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-destructive">
                  <X className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div
            className="rounded border p-4 space-y-2"
            style={{
              borderColor: "color-mix(in oklch, var(--success) 25%, transparent)",
              backgroundColor: "color-mix(in oklch, var(--success) 5%, transparent)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--success)" }}
            >
              {after.label}
            </p>
            <ul className="space-y-2">
              {after.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--success)" }}>
                  <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sequence diagram */}
        <div className="border border-border rounded overflow-hidden">
          <div className="bg-muted px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
            Retry sequence — {showAfter ? "with idempotency key" : "no idempotency key"}
          </div>
          <div className="divide-y divide-border/50">
            {(showAfter
              ? [
                  { step: "1", label: "Donor submits form", status: "ok" },
                  { step: "2", label: "BBMS charges card → success", status: "ok" },
                  { step: "3", label: "SKY API gift creation → network timeout", status: "warn" },
                  { step: "4", label: "Plugin retries with same idempotency key", status: "ok" },
                  { step: "5", label: "SKY API recognizes duplicate → returns original result", status: "ok" },
                  { step: "6", label: "Gift record confirmed — no double charge", status: "ok" },
                ]
              : [
                  { step: "1", label: "Donor submits form", status: "ok" },
                  { step: "2", label: "BBMS charges card → success", status: "ok" },
                  { step: "3", label: "SKY API gift creation → network timeout", status: "warn" },
                  { step: "4", label: "Plugin retries without idempotency key", status: "err" },
                  { step: "5", label: "BBMS charges card again → duplicate charge", status: "err" },
                  { step: "6", label: "Two gift records in SKY API → manual cleanup required", status: "err" },
                ]
            ).map((row) => (
              <div key={row.step} className="flex items-center gap-3 px-3 py-2 text-xs">
                <span className="font-mono text-muted-foreground w-4 shrink-0">{row.step}</span>
                <span
                  className="flex-1"
                  style={{
                    color:
                      row.status === "err"
                        ? "var(--destructive)"
                        : row.status === "warn"
                        ? "var(--warning-foreground)"
                        : "var(--foreground)",
                  }}
                >
                  {row.label}
                </span>
                <span className="shrink-0">
                  {row.status === "ok" && (
                    <Check className="h-3 w-3 text-[color:var(--success)]" />
                  )}
                  {row.status === "warn" && (
                    <RefreshCw className="h-3 w-3 text-[color:var(--warning)]" />
                  )}
                  {row.status === "err" && (
                    <X className="h-3 w-3 text-destructive" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Non-interactive: side-by-side
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        className="rounded border p-4 space-y-2"
        style={{
          borderColor: "color-mix(in oklch, var(--destructive) 25%, transparent)",
          backgroundColor: "color-mix(in oklch, var(--destructive) 5%, transparent)",
        }}
      >
        <p className="text-xs font-semibold text-destructive uppercase tracking-wide">
          {before.label}
        </p>
        <ul className="space-y-1.5">
          {before.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-destructive">
              <X className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div
        className="rounded border p-4 space-y-2"
        style={{
          borderColor: "color-mix(in oklch, var(--success) 25%, transparent)",
          backgroundColor: "color-mix(in oklch, var(--success) 5%, transparent)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--success)" }}
        >
          {after.label}
        </p>
        <ul className="space-y-1.5">
          {after.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--success)" }}>
              <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
