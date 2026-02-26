"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Gift,
  BarChart2,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCountUp } from "@/hooks/useCountUp";
import {
  dashboardStats,
  monthlyGivingData,
  campaigns,
  gifts,
  fundBreakdownData,
} from "@/data/mock-data";
import { APP_CONFIG } from "@/lib/config";
import type { GiftStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

// SSR-safe dynamic chart imports
const GivingTrendsChart = dynamic(
  () =>
    import("@/components/dashboard/giving-trends-chart").then(
      (m) => m.GivingTrendsChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[260px] bg-muted/30 animate-pulse" style={{ borderRadius: "var(--radius)" }} />
    ),
  }
);

const FundAllocationChart = dynamic(
  () =>
    import("@/components/dashboard/fund-allocation-chart").then(
      (m) => m.FundAllocationChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] bg-muted/30 animate-pulse" style={{ borderRadius: "var(--radius)" }} />
    ),
  }
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number;
  format: "currency" | "integer" | "percent";
  change: number;
  changeType: "percent" | "absolute";
  description: string;
  index: number;
}

function StatCard({
  title,
  value,
  format,
  change,
  changeType,
  description,
  index,
}: StatCardProps) {
  const { count, ref } = useCountUp(value, 1100);

  const displayValue = useMemo(() => {
    const v = count;
    if (format === "currency") {
      if (v >= 1000000) return `$${(v / 1000000).toFixed(2)}M`;
      if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
      return `$${v.toFixed(2)}`;
    }
    if (format === "percent") return `${v.toFixed(1)}%`;
    return v.toLocaleString();
  }, [count, format]);

  const isPositive = change >= 0;

  return (
    <div
      ref={ref}
      className="aesthetic-card animate-fade-up-in"
      style={{
        padding: "var(--card-padding)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
      }}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </p>
      <p className="text-2xl font-bold font-mono tabular-nums mt-1 text-foreground">
        {displayValue}
      </p>
      <div className="flex items-center gap-1 mt-2">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-success" />
        ) : (
          <TrendingDown className="h-3 w-3 text-destructive" />
        )}
        <span
          className={cn(
            "text-xs font-medium font-mono",
            isPositive ? "text-success" : "text-destructive"
          )}
        >
          {isPositive ? "+" : ""}
          {changeType === "percent"
            ? `${change.toFixed(1)}%`
            : `${change > 0 ? "+" : ""}${change}`}
        </span>
        <span className="text-xs text-muted-foreground">· {description}</span>
      </div>
    </div>
  );
}

// ─── Gift Status Badge ────────────────────────────────────────────────────────

function GiftStatusBadge({ status }: { status: GiftStatus }) {
  const config: Record<
    GiftStatus,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    completed: {
      label: "Completed",
      icon: <CheckCircle2 className="h-3 w-3" />,
      className:
        "bg-success/10 text-success border-success/20 hover:bg-success/10",
    },
    pending: {
      label: "Pending",
      icon: <Clock className="h-3 w-3" />,
      className:
        "bg-warning/10 text-warning border-warning/20 hover:bg-warning/10",
    },
    declined: {
      label: "Declined",
      icon: <XCircle className="h-3 w-3" />,
      className:
        "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
    },
    refunded: {
      label: "Refunded",
      icon: <RotateCcw className="h-3 w-3" />,
      className:
        "bg-muted text-muted-foreground border-border hover:bg-muted",
    },
  };
  const { label, icon, className } = config[status];
  return (
    <Badge variant="outline" className={cn("gap-1 text-xs font-normal", className)}>
      {icon}
      {label}
    </Badge>
  );
}

// ─── Period filter options ────────────────────────────────────────────────────

type Period = "30d" | "90d" | "ytd";

