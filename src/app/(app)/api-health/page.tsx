"use client";

import { useState, useEffect } from "react";
import { apiHealthEntries } from "@/data/mock-data";
import type { ApiHealthStatus, ApiService } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Key,
  Zap,
  Server,
  Lock,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getTokenTimeRemaining(expiry: string | null): {
  label: string;
  urgent: boolean;
} {
  if (!expiry) return { label: "N/A", urgent: false };
  const now = new Date("2026-02-26T14:52:30Z").getTime();
  const exp = new Date(expiry).getTime();
  const diff = exp - now;
  if (diff <= 0) return { label: "Expired", urgent: true };
  const mins = Math.floor(diff / 60000);
  if (mins < 5) return { label: `${mins}m remaining`, urgent: true };
  if (mins < 60) return { label: `${mins}m remaining`, urgent: false };
  const hrs = Math.floor(mins / 60);
  return { label: `${hrs}h ${mins % 60}m remaining`, urgent: false };
}

// ── Status Components ─────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: ApiHealthStatus }) {
  if (status === "healthy") {
    return <CheckCircle2 className="w-4 h-4 text-[color:var(--success)]" />;
  }
  if (status === "degraded") {
    return <AlertTriangle className="w-4 h-4 text-[color:var(--warning)]" />;
  }
  return <XCircle className="w-4 h-4 text-destructive" />;
}

function StatusDot({ status }: { status: ApiHealthStatus }) {
  const colorClass =
    status === "healthy"
      ? "bg-[color:var(--success)]"
      : status === "degraded"
      ? "bg-[color:var(--warning)]"
      : "bg-destructive";
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {status === "healthy" && (
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            colorClass
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          colorClass
        )}
      />
    </span>
  );
}

function StatusBadge({ status }: { status: ApiHealthStatus }) {
  const config: Record<
    ApiHealthStatus,
    { label: string; className: string }
  > = {
    healthy: {
      label: "Healthy",
      className: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    degraded: {
      label: "Degraded",
      className: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    error: {
      label: "Error",
      className: "text-destructive bg-destructive/10",
    },
  };
  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-sm px-1.5 py-0.5",
        c.className
      )}
    >
      {c.label}
    </Badge>
  );
}

function ResponseTimeBadge({ ms }: { ms: number }) {
  const good = ms < 500;
  const warn = ms >= 500 && ms < 2000;
  const className = good
    ? "text-[color:var(--success)] bg-[color:var(--success)]/10"
    : warn
    ? "text-[color:var(--warning)] bg-[color:var(--warning)]/10"
    : "text-destructive bg-destructive/10";
  if (ms === 0) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <span
      className={cn(
        "font-mono text-xs font-medium px-1.5 py-0.5 rounded-sm",
        className
      )}
    >
      {ms}ms
    </span>
  );
}

// ── Service Summary Card ──────────────────────────────────────────────────────

