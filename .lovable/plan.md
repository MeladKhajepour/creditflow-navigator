

# CreditOps Copilot — Frontend Plan

## Overview
An **applicant-facing** "War Room" web app for AI-powered credit risk assessment. The borrower connects their financial services, completes an AI-guided interview, and receives a detailed risk assessment. Analysts/admins get a separate internal view with policy management and agent transparency tools. All data is mocked for now — designed to plug into your team's backend when ready.

---

## Design Direction
- **Dark fintech theme** — deep navy/slate backgrounds, clean typography, risk-colored accents (green/amber/red)
- Polished transitions, loading states, and subtle animations for a demo-ready feel
- Professional, trustworthy aesthetic that puts applicants at ease

---

## Phase 1: Core Layout & Routing

**Split-Panel Shell**
- Resizable two-panel layout with a draggable divider (left: chat, right: content)
- Top navigation bar with **CreditOps Copilot** branding
- Two route groups:
  - **Applicant view** (`/`) — the main split-panel experience
  - **Analyst/Admin view** (`/admin`) — internal dashboard with Policy & Agent Log tabs
- On smaller screens, panels toggle between chat and content views

---

## Phase 2: AI Interview Chat (Left Panel)

- Chat interface with message bubbles — AI on the left, applicant on the right
- A scripted interview flow that walks the applicant through:
  1. Welcome & context setting
  2. Prompt to connect financial services (triggers the connection step on the right panel)
  3. Financial data gathering questions (company name, revenue, EBITDA, debt, industry, country, loan details)
  4. Confirmation and "Submit for Assessment" trigger
- Quick-reply buttons and inline dropdowns for structured inputs (industry picker, country selector, loan term options)
- Typing indicators, timestamps, and a progress bar showing interview completion
- After assessment, transitions to a **results discussion mode** where the applicant can ask follow-up questions about their results

---

## Phase 3: Right Panel — Service Connection Step (First Stage)

Before the form, the right panel shows a **"Connect Your Financial Services"** screen:

- Clean card-based layout with logos for **Xero**, **QuickBooks**, and **Stripe**
- Each card shows: service name, what data will be pulled (e.g., "Financial statements, P&L, balance sheet" for Xero; "Invoices, payment history" for Stripe), and a "Connect" button
- OAuth-style connection flow (mocked for now — button triggers a simulated auth redirect and success state)
- Connected services show a green checkmark with "Connected" status
- A "Skip for now" option that allows proceeding with manual data entry only
- Once at least one service is connected (or skipped), the AI chat prompts the next step and the right panel transitions to the form

---

## Phase 4: Right Panel — Loan Application Form (Second Stage)

- A structured form that mirrors the data the AI is collecting in the chat
- As the applicant answers questions in the chat, corresponding form fields **auto-populate** on the right
- **Verified badges**: Fields populated from connected third-party services display a "✓ Verified via Xero" (or QuickBooks/Stripe) badge next to them, distinguishing verified data from self-reported data
- Sections: Company Info, Financial Snapshot (revenue, EBITDA, total debt, cash runway), Loan Request (amount, term, interest type), Industry & Geography
- Visual progress indicator showing application completeness
- Applicants can manually edit fields — but verified fields show a subtle "This will override verified data" warning if changed
- A "Submit for Assessment" button when the form is complete

---

## Phase 5: Right Panel — Assessment Results (Third Stage)

Smooth animated transition from form to results view, showing:

- **Risk Score Gauge** — A circular dial/gauge with color-coded risk level (low/medium/high/critical)
- **Financial Metrics Cards** — Four key cards: Probability of Default (PD), Exposure at Default (EAD), Loss Given Default (LGD), Expected Loss (EL)
- **Decision Banner** — Large, clear Approved / Denied / Conditional badge with recommended interest rate
- **AI Explanation** — A readable narrative explaining the decision rationale in plain language
- **Data Sources Summary** — Shows which data came from verified sources (Xero, QuickBooks, Stripe) vs. self-reported, with a "confidence" indicator
- **OSINT Research Summary** — Collapsible section showing country risk, industry risk, and key findings
- **Flagged Risk Factors** — A list of specific concerns with severity indicators

---

## Phase 6: Analyst/Admin View — Override & Policy Dashboard (`/admin`)

A separate internal route, not visible to applicants:

- **Case List** — A table of submitted applications with status (pending, approved, denied, overridden)
- **Case Detail** — Click into any case to see the full assessment results (same as Phase 5 but with additional controls)
- **Override System** — An "Override Decision" button that opens a panel with:
  - Dropdown for reason ("Too strict," "Too lenient," "Missing context," "Relationship factor")
  - Text field for explanation
  - Confirmation step
  - After override: simulated "Policy learning in progress..." animation, then updated decision
- **Policy Dashboard Tab**:
  - Current policy rules displayed as readable cards (thresholds, weights, risk adjustments)
  - Policy Change History — timeline/log with before → after diffs
  - Eval Suite Results — table of ~8 synthetic test cases showing expected vs. actual decisions with accuracy scores

---

## Phase 7: Analyst/Admin View — Agent Activity Log (`/admin`)

Also within the admin route:

- A timeline view showing each agent's role in any selected assessment
- Steps: Orchestration → Risk Research → Baseline Scoring → Qualitative Synthesis → Final Assessment
- Each step shows: status (complete/in-progress/error), duration, and collapsible output summary
- Color-coded status indicators for at-a-glance understanding
- Useful for analyst transparency and debugging during demos

---

## Phase 8: Mock Data & API Service Layer

- **TypeScript interfaces** defining the full data contract (loan application, assessment result, policy config, agent logs, eval cases, connected services)
- **Mock data** with realistic sample companies, risk scores, OSINT results, policy configurations, and simulated third-party data pulls
- **API service layer** with clean function signatures (e.g., `connectService()`, `submitApplication()`, `getAssessment()`, `overrideDecision()`, `getPolicyConfig()`) — all returning mock data
- A simple config toggle (`useMockData: true/false`) for seamless backend integration later

