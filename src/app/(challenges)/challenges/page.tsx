import Link from "next/link";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { FlowDiagram } from "@/components/challenges/flow-diagram";
import { OAuthArchitecture } from "@/components/challenges/oauth-architecture";
import { BeforeAfter } from "@/components/challenges/before-after";
import { challenges, executiveSummary } from "@/data/challenges";

export const metadata = { title: "My Approach | DonorFlow" };

export default function ChallengesPage() {
  const [c1, c2, c3] = challenges;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I would tackle the key technical challenges in this project
          </p>
        </div>

        {/* Executive summary — dark banner, Corporate Enterprise variant */}
        <div
          className="rounded p-5 space-y-4"
          style={{
            background: "oklch(0.12 0.04 250)",
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, oklch(0.18 0.06 250 / 0.4), transparent 70%)",
          }}
        >
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-white/50">
              {executiveSummary.commonApproach}
            </p>
            <hr style={{ borderColor: "oklch(1 0 0 / 0.10)" }} />
            <p className="text-sm md:text-base leading-relaxed font-medium text-white/90">
              {executiveSummary.differentApproach.split(executiveSummary.accentWord ?? "").map(
                (part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <span className="text-primary font-semibold">
                        {executiveSummary.accentWord}
                      </span>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
              )}
            </p>
          </div>
          <p className="text-xs text-white/40">
            ←{" "}
            <Link
              href="/"
              className="hover:text-white/60 transition-colors underline underline-offset-2"
              style={{ transitionDuration: "60ms" }}
            >
              Back to the live demo
            </Link>
          </p>
        </div>

        {/* Challenge cards */}
        <div className="flex flex-col gap-5">

          {/* Challenge 1: BBMS Tokenization — Flow Diagram */}
          <ChallengeCard
            index={0}
            title={c1.title}
            description={c1.description}
            outcome={c1.outcome}
          >
            <FlowDiagram />
          </ChallengeCard>

          {/* Challenge 2: OAuth2 Token Lifecycle — Architecture Diagram */}
          <ChallengeCard
            index={1}
            title={c2.title}
            description={c2.description}
            outcome={c2.outcome}
          >
            <OAuthArchitecture />
          </ChallengeCard>

          {/* Challenge 3: Idempotent Gift Creation — Interactive Before/After */}
          <ChallengeCard
            index={2}
            title={c3.title}
            description={c3.description}
            outcome={c3.outcome}
          >
            <BeforeAfter
              interactive
              before={{
                label: "Without idempotency key",
                items: [
                  "Network timeout between BBMS charge and SKY API record creation",
                  "Retry fires a second BBMS charge — donor is billed twice",
                  "Two gift records created in Raiser's Edge — manual cleanup required",
                ],
              }}
              after={{
                label: "With idempotency key",
                items: [
                  "Network timeout triggers automatic retry with the same session key",
                  "SKY API detects duplicate request — returns original result",
                  "BBMS charge recorded once — no double billing, no manual reconciliation",
                ],
              }}
            />
          </ChallengeCard>

        </div>

        {/* CTA closer — Corporate Enterprise: structured bordered container */}
        <div
          className="rounded border border-border p-5"
          style={{ boxShadow: "0 1px 2px oklch(0 0 0 / 0.06)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold mb-1">
                Ready to discuss the integration approach?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                I have built BBMS Checkout integrations and SKY API workflows before.
                Happy to walk through the specifics on a short call.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/proposal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                style={{ transitionDuration: "60ms" }}
              >
                See the proposal →
              </Link>
              <span
                className="text-xs font-medium border px-3 py-1.5 rounded"
                style={{
                  borderColor: "color-mix(in oklch, var(--primary) 25%, transparent)",
                  backgroundColor: "color-mix(in oklch, var(--primary) 6%, transparent)",
                  color: "var(--primary)",
                }}
              >
                Reply on Upwork to start
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
