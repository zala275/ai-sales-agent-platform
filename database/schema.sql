-- ==========================================================
-- AI Sales Agent SaaS Platform - Database Schema
-- Multi-Tenant System Architecture
-- Compatible with MySQL 8.0+ and PostgreSQL
-- ==========================================================

-- 1. Tenants / Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('super_admin', 'business_owner', 'team_manager', 'agent_trainer') DEFAULT 'business_owner',
    `company_name` VARCHAR(150),
    `company_website` VARCHAR(255),
    `avatar_url` VARCHAR(500),
    `plan_id` VARCHAR(50) DEFAULT 'starter',
    `status` ENUM('active', 'trialing', 'suspended', 'cancelled') DEFAULT 'trialing',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SaaS Plans Table
CREATE TABLE IF NOT EXISTS `plans` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `price_monthly` DECIMAL(10,2) NOT NULL,
    `price_annual` DECIMAL(10,2) NOT NULL,
    `agent_limit` INT NOT NULL DEFAULT 1,
    `monthly_lead_limit` INT NOT NULL DEFAULT 100,
    `knowledge_doc_limit` INT NOT NULL DEFAULT 5,
    `has_crm_sync` BOOLEAN DEFAULT FALSE,
    `has_ab_testing` BOOLEAN DEFAULT FALSE,
    `has_custom_branding` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Subscriptions & Transactions Table
