-- ==========================================================
-- AI Sales Agent SaaS Platform - Initial Seed Data
-- ==========================================================

-- Insert Pricing Plans
INSERT INTO `plans` (`id`, `name`, `price_monthly`, `price_annual`, `agent_limit`, `monthly_lead_limit`, `knowledge_doc_limit`, `has_crm_sync`, `has_ab_testing`, `has_custom_branding`)
VALUES
('starter', 'Starter Tier', 29.00, 290.00, 1, 150, 5, FALSE, FALSE, FALSE),
('professional', 'Professional Tier', 79.00, 790.00, 5, 1000, 25, TRUE, TRUE, TRUE),
('enterprise', 'Enterprise Tier', 199.00, 1990.00, 20, 10000, 100, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Insert Demo Users
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `company_name`, `company_website`, `plan_id`, `status`)
VALUES
('usr_admin_01', 'Admin Ghanshyam', 'admin@salesai.pro', '$2y$10$e8xLg0B7r8O7oT8K0p3Zke4O5L3n9V.6Y', 'super_admin', 'SalesAI Global', 'https://salesai.pro', 'enterprise', 'active'),
('usr_client_02', 'Sarah Jenkins', 'sarah@apexcloud.io', '$2y$10$e8xLg0B7r8O7oT8K0p3Zke4O5L3n9V.6Y', 'business_owner', 'ApexCloud SaaS', 'https://apexcloud.io', 'professional', 'active'),
('usr_client_03', 'Rahul Sharma', 'rahul@fintechscale.in', '$2y$10$e8xLg0B7r8O7oT8K0p3Zke4O5L3n9V.6Y', 'business_owner', 'FinTechScale', 'https://fintechscale.in', 'starter', 'active');

-- Insert Initial Subscriptions (Generates Showcase MRR)
INSERT INTO `subscriptions` (`id`, `user_id`, `plan_id`, `amount_paid`, `currency`, `status`, `payment_method`, `transaction_reference`, `billing_cycle`)
VALUES
('sub_101', 'usr_client_02', 'professional', 79.00, 'USD', 'active', 'card_visa_4242', 'tx_demo_882910', 'monthly'),
('sub_102', 'usr_client_03', 'starter', 29.00, 'USD', 'active', 'card_mc_5555', 'tx_demo_771923', 'monthly');

