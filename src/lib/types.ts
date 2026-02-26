import type { LucideIcon } from "lucide-react";

// Sidebar navigation
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Challenge visualization types
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// Proposal types
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ─── Nonprofit / Blackbaud Domain Types ───────────────────────────────────────

export type ConstituentType = "individual" | "organization";

export type ConstituentStatus = "active" | "lapsed" | "prospect" | "deceased" | "inactive";

export interface Constituent {
  id: string;                    // e.g. "con_m4r7k"
  constituentId: string;         // Blackbaud-style ID: "CON-004821"
  name: string;
  email: string;
  phone: string | null;
  type: ConstituentType;
  status: ConstituentStatus;
  totalGiving: number;           // lifetime giving in dollars
  giftCount: number;
  lastGiftDate: string | null;   // ISO date string
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  /** Whether this constituent has an active recurring gift */
  hasRecurringGift: boolean;
}

export type GiftType = "one-time" | "recurring";

export type GiftFrequency = "monthly" | "quarterly" | "annual" | null;

export type GiftStatus = "completed" | "pending" | "declined" | "refunded";

export type PaymentMethod = "credit_card" | "ach" | "check" | "wire";

export interface Gift {
  id: string;                    // e.g. "gft_b9n2x"
  constituentId: string;         // references Constituent.id
  constituentName: string;       // denormalized for display
  amount: number;                // decimal dollars
  type: GiftType;
  /** Present only when type === "recurring" */
  frequency: GiftFrequency;
  fund: string;                  // references Fund.id
  fundName: string;              // denormalized for display
  campaign: string;              // references Campaign.id
  campaignName: string;          // denormalized for display
  appeal: string | null;         // references Appeal.id
  appealName: string | null;     // denormalized for display
  status: GiftStatus;
  paymentMethod: PaymentMethod;
  /** Blackbaud transaction reference */
  transactionId: string;
  /** Idempotency key used at submission to prevent duplicate gifts */
  idempotencyKey: string;
  /** Present only when status === "declined" */
  declineReason?: string;
  createdAt: string;             // ISO datetime string
}

export interface Fund {
  id: string;                    // e.g. "fnd_h3c8p"
  name: string;
  description: string;
  totalRaised: number;
  goalAmount: number | null;
  giftCount: number;
  category: "general" | "restricted" | "endowment" | "capital" | "emergency";
}

export type CampaignStatus = "active" | "completed" | "planned";

export interface Campaign {
  id: string;                    // e.g. "cmp_r5q1w"
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  targetAmount: number;
  raisedAmount: number;
  giftCount: number;
  /** Array of Appeal IDs associated with this campaign */
  appeals: string[];
}

export type AppealChannel =
  | "direct_mail"
  | "email"
  | "phone"
  | "event"
  | "social"
  | "online";

export type AppealStatus = "active" | "completed" | "planned";

export interface Appeal {
  id: string;                    // e.g. "apl_v7t4n"
  name: string;
  campaignId: string;            // references Campaign.id
  channel: AppealChannel;
  status: AppealStatus;
  responseCount: number;
  giftCount: number;
  totalRaised: number;
}

export type ApiService = "sky-api" | "bbms-checkout";

export type ApiHealthStatus = "healthy" | "degraded" | "error";

export interface ApiHealthEntry {
  id: string;
  service: ApiService;
  endpoint: string;
  status: ApiHealthStatus;
  lastCheck: string;             // ISO datetime string
  responseTime: number;          // milliseconds
  /** Present for OAuth2 token entries; null = not applicable */
  tokenExpiry: string | null;
  /** Present only when status === "error" or "degraded" */
  errorMessage?: string;
}

export interface DashboardStats {
  totalGiftsThisMonth: number;
  totalGiftsChange: number;      // % vs last month
  totalRaisedThisMonth: number;
  totalRaisedChange: number;     // % vs last month
  recurringDonors: number;
  recurringDonorsChange: number; // absolute count change
  avgGiftSize: number;
  avgGiftSizeChange: number;     // % vs last month
  pendingGifts: number;
  declinedRate: number;          // percentage 0-100
}

export interface MonthlyGivingData {
  month: string;
  oneTime: number;
  recurring: number;
  total: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface FundBreakdownData {
  fundName: string;
  raised: number;
  goal: number | null;
  percentage: number;
}
