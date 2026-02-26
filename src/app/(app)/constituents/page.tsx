"use client";

import { useState, useMemo } from "react";
import { constituents, getGiftsByConstituent } from "@/data/mock-data";
import type { ConstituentStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  UserCheck,
  Building2,
  RefreshCw,
  UserPlus,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDonorLevel(totalGiving: number): {
  label: string;
  className: string;
} {
  if (totalGiving >= 5000) {
    return {
      label: "Major Donor",
      className: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    };
  }
  if (totalGiving >= 1000) {
    return {
      label: "Mid-Level",
      className: "text-primary bg-primary/8",
    };
  }
  if (totalGiving > 0) {
    return {
      label: "Regular",
      className: "text-muted-foreground bg-muted",
    };
  }
  return {
    label: "Prospect",
    className: "text-muted-foreground bg-muted",
  };
}

// ── Status Badge ─────────────────────────────────────────────────────────────

function ConstituentStatusBadge({ status }: { status: ConstituentStatus }) {
  const config: Record<ConstituentStatus, { label: string; className: string }> = {
    active: {
      label: "Active",
      className: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    lapsed: {
      label: "Lapsed",
      className: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    prospect: {
      label: "Prospect",
      className: "text-primary bg-primary/8",
    },
    deceased: {
      label: "Deceased",
      className: "text-muted-foreground bg-muted",
    },
    inactive: {
      label: "Inactive",
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

// ── Sort ─────────────────────────────────────────────────────────────────────

type SortKey = "name" | "totalGiving" | "giftCount" | "lastGiftDate";
type DonorLevelFilter = "all" | "major" | "mid-level" | "regular" | "prospect";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ConstituentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<DonorLevelFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("totalGiving");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    return constituents
      .filter((c) => {
        const matchesSearch =
          search === "" ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.constituentId.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || c.status === statusFilter;
        const matchesType =
          typeFilter === "all" || c.type === typeFilter;
        const matchesLevel =
          levelFilter === "all" ||
          (levelFilter === "major" && c.totalGiving >= 5000) ||
          (levelFilter === "mid-level" &&
            c.totalGiving >= 1000 &&
            c.totalGiving < 5000) ||
          (levelFilter === "regular" &&
            c.totalGiving > 0 &&
            c.totalGiving < 1000) ||
          (levelFilter === "prospect" && c.totalGiving === 0);
        return matchesSearch && matchesStatus && matchesType && matchesLevel;
      })
      .sort((a, b) => {
        let av: string | number, bv: string | number;
        if (sortKey === "name") {
          av = a.name;
          bv = b.name;
        } else if (sortKey === "totalGiving") {
          av = a.totalGiving;
          bv = b.totalGiving;
        } else if (sortKey === "giftCount") {
          av = a.giftCount;
          bv = b.giftCount;
        } else {
          av = a.lastGiftDate ?? "";
          bv = b.lastGiftDate ?? "";
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, typeFilter, levelFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Constituents</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Donor directory linked to Blackbaud SKY API constituent records
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 rounded-sm"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Sync from SKY API
          </Button>
          <Button size="sm" className="text-xs h-7 rounded-sm">
            <UserPlus className="w-3 h-3 mr-1" />
            Add Constituent
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-7 text-xs rounded-sm"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-7 text-xs rounded-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="lapsed">Lapsed</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 h-7 text-xs rounded-sm">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="organization">Organization</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={levelFilter}
          onValueChange={(v) => setLevelFilter(v as DonorLevelFilter)}
        >
          <SelectTrigger className="w-36 h-7 text-xs rounded-sm">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Donor Levels</SelectItem>
            <SelectItem value="major">Major ($5,000+)</SelectItem>
            <SelectItem value="mid-level">Mid-Level ($1,000–$4,999)</SelectItem>
            <SelectItem value="regular">Regular (under $1,000)</SelectItem>
            <SelectItem value="prospect">Prospect (no gifts)</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground shrink-0 ml-auto">
          {displayed.length} constituent{displayed.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead
                  className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Constituent <SortIcon col="name" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Type
                </TableHead>
                <TableHead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Donor Level
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("totalGiving")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Total Giving <SortIcon col="totalGiving" />
                  </div>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("giftCount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Gifts <SortIcon col="giftCount" />
                  </div>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("lastGiftDate")}
                >
                  <div className="flex items-center gap-1">
                    Last Gift <SortIcon col="lastGiftDate" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="bg-muted/50 w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No constituents match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((con) => {
                  const level = getDonorLevel(con.totalGiving);
                  const giftHistory = getGiftsByConstituent(con.id);
                  return (
                    <>
                      <TableRow
                        key={con.id}
                        className="cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75 text-xs"
                        onClick={() =>
                          setExpandedId(
                            expandedId === con.id ? null : con.id
                          )
                        }
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-sm bg-primary/8 flex items-center justify-center shrink-0">
                              {con.type === "organization" ? (
                                <Building2 className="w-3 h-3 text-primary" />
                              ) : (
                                <UserCheck className="w-3 h-3 text-primary" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{con.name}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {con.constituentId}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground py-2 capitalize">
                          {con.type}
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium border-0 rounded-sm px-1.5 py-0.5",
                              level.className
                            )}
                          >
                            {level.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-right font-semibold py-2">
                          {con.totalGiving > 0
                            ? formatCurrency(con.totalGiving)
                            : "—"}
                        </TableCell>
                        <TableCell className="font-mono text-right text-muted-foreground py-2">
                          {con.giftCount}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground py-2">
                          {formatDate(con.lastGiftDate)}
                        </TableCell>
                        <TableCell className="py-2">
                          <ConstituentStatusBadge status={con.status} />
                        </TableCell>
                        <TableCell className="py-2 text-muted-foreground">
                          <ChevronRight
                            className={cn(
                              "w-3.5 h-3.5 transition-transform duration-75",
                              expandedId === con.id && "rotate-90"
                            )}
                          />
                        </TableCell>
                      </TableRow>

                      {expandedId === con.id && (
                        <TableRow key={`${con.id}-expanded`} className="bg-muted/30">
                          <TableCell colSpan={8} className="py-3 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Contact Info */}
                              <div className="space-y-2">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                                  Contact Information
                                </p>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">Email</span>
                                    <p className="font-medium">{con.email}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Phone</span>
                                    <p className="font-medium">
                                      {con.phone ?? (
                                        <span className="text-muted-foreground italic">Not on file</span>
                                      )}
                                    </p>
                                  </div>
                                  <div className="col-span-2 mt-1">
                                    <span className="text-muted-foreground">Address</span>
                                    <p className="font-medium">
                                      {con.address.street}, {con.address.city},{" "}
                                      {con.address.state} {con.address.zip}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Gift History */}
                              <div className="space-y-2">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                                  Recent Gift Activity
                                </p>
                                {giftHistory.length === 0 ? (
                                  <p className="text-xs text-muted-foreground italic">
                                    No gift history on record.
                                  </p>
                                ) : (
                                  <div className="space-y-1">
                                    {giftHistory.slice(0, 3).map((g) => (
                                      <div
                                        key={g.id}
                                        className="flex items-center justify-between text-xs"
                                      >
                                        <span className="text-muted-foreground">
                                          {formatDate(g.createdAt)} &middot;{" "}
                                          {g.fundName}
                                        </span>
                                        <span className="font-mono font-semibold">
                                          {formatCurrency(g.amount)}
                                        </span>
                                      </div>
                                    ))}
                                    {giftHistory.length > 3 && (
                                      <p className="text-[10px] text-muted-foreground">
                                        +{giftHistory.length - 3} more gift
                                        {giftHistory.length - 3 > 1 ? "s" : ""}
                                      </p>
                                    )}
                                  </div>
                                )}
                                {con.hasRecurringGift && (
                                  <p className="text-[10px] text-[color:var(--success)] font-medium mt-1">
                                    Active sustaining donor
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
