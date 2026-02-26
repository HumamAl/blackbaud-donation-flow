"use client";

import { useState, useMemo } from "react";
import { gifts, funds } from "@/data/mock-data";
import type { GiftStatus, GiftType, PaymentMethod } from "@/lib/types";
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
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Download,
  RefreshCw,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPaymentMethod(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    credit_card: "Credit Card",
    ach: "ACH",
    check: "Check",
    wire: "Wire Transfer",
  };
  return labels[method];
}

// ── Status Badge ─────────────────────────────────────────────────────────────

function GiftStatusBadge({ status }: { status: GiftStatus }) {
  const config: Record<GiftStatus, { label: string; className: string }> = {
    completed: {
      label: "Completed",
      className: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    pending: {
      label: "Pending",
      className: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    declined: {
      label: "Declined",
      className: "text-destructive bg-destructive/10",
    },
    refunded: {
      label: "Refunded",
      className: "text-muted-foreground bg-muted",
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

function GiftTypeBadge({ type }: { type: GiftType }) {
  if (type === "recurring") {
    return (
      <Badge
        variant="outline"
        className="text-xs font-medium border-0 rounded-sm px-1.5 py-0.5 text-primary bg-primary/8"
      >
        Recurring
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-xs font-medium border-0 rounded-sm px-1.5 py-0.5 text-muted-foreground bg-muted"
    >
      One-time
    </Badge>
  );
}

// ── Sort ─────────────────────────────────────────────────────────────────────

type SortKey = "createdAt" | "amount" | "constituentName" | "status";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [fundFilter, setFundFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const displayed = useMemo(() => {
    return gifts
      .filter((g) => {
        const matchesSearch =
          search === "" ||
          g.constituentName.toLowerCase().includes(search.toLowerCase()) ||
          g.transactionId.toLowerCase().includes(search.toLowerCase()) ||
          g.fundName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || g.status === statusFilter;
        const matchesType = typeFilter === "all" || g.type === typeFilter;
        const matchesFund = fundFilter === "all" || g.fund === fundFilter;
        return matchesSearch && matchesStatus && matchesType && matchesFund;
      })
      .sort((a, b) => {
        let av: string | number, bv: string | number;
        if (sortKey === "createdAt") {
          av = a.createdAt;
          bv = b.createdAt;
        } else if (sortKey === "amount") {
          av = a.amount;
          bv = b.amount;
        } else if (sortKey === "constituentName") {
          av = a.constituentName;
          bv = b.constituentName;
        } else {
          av = a.status;
          bv = b.status;
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, typeFilter, fundFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  function handleExport() {
    setExportLoading(true);
    setTimeout(() => setExportLoading(false), 1200);
  }

  const totalAmount = displayed.reduce((sum, g) => sum + g.amount, 0);

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Gift Transactions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            All gifts processed through BBMS Checkout and posted to SKY API
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 rounded-sm"
            onClick={handleExport}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Download className="w-3 h-3 mr-1" />
            )}
            {exportLoading ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by constituent, fund, or TXN ID..."
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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-28 h-7 text-xs rounded-sm">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="one-time">One-time</SelectItem>
            <SelectItem value="recurring">Recurring</SelectItem>
          </SelectContent>
        </Select>

        <Select value={fundFilter} onValueChange={setFundFilter}>
          <SelectTrigger className="w-40 h-7 text-xs rounded-sm">
            <SelectValue placeholder="All funds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Funds</SelectItem>
            {funds.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground shrink-0 ml-auto">
          {displayed.length} gift{displayed.length !== 1 ? "s" : ""} &middot;{" "}
          {formatCurrency(totalAmount)}
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
                  style={{ width: "100px" }}
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date <SortIcon col="createdAt" />
                  </div>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("constituentName")}
                >
                  <div className="flex items-center gap-1">
                    Constituent <SortIcon col="constituentName" />
                  </div>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors text-right"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount <SortIcon col="amount" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Type
                </TableHead>
                <TableHead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Fund
                </TableHead>
                <TableHead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Campaign
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status <SortIcon col="status" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Transaction ID
                </TableHead>
                <TableHead className="bg-muted/50 w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No gift transactions match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((gift) => (
                  <>
                    <TableRow
                      key={gift.id}
                      className="cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75 text-xs"
                      onClick={() =>
                        setExpandedId(
                          expandedId === gift.id ? null : gift.id
                        )
                      }
                    >
                      <TableCell className="font-mono text-muted-foreground py-2">
                        {formatDate(gift.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium py-2">
                        {gift.constituentName}
                      </TableCell>
                      <TableCell className="font-mono text-right font-semibold py-2">
                        {formatCurrency(gift.amount)}
                      </TableCell>
                      <TableCell className="py-2">
                        <GiftTypeBadge type={gift.type} />
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2 max-w-[120px] truncate">
                        {gift.fundName}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2 max-w-[140px] truncate">
                        {gift.campaignName}
                      </TableCell>
                      <TableCell className="py-2">
                        <GiftStatusBadge status={gift.status} />
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground py-2">
                        {gift.transactionId}
                      </TableCell>
                      <TableCell className="py-2 text-muted-foreground">
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-75",
                            expandedId === gift.id && "rotate-90"
                          )}
                        />
                      </TableCell>
                    </TableRow>

                    {expandedId === gift.id && (
                      <TableRow key={`${gift.id}-expanded`} className="bg-muted/30">
                        <TableCell colSpan={9} className="py-3 px-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-xs">
                            <div>
                              <span className="text-muted-foreground uppercase tracking-wide text-[10px] font-semibold block">
                                Payment Method
                              </span>
                              <span className="text-foreground font-medium">
                                {formatPaymentMethod(gift.paymentMethod)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground uppercase tracking-wide text-[10px] font-semibold block">
                                Appeal
                              </span>
                              <span className="text-foreground font-medium">
                                {gift.appealName ?? (
                                  <span className="text-muted-foreground italic">None</span>
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground uppercase tracking-wide text-[10px] font-semibold block">
                                Frequency
                              </span>
                              <span className="text-foreground font-medium capitalize">
                                {gift.frequency ?? (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground uppercase tracking-wide text-[10px] font-semibold block">
                                Idempotency Key
                              </span>
                              <span className="font-mono text-[10px] text-foreground">
                                {gift.idempotencyKey}
                              </span>
                            </div>
                            {gift.declineReason && (
                              <div className="col-span-full mt-1">
                                <span className="text-muted-foreground uppercase tracking-wide text-[10px] font-semibold block">
                                  Decline Reason
                                </span>
                                <span className="text-destructive text-xs">
                                  {gift.declineReason}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
