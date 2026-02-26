"use client";

import { useState, useMemo } from "react";
import {
  campaigns,
  funds,
  getAppealsByCampaign,
} from "@/data/mock-data";
import type { CampaignStatus, Fund } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Target,
  Layers,
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  Users,
  Share2,
  MailOpen,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatCurrencyFull(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function progressPercent(raised: number, target: number) {
  if (target === 0) return 100;
  return Math.min(Math.round((raised / target) * 100), 100);
}

// ── Status Badge ─────────────────────────────────────────────────────────────

function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const config: Record<CampaignStatus, { label: string; className: string }> = {
    active: {
      label: "Active",
      className: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    completed: {
      label: "Completed",
      className: "text-muted-foreground bg-muted",
    },
    planned: {
      label: "Planned",
      className: "text-primary bg-primary/8",
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

function FundCategoryBadge({
  category,
}: {
  category: Fund["category"];
}) {
  const config: Record<
    Fund["category"],
    { label: string; className: string }
  > = {
    general: {
      label: "General",
      className: "text-muted-foreground bg-muted",
    },
    restricted: {
      label: "Restricted",
      className: "text-primary bg-primary/8",
    },
    endowment: {
      label: "Endowment",
      className: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    capital: {
      label: "Capital",
      className:
        "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    emergency: {
      label: "Emergency",
      className: "text-destructive bg-destructive/10",
    },
  };
  const c = config[category];
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

function AppealChannelIcon({ channel }: { channel: string }) {
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="w-3 h-3" />,
    direct_mail: <MailOpen className="w-3 h-3" />,
    phone: <Phone className="w-3 h-3" />,
    online: <Globe className="w-3 h-3" />,
    event: <Users className="w-3 h-3" />,
    social: <Share2 className="w-3 h-3" />,
  };
  return icons[channel] ?? <Target className="w-3 h-3" />;
}

// ── View Toggle ───────────────────────────────────────────────────────────────

type ViewMode = "campaigns" | "funds";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [view, setView] = useState<ViewMode>("campaigns");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(
    null
  );

  const displayedCampaigns = useMemo(() => {
    if (statusFilter === "all") return campaigns;
    return campaigns.filter((c) => c.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Campaigns &amp; Funds
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fundraising campaigns, appeals, and designated fund allocations
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-border rounded-sm overflow-hidden shrink-0">
          <button
            onClick={() => setView("campaigns")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors duration-75",
              view === "campaigns"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            )}
          >
            <Target className="w-3 h-3" />
            Campaigns
          </button>
          <button
            onClick={() => setView("funds")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors duration-75",
              view === "funds"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            )}
          >
            <Layers className="w-3 h-3" />
            Funds
          </button>
        </div>
      </div>

      {/* ── Campaigns View ───────────────────────────────────────────────────── */}
      {view === "campaigns" && (
        <div className="space-y-3">
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(
              [
                { value: "all", label: "All Campaigns" },
                { value: "active", label: "Active" },
                { value: "planned", label: "Planned" },
                { value: "completed", label: "Completed" },
              ] as { value: string; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-medium border transition-colors duration-75",
                  statusFilter === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
            <span className="text-xs text-muted-foreground ml-auto">
              {displayedCampaigns.length} campaign
              {displayedCampaigns.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Campaign cards */}
          {displayedCampaigns.length === 0 ? (
            <div className="border border-border rounded-sm p-8 text-center text-sm text-muted-foreground">
              No campaigns match this filter.
            </div>
          ) : (
            <div className="space-y-2">
              {displayedCampaigns.map((campaign) => {
                const pct = progressPercent(
                  campaign.raisedAmount,
                  campaign.targetAmount
                );
                const campaignAppeals = getAppealsByCampaign(campaign.id);
                const isExpanded = expandedCampaignId === campaign.id;
                const exceeded = campaign.raisedAmount > campaign.targetAmount;

                return (
                  <Card
                    key={campaign.id}
                    className="border border-border rounded-sm shadow-none"
                  >
                    <CardHeader
                      className="p-3 cursor-pointer"
                      onClick={() =>
                        setExpandedCampaignId(isExpanded ? null : campaign.id)
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold truncate">
                              {campaign.name}
                            </h3>
                            <CampaignStatusBadge status={campaign.status} />
                            {exceeded && (
                              <Badge
                                variant="outline"
                                className="text-xs font-medium border-0 rounded-sm px-1.5 py-0.5 text-[color:var(--success)] bg-[color:var(--success)]/10"
                              >
                                Goal Exceeded
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {campaign.description}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold font-mono">
                            {formatCurrency(campaign.raisedAmount)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            of {formatCurrency(campaign.targetAmount)} target
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2 space-y-1">
                        <Progress
                          value={pct}
                          className="h-1.5 rounded-sm"
                        />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {formatDate(campaign.startDate)} &ndash;{" "}
                            {formatDate(campaign.endDate)}
                          </span>
                          <span className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            {campaign.giftCount.toLocaleString()} gifts &middot;{" "}
                            {pct}% funded
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Expanded: Appeals */}
                    {isExpanded && (
                      <CardContent className="px-3 pb-3 pt-0">
                        <div className="border-t border-border pt-3">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            Appeals ({campaignAppeals.length})
                          </p>
                          {campaignAppeals.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">
                              No appeals configured for this campaign.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {campaignAppeals.map((appeal) => (
                                <div
                                  key={appeal.id}
                                  className="border border-border rounded-sm p-2 text-xs"
                                >
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                      <AppealChannelIcon
                                        channel={appeal.channel}
                                      />
                                      <span className="font-medium text-foreground truncate">
                                        {appeal.name}
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-[10px] font-medium border-0 rounded-sm px-1 py-0",
                                        appeal.status === "completed"
                                          ? "text-muted-foreground bg-muted"
                                          : appeal.status === "active"
                                          ? "text-[color:var(--success)] bg-[color:var(--success)]/10"
                                          : "text-primary bg-primary/8"
                                      )}
                                    >
                                      {appeal.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span>
                                      {appeal.giftCount} gift
                                      {appeal.giftCount !== 1 ? "s" : ""}
                                    </span>
                                    <span className="font-mono font-semibold text-foreground">
                                      {formatCurrencyFull(appeal.totalRaised)}
                                    </span>
                                  </div>
                                  {appeal.responseCount > 0 && (
                                    <p className="text-muted-foreground text-[10px] mt-0.5">
                                      {appeal.responseCount.toLocaleString()}{" "}
                                      responses
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Funds View ───────────────────────────────────────────────────────── */}
      {view === "funds" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Designated funds receiving gifts through the donation form
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {funds.map((fund) => {
              const pct =
                fund.goalAmount !== null
                  ? progressPercent(fund.totalRaised, fund.goalAmount)
                  : 100;
              const nearGoal =
                fund.goalAmount !== null && pct >= 90 && pct < 100;
              const exceeded =
                fund.goalAmount !== null && fund.totalRaised > fund.goalAmount;

              return (
                <Card
                  key={fund.id}
                  className="border border-border rounded-sm shadow-none"
                >
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-semibold">{fund.name}</h3>
                          <FundCategoryBadge category={fund.category} />
                          {nearGoal && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-medium border-0 rounded-sm px-1 py-0 text-[color:var(--warning)] bg-[color:var(--warning)]/10"
                            >
                              Near Goal
                            </Badge>
                          )}
                          {exceeded && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-medium border-0 rounded-sm px-1 py-0 text-[color:var(--success)] bg-[color:var(--success)]/10"
                            >
                              Goal Met
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {fund.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 space-y-2">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold font-mono">
                          {formatCurrencyFull(fund.totalRaised)}
                        </span>
                        {fund.goalAmount !== null ? (
                          <span className="text-[10px] text-muted-foreground">
                            {pct}% of {formatCurrency(fund.goalAmount)} goal
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">
                            Open-ended fund
                          </span>
                        )}
                      </div>
                      {fund.goalAmount !== null && (
                        <Progress
                          value={pct}
                          className="h-1.5 rounded-sm"
                        />
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-2">
                      <span>
                        {fund.giftCount.toLocaleString()} gift
                        {fund.giftCount !== 1 ? "s" : ""}
                      </span>
                      {fund.goalAmount !== null && fund.totalRaised < fund.goalAmount && (
                        <span className="font-mono">
                          {formatCurrencyFull(fund.goalAmount - fund.totalRaised)} remaining
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
