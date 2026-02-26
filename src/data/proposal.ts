import type { PortfolioProject } from "@/lib/types";

// ── Profile ────────────────────────────────────────────────────────────────────
// Proposal Builder: all values are job-specific to the Blackbaud SKY API /
// BBMS Checkout donation form integration project.

export const proposalHero = {
  name: "Humam",
  role: "Full-Stack Developer · API Integration Specialist",
  valueProp:
    "Full-stack developer with API integration and payment processing experience — from OAuth2 token management to hosted payment field integrations — and I've already built a working donation flow for your review in Tab 1.",
  badge: "Built this demo for your project",
  stats: [
    { value: "24+", label: "Projects Shipped" },
    { value: "15+", label: "Industries Served" },
    { value: "< 48hr", label: "Demo Turnaround" },
  ],
};

// ── Portfolio Projects ─────────────────────────────────────────────────────────
// 4 projects selected for domain/feature match to:
//   - BBMS Checkout (payment tokenization / hosted fields)
//   - SKY API (OAuth2, REST, CRM record creation)
//   - WordPress plugin development
//   - Idempotency / error handling

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "payguard",
    title: "PayGuard — Transaction Monitor",
    description:
      "Transaction monitoring dashboard with real-time flagging, linked account tracking, alert management, and prohibited merchant detection.",
    outcome:
      "Compliance monitoring dashboard with transaction flagging, multi-account linking, and alert delivery tracking",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
    liveUrl: "https://payment-monitor.vercel.app",
    relevance:
      "Payment processing and transaction monitoring — directly relevant to BBMS Checkout integration",
  },
  {
    id: "creator-economy",
    title: "Creator Economy App",
    description:
      "Creator economy livestreaming platform with Stripe Connect payments — viewer tips routed to creator payouts via split payment flows.",
    outcome:
      "End-to-end payment flow from viewer tip to creator payout via Stripe Connect split payments",
    tech: ["Next.js", "TypeScript", "Tailwind", "Stripe Connect"],
    relevance:
      "Hosted payment field integration with tokenized card processing",
  },
  {
    id: "lead-crm",
    title: "Lead Intake CRM",
    description:
      "Custom lead intake and automation system with public intake form, CRM dashboard, lead scoring, pipeline management, and automation rules engine.",
    outcome:
      "End-to-end lead flow — public intake form to scored pipeline with configurable automation rules",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    relevance:
      "CRM integration with custom form building and data pipeline management",
  },
  {
    id: "ebay-monitor",
    title: "eBay Pokemon Monitor",
    description:
      "eBay Browse API monitoring tool for Pokemon card listings with instant Discord alerts and price tracking via webhook delivery.",
    outcome:
      "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    liveUrl: "https://ebay-pokemon-monitor.vercel.app",
    relevance:
      "REST API integration, OAuth patterns, and real-time webhook handling",
  },
];

// ── How I Work ─────────────────────────────────────────────────────────────────
// Step names customized for an API integration / payment pipeline project.
// NOT the generic "Understand / Build / Ship / Iterate" default.

export const approachSteps = [
  {
    step: "01",
    title: "Map the Integration Surface",
    description:
      "Review your SKY API access, BBMS Checkout setup, and sandbox credentials. Document every endpoint, auth flow, and data model before writing code.",
    timeline: "Days 1–2",
  },
  {
    step: "02",
    title: "Build the Token Pipeline",
    description:
      "Implement OAuth2 auth, token storage, and auto-refresh in the WordPress plugin. This is the foundation — everything depends on reliable API access.",
    timeline: "Days 3–5",
  },
  {
    step: "03",
    title: "Wire the Donation Flow",
    description:
      "Connect the form UI → BBMS tokenization → SKY API gift creation pipeline. Test each step in sandbox with success, decline, and edge cases.",
    timeline: "Days 6–12",
  },
  {
    step: "04",
    title: "Harden and Document",
    description:
      "Add idempotency safeguards, error handling, and recovery flows. Deliver clean plugin code with a testing plan and production deployment checklist.",
    timeline: "Days 13–18",
  },
];

// ── Skills ─────────────────────────────────────────────────────────────────────
// Filtered to what matters for THIS job — not a full tech dump.

export const skillCategories = [
  {
    category: "Backend & APIs",
    items: [
      "PHP",
      "WordPress Plugin Dev",
      "REST APIs",
      "OAuth2",
      "Webhook Integration",
    ],
  },
  {
    category: "Payment Processing",
    items: [
      "Stripe Elements",
      "Hosted Payment Fields",
      "Tokenization",
      "PCI Compliance",
    ],
  },
  {
    category: "Frontend",
    items: [
      "JavaScript",
      "CSS",
      "WordPress Theme Dev",
      "Responsive Forms",
    ],
  },
  {
    category: "Infrastructure",
    items: [
      "Server-Side Security",
      "Token Management",
      "Idempotent Operations",
      "Sandbox Testing",
    ],
  },
];

// ── CTA ────────────────────────────────────────────────────────────────────────

export const ctaContent = {
  headline: "Ready to wire up your SKY API donation flow.",
  body:
    "I've built payment integrations and API pipelines for multiple clients. The demo above shows the data model — the real plugin ships with full OAuth2 token management, BBMS Checkout tokenization, and SKY API gift creation. Happy to walk through the sandbox setup on a quick call.",
  availability: "Currently available for new projects",
  action: "Reply on Upwork to start",
};