function ServiceSummaryCard({
  service,
  label,
  icon,
}: {
  service: ApiService;
  label: string;
  icon: React.ReactNode;
}) {
  const serviceEntries = apiHealthEntries.filter((e) => e.service === service);
  const allHealthy = serviceEntries.every((e) => e.status === "healthy");
  const hasError = serviceEntries.some((e) => e.status === "error");
  const overallStatus: ApiHealthStatus = hasError
    ? "error"
    : allHealthy
    ? "healthy"
    : "degraded";
  const avgResponseTime = Math.round(
    serviceEntries.filter((e) => e.responseTime > 0).reduce(
      (sum, e) => sum + e.responseTime,
      0
    ) /
      Math.max(
        serviceEntries.filter((e) => e.responseTime > 0).length,
        1
      )
  );

  return (
    <Card className="border border-border rounded-sm shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-primary/8 flex items-center justify-center text-primary">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{label}</p>
                <StatusDot status={overallStatus} />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                {serviceEntries.length} endpoint
                {serviceEntries.length !== 1 ? "s" : ""} monitored
              </p>
            </div>
          </div>
          <StatusBadge status={overallStatus} />
        </div>
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
              Avg Response
            </p>
            <p className="text-xs font-mono font-semibold mt-0.5">
              {avgResponseTime}ms
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
              Healthy / Total
            </p>
            <p className="text-xs font-mono font-semibold mt-0.5">
              {serviceEntries.filter((e) => e.status === "healthy").length} /{" "}
              {serviceEntries.length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── OAuth2 Token Panel ────────────────────────────────────────────────────────

function OAuthTokenPanel() {
  const tokenEntry = apiHealthEntries.find(
    (e) => e.endpoint === "OAuth2 Token Refresh"
  );
  const regularEntries = apiHealthEntries.filter(
    (e) => e.service === "sky-api" && e.endpoint !== "OAuth2 Token Refresh"
  );
  const sampleTokenExpiry = regularEntries[0]?.tokenExpiry ?? null;

  const accessToken = getTokenTimeRemaining(sampleTokenExpiry);
  const refreshTokenStatus: ApiHealthStatus =
    tokenEntry?.status ?? "healthy";

  return (
    <Card className="border border-border rounded-sm shadow-none">
      <CardHeader className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">OAuth2 Token Lifecycle</h3>
          <span className="text-[10px] text-muted-foreground ml-auto font-mono">
            SKY API Authentication
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* Access token */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Access Token</p>
              <p className="text-[10px] text-muted-foreground">
                Short-lived bearer token — 60 min TTL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-mono font-medium",
                accessToken.urgent
                  ? "text-[color:var(--warning)]"
                  : "text-[color:var(--success)]"
              )}
            >
              {accessToken.label}
            </span>
            <StatusBadge status={accessToken.urgent ? "degraded" : "healthy"} />
          </div>
        </div>

        {/* Refresh token */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Refresh Token</p>
              <p className="text-[10px] text-muted-foreground">
                Long-lived credential — triggers access token renewal
              </p>
            </div>
          </div>
          <StatusBadge status={refreshTokenStatus} />
        </div>

        {/* Auto-refresh indicator */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Auto-Refresh Handler</p>
              <p className="text-[10px] text-muted-foreground">
                WordPress hook fires 5 min before expiry
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {refreshTokenStatus === "error" ? (
              <>
                <XCircle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs text-destructive font-medium">
                  Re-auth required
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[color:var(--success)]" />
                <span className="text-xs text-[color:var(--success)] font-medium">
                  Monitoring active
                </span>
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {tokenEntry?.errorMessage && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-sm p-2 mt-1">
            <p className="text-[11px] text-destructive">
              {tokenEntry.errorMessage}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Endpoint Table ────────────────────────────────────────────────────────────

function EndpointTable({
  serviceLabel,
  serviceKey,
}: {
  serviceLabel: string;
  serviceKey: ApiService;
}) {
  const entries = apiHealthEntries.filter(
    (e) => e.service === serviceKey && e.endpoint !== "OAuth2 Token Refresh"
  );

  return (
    <Card className="border border-border rounded-sm shadow-none">
      <CardHeader className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">{serviceLabel} — Endpoints</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {entries.map((entry) => {
            const token = getTokenTimeRemaining(entry.tokenExpiry);
            return (
              <div key={entry.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      <StatusIcon status={entry.status} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-medium text-foreground truncate">
                        {entry.endpoint}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Last checked {formatDateTime(entry.lastCheck)}
                        </span>
                        {entry.tokenExpiry && (
                          <span
                            className={cn(
                              "text-[10px] font-mono",
                              token.urgent
                                ? "text-[color:var(--warning)]"
                                : "text-muted-foreground"
                            )}
                          >
                            Token: {token.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ResponseTimeBadge ms={entry.responseTime} />
                    <StatusBadge status={entry.status} />
                  </div>
                </div>
                {entry.errorMessage && (
                  <div className="mt-2 ml-6 bg-destructive/5 border border-destructive/20 rounded-sm p-2">
                    <p className="text-[11px] text-destructive">
                      {entry.errorMessage}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Error Log ─────────────────────────────────────────────────────────────────

function ErrorLog() {
  const errors = apiHealthEntries.filter(
    (e) => e.status === "error" || e.status === "degraded"
  );

  if (errors.length === 0) {
    return (
      <Card className="border border-border rounded-sm shadow-none">
        <CardContent className="px-4 py-6 text-center">
          <ShieldCheck className="w-6 h-6 text-[color:var(--success)] mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No active errors or degraded endpoints.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border rounded-sm shadow-none">
      <CardHeader className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-destructive" />
          <h3 className="text-sm font-semibold">Active Issues</h3>
          <Badge
            variant="outline"
            className="text-xs font-medium border-0 rounded-sm px-1.5 py-0.5 text-destructive bg-destructive/10 ml-auto"
          >
            {errors.length} issue{errors.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {errors.map((entry) => (
            <div key={entry.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <StatusIcon status={entry.status} />
                  <div>
                    <p className="text-xs font-mono font-medium">
                      {entry.endpoint}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {entry.service === "sky-api"
                        ? "Blackbaud SKY API"
                        : "BBMS Checkout"}{" "}
                      &middot; {formatDateTime(entry.lastCheck)}
                    </p>
                    {entry.errorMessage && (
                      <p className="text-[11px] text-destructive mt-1">
                        {entry.errorMessage}
                      </p>
                    )}
                  </div>
                </div>
                <StatusBadge status={entry.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ApiHealthPage() {
  const [lastRefreshed, setLastRefreshed] = useState("2:52:30 PM");
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      const now = new Date();
      setLastRefreshed(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 800);
  }

  // Live-ish clock for "last checked" feel
  useEffect(() => {
    // No-op: times are static from mock data
  }, []);

  const activeErrors = apiHealthEntries.filter((e) => e.status === "error").length;
  const degraded = apiHealthEntries.filter((e) => e.status === "degraded").length;
  const overallStatus: ApiHealthStatus =
    activeErrors > 0 ? "error" : degraded > 0 ? "degraded" : "healthy";

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">API Health</h1>
            <div className="flex items-center gap-1.5">
              <StatusDot status={overallStatus} />
              <StatusBadge status={overallStatus} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            SKY API and BBMS Checkout connection status &middot; OAuth2 token
            lifecycle monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-muted-foreground">
            Updated {lastRefreshed}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 rounded-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={cn("w-3 h-3 mr-1", refreshing && "animate-spin")}
            />
            {refreshing ? "Checking..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Service Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ServiceSummaryCard
          service="sky-api"
          label="Blackbaud SKY API"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <ServiceSummaryCard
          service="bbms-checkout"
          label="BBMS Checkout"
          icon={<Zap className="w-4 h-4" />}
        />
      </div>

      {/* Active Issues */}
      <ErrorLog />

      {/* OAuth2 Token Lifecycle */}
      <OAuthTokenPanel />

      {/* Endpoint Details */}
      <div className="space-y-3">
        <EndpointTable
          serviceLabel="Blackbaud SKY API"
          serviceKey="sky-api"
        />
        <EndpointTable
          serviceLabel="BBMS Checkout"
          serviceKey="bbms-checkout"
        />
      </div>
    </div>
  );
}
