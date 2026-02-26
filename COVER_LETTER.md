Hi,

Separating BBMS Checkout tokenization from SKY API gift creation — and ensuring idempotency across both systems — is the exact orchestration challenge your post describes. I built a working version of this before reaching out: https://blackbaud-donation-flow.vercel.app

The demo covers constituent lookup, gift creation with fund/campaign/appeal assignment, and an OAuth2 token lifecycle monitor — all server-side, no client secrets.

Previously wired Microsoft Graph OAuth into a production pipeline that cut a 4-hour process to 20 minutes — same server-side auth pattern applies here.

Is your SKY API application already approved for production, or are you still working in sandbox?

10-minute call or I can scope the first milestone in a doc — your pick.

Humam
