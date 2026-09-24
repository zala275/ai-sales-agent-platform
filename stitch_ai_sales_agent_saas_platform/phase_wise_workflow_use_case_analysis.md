# AI Sales Agent: Phase-wise Workflow & Use Case Analysis

This document provides a granular breakdown of the platform's operations, divided into logical phases of the SaaS lifecycle.

---

## Phase 1: Platform Administration (Super Admin)
**Focus:** Infrastructure, scaling, and business health.

### Use Cases:
*   **UC-SA-01:** Configure subscription tiers (Limits, Pricing).
*   **UC-SA-02:** Monitor global AI usage & token consumption.
*   **UC-SA-03:** Manage multi-tenant user accounts & access.

### Workflow:
`System Health Check` → `Analyze Revenue/Growth` → `Adjust Plan Toggles` → `Notify Customers of Updates`.

---

## Phase 2: Customer Onboarding & Setup
**Focus:** Converting a visitor into a customer and initiating their workspace.

### Use Cases:
*   **UC-C-01:** Account Registration & Authentication.
*   **UC-C-02:** Plan Selection (Free/Starter/Pro).
*   **UC-C-03:** Workspace Initialization.

### Workflow:
`Landing Page` → `Sign Up` → `Select Plan` → `Payment Success` → `Enter Dashboard`.

---

## Phase 3: Agent Engineering & Training
**Focus:** Building the "brain" of the AI Sales Agent.

### Use Cases:
*   **UC-C-04:** Identity Branding (Name, Avatar, Tone).
*   **UC-C-05:** Knowledge Ingestion (Crawl URL, PDF Upload).
*   **UC-C-06:** Test Agent in Sandbox.

### Workflow:
`Agent Wizard` → `Configure Personality` → `Upload Sources` → `Vector Syncing (Training)` → `Preview Chat`.

---

## Phase 4: Deployment & Live Integration
**Focus:** Activating the agent on the target business website.

### Use Cases:
*   **UC-C-07:** Generate Secure JS Snippet.
*   **UC-C-08:** Domain Whitelisting.

### Workflow:
`Go to Integration Tab` → `Generate Key` → `Copy Snippet` → `Paste in Website <head>` → `Verify Connection`.

---

## Phase 5: Real-time Interaction (The Visitor Journey)
**Focus:** The end-user experience and lead generation.

### Use Cases:
*   **UC-V-01:** Ask Product Questions.
*   **UC-V-02:** Receive Grounded Recommendations.
*   **UC-V-03:** Submit Lead Details (Email/Phone).

### Workflow:
`Visitor Lands` → `Widget Pops Up` → `User Query` → `RAG Retrieval` → `AI Response` → `Intent Detected` → `Lead Capture Form`.

---

## Phase 6: Analytics & Conversion Optimization
**Focus:** Feedback loop for the business owner.

### Use Cases:
*   **UC-C-09:** View Lead Transcripts.
*   **UC-C-10:** Analyze Conversion Funnel.

### Workflow:
`Visit Leads Tab` → `Review Transcripts` → `Export Data` → `Refine Agent Knowledge Base`.