const PERIODS: { value: Period; label: string }[] = [
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last Quarter" },
  { value: "ytd", label: "Year to Date" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("30d");

  // Filter monthly giving data based on period selection
  const chartData = useMemo(() => {
    if (period === "30d") return monthlyGivingData.slice(-1);
    if (period === "90d") return monthlyGivingData.slice(-3);
    return monthlyGivingData; // YTD: full 12 months
  }, [period]);

  // Recent gifts — last 9 by date
  const recentGifts = useMemo(
    () =>
      [...gifts]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 9),
    []
  );

  // Active and planned campaigns only
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active" || c.status === "planned"
  );

  const stats: StatCardProps[] = [
    {
      title: "Gifts This Month",
      value: dashboardStats.totalGiftsThisMonth,
      format: "integer",
      change: dashboardStats.totalGiftsChange,
      changeType: "percent",
      description: "vs. last month",
      index: 0,
    },
    {
      title: "Total Raised",
      value: dashboardStats.totalRaisedThisMonth,
      format: "currency",
      change: dashboardStats.totalRaisedChange,
      changeType: "percent",
      description: "MTD via BBMS",
      index: 1,
    },
    {
      title: "Active Recurring Donors",
      value: dashboardStats.recurringDonors,
      format: "integer",
      change: dashboardStats.recurringDonorsChange,
      changeType: "absolute",
      description: "new sustainers this month",
      index: 2,
    },
    {
      title: "Avg Gift Size",
      value: dashboardStats.avgGiftSize,
      format: "currency",
      change: dashboardStats.avgGiftSizeChange,
      changeType: "percent",
      description: "higher recurring mix",
      index: 3,
    },
  ];

  return (
    <div className="space-y-4">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div>
        <h1
          className="text-xl font-semibold text-foreground"
          style={{ letterSpacing: "var(--heading-tracking)" }}
        >
          Gift &amp; Donor Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Donation flow activity · Blackbaud SKY API + BBMS Checkout · February 2026
        </p>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* ── Giving Trends Chart with period filter ───────────────────── */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Giving Trends — One-Time vs. Recurring
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monthly gift volume by type · all funds
            </p>
          </div>
          {/* Period filter */}
          <div className="flex gap-1 shrink-0">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "px-2.5 py-1 text-xs border transition-colors",
                  "hover:bg-surface-hover",
                  period === p.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground"
                )}
                style={{
                  borderRadius: "var(--radius)",
                  transitionDuration: "var(--dur-fast)",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <GivingTrendsChart data={chartData} />
      </div>

      {/* ── Two-column: Campaign Performance + Recent Gifts ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* Campaign Performance */}
        <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Campaign Performance
            </h2>
          </div>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => {
              const pct =
                campaign.targetAmount > 0
                  ? Math.min(
                      (campaign.raisedAmount / campaign.targetAmount) * 100,
                      100
                    )
                  : 0;
              const isOverTarget = campaign.raisedAmount >= campaign.targetAmount;
              return (
                <div key={campaign.id}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {campaign.giftCount.toLocaleString()} gifts ·{" "}
                        <span
                          className={cn(
                            "font-medium",
                            campaign.status === "active"
                              ? "text-success"
                              : campaign.status === "planned"
                              ? "text-warning"
                              : "text-muted-foreground"
                          )}
                        >
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-semibold text-foreground">
                        ${campaign.raisedAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        of ${campaign.targetAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="h-1.5 bg-muted overflow-hidden"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <div
                      className={cn(
                        "h-full transition-all",
                        isOverTarget ? "bg-success" : "bg-primary"
                      )}
                      style={{
                        width: `${pct}%`,
                        transitionDuration: "600ms",
                        transitionTimingFunction: "ease-out",
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {pct.toFixed(1)}% of goal
                    {isOverTarget && (
                      <span className="text-success ml-1">· exceeded</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Gifts */}
        <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Recent Gift Transactions
            </h2>
          </div>
          <div className="space-y-0">
            {recentGifts.map((gift, i) => (
              <div
                key={gift.id}
                className={cn(
                  "flex items-center justify-between py-2 gap-2",
                  i < recentGifts.length - 1 ? "border-b border-border/60" : ""
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {gift.constituentName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {gift.fundName} ·{" "}
                    {gift.type === "recurring"
                      ? `${gift.frequency} recurring`
                      : "one-time"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <GiftStatusBadge status={gift.status} />
                  <span className="text-xs font-mono font-semibold text-foreground w-16 text-right">
                    ${gift.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fund Allocation Chart ────────────────────────────────────── */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Fund Allocation — Amounts Raised
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Funds receiving gifts through the WordPress donation form
            </p>
          </div>
        </div>
        <FundAllocationChart data={fundBreakdownData} />
        {/* Fund progress legend */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {fundBreakdownData.map((fund) => (
            <div
              key={fund.fundName}
              className="flex items-center justify-between gap-2 px-2 py-1.5 bg-muted/40"
              style={{ borderRadius: "var(--radius)" }}
            >
              <p className="text-xs text-muted-foreground truncate">
                {fund.fundName.replace(" Fund", "")}
              </p>
              <span className="text-xs font-mono font-semibold text-foreground shrink-0">
                {fund.goal
                  ? `${fund.percentage.toFixed(0)}%`
                  : "Open"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SKY API Status strip ─────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border border-border/60 bg-muted/30"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-xs font-medium text-foreground">
            SKY API + BBMS Checkout
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            <span className="text-success font-medium">4/6 endpoints healthy</span>
            &nbsp;·&nbsp;1 degraded&nbsp;·&nbsp;1 token refresh error
          </span>
          <span className="hidden sm:inline text-border/80">|</span>
          <a
            href="/api-health"
            className="hidden sm:inline text-primary hover:underline transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            View API Health →
          </a>
        </div>
      </div>

      {/* ── Bottom Banner ────────────────────────────────────────────── */}
      <div
        className="border border-primary/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          borderRadius: "var(--radius)",
          background:
            "linear-gradient(to right, color-mix(in oklch, var(--primary), transparent 92%), transparent)",
        }}
      >
        <div>
          <p className="text-sm font-medium text-foreground">
            This is a live demo built for{" "}
            {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            My Approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 transition-colors"
            style={{
              borderRadius: "var(--radius)",
              transitionDuration: "var(--dur-fast)",
            }}
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