-- Insert AI Sales Agents
INSERT INTO `agents` (`id`, `user_id`, `name`, `avatar`, `role_title`, `tone`, `greeting_message`, `system_prompt`, `api_key`, `whitelisted_domains`, `widget_primary_color`, `is_active`)
VALUES
('agt_live_9a8b7c6d', 'usr_admin_01', 'Apex Sales Closer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 'Senior AI Sales Executive', 'consultative', 'Hello! Welcome to ApexCloud. Are you looking to scale your infrastructure or explore our Enterprise pricing today?', 'You are a world-class autonomous B2B sales agent. Your objective is to politely qualify visitors, explain product benefits using retrieved knowledge chunks, overcome objections, and capture their business email and phone number for our sales team.', 'demo_prj_9a8b7c6d5e4f3', 'salesai.pro, apexcloud.io, localhost', '#2170e4', TRUE),
('agt_live_3f2b1a9c', 'usr_client_02', 'Stitch Inbound AI', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 'Growth Specialist', 'persuasive', 'Hey there! Looking to automate your sales pipeline? Let me show you how our clients achieve 3.4x higher conversion.', 'Focus on urgency and high ROI. Recommend the Pro Tier and offer an immediate custom quote in exchange for contact information.', 'demo_prj_3f2b1a9c8b7a6', 'apexcloud.io', '#9466ff', TRUE);

-- Insert Knowledge Base Documents (RAG)
INSERT INTO `knowledge_documents` (`id`, `agent_id`, `source_type`, `title`, `source_url`, `total_chunks`, `sync_status`, `vector_count`)
VALUES
('doc_01', 'agt_live_9a8b7c6d', 'url_crawl', 'ApexCloud Pricing & Feature Matrix', 'https://apexcloud.io/pricing', 18, 'ready', 18),
('doc_02', 'agt_live_9a8b7c6d', 'pdf', 'Q3 Enterprise Product Whitepaper.pdf', '/storage/whitepaper_v3.pdf', 42, 'ready', 42),
('doc_03', 'agt_live_9a8b7c6d', 'faq_manual', 'Common Objections & Security FAQs', NULL, 12, 'ready', 12);

-- Insert Sample Captured Leads
INSERT INTO `leads` (`id`, `agent_id`, `full_name`, `email`, `phone`, `company`, `interest_product`, `budget_estimate`, `status`, `crm_synced`)
VALUES
('lead_001', 'agt_live_9a8b7c6d', 'David Miller', 'david.m@acmecorp.com', '+1 (555) 234-8901', 'Acme Corp', 'Enterprise Multi-Agent Plan', '$1,500/mo', 'hot', TRUE),
('lead_002', 'agt_live_9a8b7c6d', 'Priya Patel', 'priya@techventures.io', '+91 98200 44122', 'TechVentures', 'Professional 5-Agent Suite', '$500/mo', 'hot', TRUE),
('lead_003', 'agt_live_9a8b7c6d', 'Marcus Sterling', 'm.sterling@globalnet.org', '+44 20 7946 0912', 'GlobalNet Systems', 'Custom API & White-labeling', '$3,000/mo', 'warm', FALSE),
('lead_004', 'agt_live_9a8b7c6d', 'Elena Rostova', 'elena@novasoft.eu', '+49 30 1234567', 'NovaSoft Berlin', 'Lead Generation Widget', '$250/mo', 'warm', TRUE),
('lead_005', 'agt_live_9a8b7c6d', 'Kevin Zhou', 'kevin.zhou@nexustrade.cn', '+86 21 6234 5678', 'Nexus Trade', 'Evaluation Trial', 'Undisclosed', 'cold', FALSE);

-- Insert Sample Conversation & Transcript
INSERT INTO `conversations` (`id`, `agent_id`, `visitor_session_id`, `visitor_ip`, `visitor_country`, `visitor_device`, `lead_captured`, `intent_score`, `sentiment`)
VALUES
('conv_9821', 'agt_live_9a8b7c6d', 'sess_992019a', '103.21.144.2', 'United States', 'Desktop (Chrome/Mac)', TRUE, 0.94, 'positive');

INSERT INTO `messages` (`id`, `conversation_id`, `sender`, `message_text`)
VALUES
('msg_01', 'conv_9821', 'agent', 'Hello! Welcome to ApexCloud. Are you looking to scale your infrastructure or explore our Enterprise pricing today?'),
('msg_02', 'conv_9821', 'visitor', 'Hi, we currently handle 50k visitors a month and need an AI that can answer technical questions and book demos.'),
('msg_03', 'conv_9821', 'agent', 'ApexCloud is built exactly for that volume! Our AI sales agent can ingest your technical API docs, answer complex architecture questions, and automatically qualify inbound leads before routing them to your calendar.'),
('msg_04', 'conv_9821', 'visitor', 'Does it integrate with HubSpot? What is the cost?'),
('msg_05', 'conv_9821', 'agent', 'Yes, we have 1-click bi-directional HubSpot sync! For your volume, our Professional Plan at $79/mo covers up to 5 agents and 1,000 captured leads. I can send you our detailed integration guide and a demo invite right now—what is your business email?'),
('msg_06', 'conv_9821', 'visitor', 'Great, send it to david.m@acmecorp.com or call me at +1 (555) 234-8901. I am David Miller, Head of Growth at Acme Corp.'),
('msg_07', 'conv_9821', 'agent', 'Thank you David! I have sent the HubSpot integration guide to david.m@acmecorp.com and assigned our Senior Solutions Architect to connect with you. Have a great day!');