CREATE TABLE IF NOT EXISTS `subscriptions` (
    `id` VARCHAR(50) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `plan_id` VARCHAR(50) NOT NULL,
    `amount_paid` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(10) DEFAULT 'USD',
    `status` ENUM('active', 'past_due', 'canceled', 'simulated') DEFAULT 'active',
    `payment_method` VARCHAR(50) DEFAULT 'card_demo',
    `transaction_reference` VARCHAR(100),
    `billing_cycle` ENUM('monthly', 'annual') DEFAULT 'monthly',
    `current_period_start` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `current_period_end` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. AI Agents Table
CREATE TABLE IF NOT EXISTS `agents` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `avatar` VARCHAR(500),
    `role_title` VARCHAR(100) DEFAULT 'AI Sales Specialist',
    `tone` ENUM('persuasive', 'consultative', 'friendly', 'urgent', 'technical') DEFAULT 'consultative',
    `greeting_message` TEXT,
    `system_prompt` TEXT,
    `api_key` VARCHAR(100) NOT NULL UNIQUE,
    `whitelisted_domains` TEXT,
    `widget_primary_color` VARCHAR(20) DEFAULT '#2170e4',
    `widget_position` ENUM('bottom_right', 'bottom_left') DEFAULT 'bottom_right',
    `lead_capture_trigger` ENUM('high_intent', 'immediate', 'after_3_messages') DEFAULT 'high_intent',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Knowledge Base Documents & Vectors Table (RAG)
CREATE TABLE IF NOT EXISTS `knowledge_documents` (
    `id` VARCHAR(36) PRIMARY KEY,
    `agent_id` VARCHAR(36) NOT NULL,
    `source_type` ENUM('pdf', 'url_crawl', 'faq_manual', 'text_note') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `source_url` VARCHAR(500),
    `file_path` VARCHAR(500),
    `total_chunks` INT DEFAULT 0,
    `sync_status` ENUM('ready', 'indexing', 'failed') DEFAULT 'ready',
    `vector_count` INT DEFAULT 0,
    `last_synced_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Visitor Conversations Table
CREATE TABLE IF NOT EXISTS `conversations` (
    `id` VARCHAR(36) PRIMARY KEY,
    `agent_id` VARCHAR(36) NOT NULL,
    `visitor_session_id` VARCHAR(100) NOT NULL,
    `visitor_ip` VARCHAR(45),
    `visitor_country` VARCHAR(50) DEFAULT 'India',
    `visitor_device` VARCHAR(50) DEFAULT 'Desktop',
    `lead_captured` BOOLEAN DEFAULT FALSE,
    `intent_score` DECIMAL(4,2) DEFAULT 0.00, -- e.g. 0.85 (Hot Lead)
    `sentiment` ENUM('positive', 'neutral', 'hesitant', 'negative') DEFAULT 'neutral',
    `duration_seconds` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Chat Messages Table (Transcripts)
CREATE TABLE IF NOT EXISTS `messages` (
    `id` VARCHAR(36) PRIMARY KEY,
    `conversation_id` VARCHAR(36) NOT NULL,
    `sender` ENUM('visitor', 'agent', 'system') NOT NULL,
    `message_text` TEXT NOT NULL,
    `sources_cited` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Captured Leads Table
CREATE TABLE IF NOT EXISTS `leads` (
    `id` VARCHAR(36) PRIMARY KEY,
    `agent_id` VARCHAR(36) NOT NULL,
    `conversation_id` VARCHAR(36),
    `full_name` VARCHAR(120),
    `email` VARCHAR(191),
    `phone` VARCHAR(50),
    `company` VARCHAR(150),
    `interest_product` VARCHAR(150),
    `budget_estimate` VARCHAR(50),
    `status` ENUM('hot', 'warm', 'cold', 'contacted', 'closed_won') DEFAULT 'hot',
    `crm_synced` BOOLEAN DEFAULT FALSE,
    `captured_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. A/B Testing Experiments Table
CREATE TABLE IF NOT EXISTS `ab_experiments` (
    `id` VARCHAR(36) PRIMARY KEY,
    `agent_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `variant_a_prompt` TEXT NOT NULL,
    `variant_b_prompt` TEXT NOT NULL,
    `variant_a_conversions` INT DEFAULT 0,
    `variant_b_conversions` INT DEFAULT 0,
    `variant_a_impressions` INT DEFAULT 0,
    `variant_b_impressions` INT DEFAULT 0,
    `status` ENUM('running', 'paused', 'completed') DEFAULT 'running',
    `winner_variant` ENUM('variant_a', 'variant_b', 'none') DEFAULT 'none',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for ultra-fast query performance
CREATE INDEX idx_agents_api_key ON `agents`(`api_key`);
CREATE INDEX idx_leads_agent ON `leads`(`agent_id`, `captured_at`);
CREATE INDEX idx_conversations_agent ON `conversations`(`agent_id`, `created_at`);
CREATE INDEX idx_messages_conv ON `messages`(`conversation_id`, `created_at`);

-- ==========================================================
-- 10. Initial Seed Data for Instant Setup & Testing
-- ==========================================================

-- Seed SaaS Plans
INSERT INTO `plans` (`id`, `name`, `price_monthly`, `price_annual`, `agent_limit`, `monthly_lead_limit`, `knowledge_doc_limit`, `has_crm_sync`, `has_ab_testing`, `has_custom_branding`)
VALUES 
    ('starter', 'Starter Tier', 29.00, 290.00, 1, 150, 5, FALSE, FALSE, FALSE),
    ('professional', 'Professional Tier', 79.00, 790.00, 5, 1000, 25, TRUE, FALSE, TRUE),
    ('enterprise', 'Enterprise Tier', 199.00, 1990.00, 20, 10000, 100, TRUE, TRUE, TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Default Admin User
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `company_name`, `company_website`, `plan_id`, `status`)
VALUES 
    ('usr_super_001', 'Ghanshyam Zala', 'admin@salesai.pro', '$2b$12$eD4j9sZ1examplehashforsecurityxyz', 'super_admin', 'SalesAI Global', 'https://salesai.pro', 'professional', 'active')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Live AI Agents
INSERT INTO `agents` (`id`, `user_id`, `name`, `role_title`, `tone`, `greeting_message`, `system_prompt`, `api_key`, `widget_primary_color`, `widget_position`, `lead_capture_trigger`, `is_active`)
VALUES 
    ('agt_live_9a8b7c6d', 'usr_super_001', 'Apex Closer Pro', 'Senior AI Sales Executive', 'consultative', 'Hello! Welcome to our platform. Looking to scale inbound sales with autonomous AI agents?', 'You are Apex Closer Pro, an enterprise SaaS sales specialist. Answer questions grounded in provided knowledge base and qualify visitor intent before requesting contact details.', 'demo_key_apex_sales_9a8b7c6d', '#2170e4', 'bottom_right', 'high_intent', TRUE),
    ('agt_live_3f2b1a9c', 'usr_super_001', 'Stitch Inbound AI', 'Growth Specialist', 'persuasive', 'Hi there! Ready to see how AI agents can double your lead conversions in 14 days?', 'You are Stitch Inbound AI, persuasive and proactive. Emphasize fast ROI, CRM sync, and instant lead capture.', 'demo_key_stitch_inbound_3f2b1a9c', '#9466ff', 'bottom_right', 'after_3_messages', TRUE)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed High-Intent Leads
INSERT INTO `leads` (`id`, `agent_id`, `full_name`, `email`, `phone`, `company`, `interest_product`, `budget_estimate`, `status`, `crm_synced`)
VALUES 
    ('LD-8942', 'agt_live_9a8b7c6d', 'David Miller', 'david.m@acmecorp.com', '+1 (555) 234-8901', 'Acme Corp', 'Enterprise Multi-Agent', '$1,500/mo', 'hot', TRUE),
    ('LD-8941', 'agt_live_9a8b7c6d', 'Priya Patel', 'priya@techventures.io', '+91 98200 44122', 'TechVentures', 'Professional 5-Agent Suite', '$500/mo', 'hot', TRUE),
    ('LD-8940', 'agt_live_3f2b1a9c', 'Marcus Sterling', 'm.sterling@globalnet.org', '+44 20 7946 0912', 'GlobalNet Systems', 'Custom API & White-label', '$3,000/mo', 'warm', FALSE)
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`);

-- Seed A/B Experiment
INSERT INTO `ab_experiments` (`id`, `agent_id`, `name`, `variant_a_prompt`, `variant_b_prompt`, `variant_a_conversions`, `variant_b_conversions`, `variant_a_impressions`, `variant_b_impressions`, `status`, `winner_variant`)
VALUES 
    ('exp_ab_001', 'agt_live_9a8b7c6d', 'Consultative vs Urgent Greeting Test', 'Focus on understanding customer workflow and pain points.', 'Focus on immediate value proposition and limited-time offer.', 48, 62, 320, 315, 'running', 'none')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

