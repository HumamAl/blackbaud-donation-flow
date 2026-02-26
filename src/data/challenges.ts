export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  outcome: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers bolt Blackbaud's hosted form directly onto the page and treat it as a black box — skipping token lifecycle management, ignoring idempotency, and leaving PCI scope undefined. When a token expires mid-campaign or a network retry double-charges a donor, the response is manual cleanup and a support ticket.",
  differentApproach:
    "I build the integration so the payment tokenization, OAuth2 token refresh, and gift creation are each handled as first-class concerns — with idempotency keys, automatic re-authorization, and a clear audit trail that Blackbaud SKY API can verify on both sides.",
  accentWord: "idempotency keys",
};

export const challenges: ChallengeData[] = [
  {
    id: "challenge-1",
    title: "BBMS Checkout Iframe Tokenization",
    description:
      "Blackbaud's hosted payment fields (BBMS Checkout) render inside iframes the nonprofit never owns. Card data flows directly from the donor's browser to Blackbaud's tokenization service — but orchestrating the iframe lifecycle, listening for the tokenization callback, and handing the token off to the WordPress server without touching raw card data requires careful cross-origin coordination.",
    outcome:
      "Could eliminate PCI DSS scope for the WordPress server entirely — card data never touches your infrastructure, reducing audit burden and removing the liability of self-managed card handling.",
  },
  {
    id: "challenge-2",
    title: "SKY API OAuth2 Token Lifecycle",
    description:
      "The WordPress plugin must maintain a live OAuth2 session with the Blackbaud SKY API. Access tokens expire after 60 minutes; a single expired token blocks all gift creation. The plugin must store credentials securely, detect pre-expiry windows, refresh automatically via cron, and recover gracefully from auth server failures — all without any manual re-authorization from the nonprofit's staff.",
    outcome:
      "Could ensure zero-downtime donation processing with automatic token refresh — no manual re-authorization needed even during peak campaign traffic.",
  },
  {
    id: "challenge-3",
    title: "Idempotent Gift Creation Across BBMS and SKY API",
    description:
      "Every gift creation touches two systems in sequence: BBMS captures and charges the card, then SKY API creates the constituent and gift record. A network timeout between those calls — or a donor pressing Submit twice — can result in a completed charge with no CRM record, or worse, a double charge. An idempotency key tied to the session prevents both failure modes during retries.",
    outcome:
      "Could prevent duplicate charges and orphaned gift records during network failures — protecting donor trust and ensuring every BBMS transaction has a matching SKY API record.",
  },
];
