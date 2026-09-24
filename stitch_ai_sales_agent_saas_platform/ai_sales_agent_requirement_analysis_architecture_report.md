# Requirement Analysis & System Architecture Report: AI Sales Agent SaaS

## 1. Executive Summary
**AI Sales Agent** is a premium SaaS platform designed to empower businesses with autonomous, intelligent sales agents. These agents are trained on specific business data (websites, PDFs, FAQs) and deployed via a simple JavaScript snippet to capture leads, answer product queries, and drive conversions 24/7.

---

## 2. Requirement Analysis

### 2.1 User Personas
*   **Super Admin:** Platform owners managing global analytics, user accounts, subscription plans, and system health.
*   **Customer (Business Owner/Manager):** SaaS subscribers who create, train, and deploy AI agents for their websites.
*   **Website Visitor:** The end-user interacting with the AI widget on a customer's website.

### 2.2 Functional Requirements
#### Super Admin Panel
*   **Global Dashboard:** View total users, revenue (MRR/ARR), active subscriptions, and aggregate AI usage.
*   **User Management:** CRUD operations for users, role assignments (Admin/Member), and account suspension.
*   **Plan Management:** Configuration of pricing tiers (Free, Starter, Professional, Enterprise) and feature toggles.
*   **System Monitoring:** Performance tracking of the AI Engine and database load.

#### Customer Dashboard
*   **Onboarding:** Plan selection and seamless signup/login.
*   **AI Agent Creation:** Wizard-based setup for agent identity (name, avatar, personality, language).
*   **Knowledge Training:** Multi-source data ingestion (URL crawling, PDF uploads, FAQ entry).
*   **Deployment:** Generation of unique, secure JavaScript integration keys.
*   **Leads & Analytics:** Lead capture tables, conversation transcripts, and performance metrics (conversion rates, visitor intent).

#### AI Agent Widget
*   **Engagement:** Floating chat interface with responsive design.
*   **Intelligence:** Context-aware responses based on trained knowledge.
*   **Lead Generation:** Automated collection of visitor contact info during chat.

---

## 3. Literature Review & Technical Standards
*   **RAG (Retrieval-Augmented Generation):** The platform utilizes RAG to ensure AI responses are grounded in the business's specific data, minimizing hallucinations.
*   **Vector Embeddings:** Conversion of business documents into high-dimensional vectors for semantic search.
*   **SaaS Multi-tenancy:** Data isolation architecture ensuring customers only access their own agent data and analytics.
*   **Widget Security:** Domain-restricted API keys and script integrity checks to prevent unauthorized widget usage.

---

## 4. System Architecture

### 4.1 High-Level Architecture
```text
[Frontend Website] <--> [JS AI Widget]
          |                   |
          +----[ API Gateway ]----+
                    |
          [ AI Agent Engine (LLM) ]
                    |
    +---------------+---------------+
    |               |               |
[Database]     [Vector DB]     [Analytics]
(PostgreSQL)      (Pinecone)      (Redis/ClickHouse)
```

### 4.2 Database Schema (Conceptual)
*   **Users Table:** `id, name, email, password_hash, role, created_at`
*   **Subscriptions Table:** `id, user_id, plan_id, status, start_date, expiry_date`
*   **AI_Agents Table:** `id, user_id, name, website_url, api_key, personality_config`
*   **Conversations Table:** `id, agent_id, visitor_id, transcript_json, lead_captured (bool)`
*   **Knowledge_Base Table:** `id, agent_id, source_type (URL/PDF), content_hash, vector_sync_status`

---

## 5. System Workflow & Use Cases

### 5.1 System Workflow: Deployment & Interaction
1.  **Verification:** Widget loads -> Checks `data-agent-key` against API Gateway.
2.  **Context Retrieval:** API Gateway queries Vector DB for business knowledge relevant to visitor query.
3.  **Inference:** AI Engine processes query + business context -> Generates response.
4.  **Lead Capture:** If visitor expresses high intent -> Agent prompts for contact info -> Data saved to Analytics/Database.

### 5.2 Use Case Diagram (Summary)
*   **UC-01 [Customer]:** Train AI Agent (Upload PDF/Crawl URL).
*   **UC-02 [Customer]:** Integrate Widget (Copy JS Key to Web Header).
*   **UC-03 [Visitor]:** Query Product (Interact with Chat Widget).
*   **UC-04 [Super Admin]:** Manage Pricing (Update 'Starter' plan monthly limit).

---

## 6. Final Workflow Presentation (Visual Path)
**Visitor Opens Website** → **Widget Loads** → **Key Verified** → **Connects to Engine** → **Retrieves Knowledge** → **Understands Intent** → **Answers/Recommends** → **Captures Lead** → **Data Syncs to Dashboard**.