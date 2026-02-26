import Link from "next/link";
import { ExternalLink, TrendingUp } from "lucide-react";
import {
  proposalHero,
  portfolioProjects,
  approachSteps,
  skillCategories,
  ctaContent,
} from "@/data/proposal";

// ── Proposal Page — Tab 3: "Work With Me" ─────────────────────────────────────
// Aesthetic: Corporate Enterprise — structured, trustworthy, full borders,
// sharp corners, compact density. Light background hero (not dark panel)
// consistent with Corporate Enterprise treatment.
// Section order: Hero → Proof of Work → How I Work → Skills → CTA

export default function ProposalPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* ══════════════════════════════════════════════════════════════════════
            Section 1: Hero — Corporate Enterprise style
            Light background with strong typography, structured stats shelf,
            bordered panel. NOT a dark panel (dark panels suit Dark Premium /
            Linear aesthetics; Corporate Enterprise uses clean white/light).
            ══════════════════════════════════════════════════════════════════════ */}
        <section
          className="border border-border overflow-hidden"
          style={{ borderRadius: "var(--radius)" }}
        >
          {/* Top bar with effort badge */}
          <div
            className="border-b border-border px-6 py-2.5"
            style={{ background: "var(--muted)" }}
          >
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[color:var(--success)]" />
              </span>
              <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                {proposalHero.badge}
              </span>
            </div>
          </div>

          {/* Main hero content */}
          <div className="px-6 py-6 bg-card">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
              {proposalHero.role}
            </p>

            <h1 className="text-4xl tracking-tight leading-none mb-4">
              <span className="font-light text-foreground/60">Hi, I&apos;m</span>{" "}
              <span className="font-bold text-foreground">{proposalHero.name}</span>
            </h1>

            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              {proposalHero.valueProp}
            </p>
          </div>

          {/* Stats shelf — structured row */}
          <div
            className="border-t border-border px-6 py-3"
            style={{ background: "var(--muted)" }}
          >
            <div className="grid grid-cols-3 gap-4">
              {proposalHero.stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-xl font-bold text-foreground tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            Section 2: Proof of Work — 4 portfolio projects
            Corporate Enterprise: structured bordered cards, dense information,
            outcome statement in success color, relevance note in primary.
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-3">
          <div className="pb-1 border-b border-border">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Proof of Work
            </p>
            <h2 className="text-lg font-semibold mt-0.5">Relevant Projects</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {portfolioProjects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border p-4 space-y-2.5 transition-shadow"
                style={{
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                {/* Header: title + optional external link */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-snug">
                    {project.title}
                  </h3>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      style={{ transitionDuration: "var(--dur-fast)" }}
                      aria-label={`View ${project.title}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Outcome — exact from developer-profile.md */}
                {project.outcome && (
                  <div className="flex items-start gap-1.5 text-xs text-[color:var(--success)]">
                    <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{project.outcome}</span>
                  </div>
                )}

                {/* Relevance note */}
                {project.relevance && (
                  <p className="text-xs text-primary/80 italic">
                    Relevant: {project.relevance}
                  </p>
                )}

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 text-xs border border-border/60 bg-muted text-muted-foreground"
                      style={{ borderRadius: "var(--radius-sm)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            Section 3: How I Work — 4 steps, integration-specific titles
            Corporate Enterprise: numbered rows with formal deliverable
            descriptions. Steps named for the API integration job type:
            Map → Build → Wire → Harden
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-3">
          <div className="pb-1 border-b border-border">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Process
            </p>
            <h2 className="text-lg font-semibold mt-0.5">How I Work</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {approachSteps.map((step) => (
              <div
                key={step.step}
                className="bg-card border border-border p-4 space-y-1.5"
                style={{
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium tracking-widest uppercase text-primary">
                    Step {step.step}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {step.timeline}
                  </span>
                </div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground pl-1">
            Total timeline: 2–3 weeks for working sandbox implementation
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            Section 4: Skills Grid — relevant tech only, filtered to this job
            Corporate Enterprise: structured bordered containers per category,
            skill items as compact bordered tags. No pill rounding.
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-3">
          <div className="pb-1 border-b border-border">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Tech Stack
            </p>
            <h2 className="text-lg font-semibold mt-0.5">What I Build With</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {skillCategories.map((cat) => (
              <div
                key={cat.category}
                className="bg-card border border-border p-4 space-y-2"
                style={{
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {cat.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs border border-border/60 bg-muted text-foreground/80"
                      style={{ borderRadius: "var(--radius-sm)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            Section 5: CTA — dark panel close
            Navy/primary-hued dark panel. Pulsing availability indicator.
            "Reply on Upwork to start" as text — not a button linking to #.
            Back-link to the demo. Signed by Humam.
            ══════════════════════════════════════════════════════════════════════ */}
        <section
          className="overflow-hidden"
          style={{
            background: "oklch(0.18 0.05 var(--primary-h, 250))",
            borderRadius: "var(--radius)",
            border: "1px solid oklch(1 0 0 / 0.08)",
          }}
        >
          {/* Header bar */}
          <div
            className="border-b px-6 py-2.5 flex items-center gap-2"
            style={{ borderColor: "oklch(1 0 0 / 0.10)" }}
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: "color-mix(in oklch, var(--success) 80%, white)" }}
            >
              {ctaContent.availability}
            </span>
          </div>

          {/* CTA body */}
          <div className="px-6 py-6 space-y-3">
            <h2 className="text-xl font-semibold text-white leading-snug">
              {ctaContent.headline}
            </h2>

            <p className="text-sm leading-relaxed" style={{ color: "oklch(1 0 0 / 0.65)" }}>
              {ctaContent.body}
            </p>

            {/* Primary action — text, not a dead-end button */}
            <p className="text-base font-semibold text-white pt-1">
              {ctaContent.action}
            </p>

            {/* Secondary back-link to demo */}
            <div className="pt-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm transition-colors"
                style={{
                  color: "oklch(1 0 0 / 0.45)",
                  transitionDuration: "var(--dur-fast)",
                }}
              >
                ← Back to the demo
              </Link>
            </div>

            {/* Signature */}
            <div
              className="pt-4 mt-2"
              style={{ borderTop: "1px solid oklch(1 0 0 / 0.10)" }}
            >
              <p className="text-sm" style={{ color: "oklch(1 0 0 / 0.35)" }}>
                — Humam
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
