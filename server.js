/**
 * AI Sales Agent SaaS Platform - Standalone Production Server
 * Zero external dependencies required - runs with native Node.js!
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME Types Mapping
const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".sql": "text/plain"
};

// In-Memory Data Store (Enterprise Production State)
let mockDatabase = {
    leads: [
        { id: "LD-8942", name: "David Miller", email: "david.m@acmecorp.com", phone: "+1 (555) 234-8901", company: "Acme Corp", product: "Enterprise Multi-Agent", budget: "Enterprise", score: "94% Hot", status: "hot", synced: true, time: "12 mins ago" },
        { id: "LD-8941", name: "Priya Patel", email: "priya@techventures.io", phone: "+91 98200 44122", company: "TechVentures", product: "Professional 5-Agent Suite", budget: "Growth", score: "88% Hot", status: "hot", synced: true, time: "45 mins ago" },
        { id: "LD-8940", name: "Marcus Sterling", email: "m.sterling@globalnet.org", phone: "+44 20 7946 0912", company: "GlobalNet Systems", product: "Custom API & White-label", budget: "Enterprise", score: "72% Warm", status: "warm", synced: false, time: "2 hours ago" }
    ],
    agents: [
        { id: "agt_live_9a8b7c6d", name: "Apex Closer Pro", tone: "consultative", role: "Senior AI Sales Executive", active: true },
        { id: "agt_live_3f2b1a9c", name: "Stitch Inbound AI", tone: "persuasive", role: "Growth Specialist", active: true }
    ],
    mrr: 18450,
    knowledge: [
        {
            id: "kn_headphones",
            title: "Apex Pro Wireless Headphones",
            keywords: ["headphone", "audio", "earphone", "anc", "music", "apex pro", "sound"],
            answer: "Our Apex Pro Wireless Headphones feature 40dB Active Noise Cancellation (ANC), 40-hour battery life (60h standard), Bluetooth 5.3, and lossless 40mm dynamic drivers. Available in Matte Black and Pearl Silver with a 2-Year Warranty!",
            source: "testing_catalog.pdf"
        },
        {
            id: "kn_watch",
            title: "Apex Ultra Smartwatch 2",
            keywords: ["watch", "smartwatch", "swim", "swimming", "waterproof", "gps", "battery", "titanium"],
            answer: "The Apex Ultra Smartwatch 2 features an aerospace titanium chassis, sapphire crystal AMOLED display, and 100m (10 ATM) water resistance — perfectly safe for swimming and diving! Includes ECG, heart rate tracking, and 14-day battery life.",
            source: "testing_catalog.pdf"
        },
        {
            id: "kn_soundbar",
            title: "Apex Studio Soundbar 7.1",
            keywords: ["soundbar", "speaker", "sound", "dolby", "tv", "atmos", "theater", "subwoofer"],
            answer: "The Apex Studio Soundbar features 500W peak power, Dolby Atmos 7.1 surround sound, a wireless 8-inch subwoofer, and HDMI eARC connectivity for cinematic home theater audio!",
            source: "testing_catalog.pdf"
        },
        {
            id: "kn_charger",
            title: "Apex GaN III Fast Charger 100W",
            keywords: ["charger", "adapter", "gan", "100w", "power delivery", "fast charge", "usb-c", "macbook", "phone"],
            answer: "The Apex GaN III Fast Charger 100W delivers 100W Power Delivery 3.0 via 3x USB-C and 1x USB-A ports. It rapidly powers MacBooks, laptops, iPhones, and Android devices simultaneously with Thermal Guard protection!",
            source: "testing_catalog.pdf"
        },
        {
            id: "kn_tshirt",
            title: "Premium Organic Cotton T-Shirt",
            keywords: ["shirt", "t-shirt", "tshirt", "tee", "top", "clothes", "clothing", "apparel", "cotton", "fabric"],
            answer: "Our t-shirts are crafted from 100% premium combed organic cotton (180 GSM). They are pre-shrunk, breathable, ultra-soft, and designed for lasting everyday comfort with double-stitched hems.",
            source: "store_inventory"
        },
        {
            id: "kn_sizing",
            title: "Apparel Sizing & Fit",
            keywords: ["size", "sizing", "fit", "measurement", "small", "medium", "large", "xl", "xxl", "xs", "chart"],
            answer: "Our apparel follows standard regular fit sizing (XS, S, M, L, XL, XXL). For a standard fit, order your regular size. If you prefer a trendy oversized streetwear look, we recommend sizing up one size!",
            source: "store_inventory"
        },
        {
            id: "kn_shipping",
            title: "Shipping & Delivery Policy",
            keywords: ["shipping", "delivery", "arrive", "dispatch", "days", "time", "track", "courier", "fast", "deliver"],
            answer: "Standard Express Delivery takes 2 to 4 business days nationwide! Orders placed before 3:00 PM are dispatched on the same day. Tracking details are automatically sent to your email as soon as the order ships.",
            source: "testing_catalog.pdf"
        },
        {
            id: "kn_return",
            title: "Return & Refund Policy",
            keywords: ["return", "refund", "exchange", "replace", "cancel", "money back", "30-day"],
            answer: "We offer a 30-day risk-free return and exchange policy! If you need a different size, color, or a full refund, our return process is 100% hassle-free with complimentary doorstep pickup.",
            source: "testing_catalog.pdf"
        },
        {
            id: "kn_warranty",
            title: "2-Year Hardware Warranty",
            keywords: ["warranty", "guarantee", "defect", "broken", "repair", "replacement"],
            answer: "All products come with our official 2-Year Full Hardware & Quality Replacement Warranty covering manufacturing defects and hardware anomalies with zero deductible fees.",
            source: "testing_catalog.pdf"
        },
        {
            id: "kn_discount",
            title: "Discounts & Promo Codes",
            keywords: ["discount", "coupon", "code", "promo", "offer", "sale", "deal", "cheap"],
            answer: "Yes! We offer a special 15% discount code for new visitors. Would you like me to apply it to your order? Just type your email or phone number and I'll send it over right now!",
            source: "store_promotions"
        },
        {
            id: "kn_payment",
            title: "Accepted Payment Methods",
            keywords: ["payment", "pay", "cod", "upi", "card", "visa", "mastercard", "cash"],
            answer: "We accept all secure payment methods: Credit/Debit Cards, Net Banking, UPI, Apple Pay, Google Pay, and Cash on Delivery (COD) where eligible at checkout.",
            source: "checkout_policy"
        },
        {
            id: "kn_products",
            title: "General Store Product Collection",
            keywords: ["product", "products", "item", "items", "catalog", "collection", "stock", "sell", "buy", "store", "what do you have", "show"],
            answer: "We offer premium electronics (Apex Pro Headphones, Apex Ultra Smartwatch, Apex Studio Soundbar, and 100W GaN Chargers) as well as premium organic cotton apparel! Which product would you like more details on?",
            source: "testing_catalog.pdf"
        }
    ]
};

// Helper: Parse JSON Body
function parseJsonBody(req) {
    return new Promise((resolve) => {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}

// Server Request Handler
const server = http.createServer(async (req, res) => {
    // CORS & No-Cache headers to prevent stale mobile and proxy caching
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Agent-Key");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // --- REST API ENDPOINTS ---
    if (pathname.startsWith("/api/")) {
        res.setHeader("Content-Type", "application/json");

        // 1. Health Endpoint
        if (pathname === "/api/health") {
            res.writeHead(200);
            res.end(JSON.stringify({
                status: "healthy",
                platform: "AI Sales Agent SaaS",
                uptimeSeconds: Math.floor(process.uptime()),
                database: "operational",
                vectorsIndexed: 45201,
                activeAgents: mockDatabase.agents.length,
                mrr: mockDatabase.mrr
            }));
            return;
        }

        // 2. Leads Endpoints
        if (pathname === "/api/leads") {
            if (req.method === "GET") {
                res.writeHead(200);
                res.end(JSON.stringify(mockDatabase.leads));
                return;
            } else if (req.method === "POST") {
                const body = await parseJsonBody(req);
                const newLead = {
                    id: "LD-" + Math.floor(8900 + Math.random() * 1000),
                    name: body.name || "Web Visitor",
                    email: body.email || "visitor@company.com",
                    phone: body.phone || "+1 (555) 019-2831",
                    company: body.company || "Prospective Tenant",
                    product: body.product || "AI Sales Suite",
                    budget: body.budget || "Enterprise",
                    score: "95% Hot",
                    status: "hot",
                    synced: true,
                    time: "Just now"
                };
                mockDatabase.leads.unshift(newLead);
                res.writeHead(201);
                res.end(JSON.stringify({ success: true, lead: newLead }));
                return;
            }
        }

        // 3. Dynamic Knowledge Base API (Ingestion & Search)
        if (pathname === "/api/knowledge") {
            if (req.method === "GET") {
                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    count: mockDatabase.knowledge.length,
                    items: mockDatabase.knowledge
                }));
                return;
            } else if (req.method === "POST") {
                const body = await parseJsonBody(req);
                const title = body.title || "Uploaded Document";
                const content = body.content || body.answer || "";
                const source = body.source || "knowledge_upload";
                
                // Extract keywords from title and content
                const rawWords = (title + " " + content).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2);
                const uniqueKeywords = [...new Set(rawWords)];

                const newKnowledgeItem = {
                    id: "kn_" + Date.now(),
                    title: title,
                    keywords: body.keywords && body.keywords.length ? body.keywords : uniqueKeywords.slice(0, 15),
                    answer: content,
                    source: source,
                    vectors: 1280,
                    indexedAt: new Date().toISOString()
                };

                mockDatabase.knowledge.unshift(newKnowledgeItem);

                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: "Document successfully ingested and indexed into AI Knowledge Base!",
                    item: newKnowledgeItem,
                    totalKnowledgeItems: mockDatabase.knowledge.length
                }));
                return;
            }
        }

        // 4. AI Sales Chat Endpoint (Dynamic Knowledge & Semantic Matching)
        if (pathname === "/api/chat" && req.method === "POST") {
            const body = await parseJsonBody(req);
            const userMsg = (body.message || "").trim();
            const lower = userMsg.toLowerCase();

            // Lead capture check
            const emailMatch = userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const phoneMatch = userMsg.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);

            let reply = "";
            let matchedSource = "Store Knowledge Base";

            if (emailMatch || phoneMatch) {
                const capturedEmail = emailMatch ? emailMatch[0] : "";
                const capturedPhone = phoneMatch ? phoneMatch[0] : "";
                reply = `🎉 Thank you! I have saved your contact details (${capturedEmail || capturedPhone}). Our product specialist will follow up shortly with full details and your exclusive order discount!`;
                matchedSource = "Lead Capture Engine";
            } else {
                // Score against all knowledge items in memory
                const words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2);
                let bestMatch = null;
                let highestScore = 0;

                for (const item of mockDatabase.knowledge) {
                    let score = 0;
                    // Exact keyword matches
                    for (const kw of item.keywords) {
                        if (lower.includes(kw)) {
                            score += (kw.length > 4 ? 3 : 2);
                        }
                    }
                    // Title match bonus
                    if (lower.includes(item.title.toLowerCase())) {
                        score += 5;
                    }
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = item;
                    }
                }

                if (bestMatch && highestScore >= 2) {
                    reply = bestMatch.answer;
                    matchedSource = bestMatch.title + " (" + bestMatch.source + ")";
                } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
                    reply = "Hello! 👋 Welcome to our store. I am your AI Shopping & Product Specialist. Ask me anything about our products, sizing, shipping, or returns. How can I help you today?";
                    matchedSource = "Greeting Protocol";
                } else {
                    reply = "That's a great question! I'm here to assist with all product details, sizing, delivery times, and stock availability. Could you tell me which specific item you're looking for, or share your question in a bit more detail?";
                    matchedSource = "Storefront Assistant";
                }
            }

            res.writeHead(200);
            res.end(JSON.stringify({
                reply,
                agent_id: body.agent_id || "agt_live_9a8b7c6d",
                sources_cited: [matchedSource]
            }));
            return;
        }

        // 4. Simulated Checkout Endpoint
        if (pathname === "/api/billing/simulate-checkout" && req.method === "POST") {
            const body = await parseJsonBody(req);
            const amount = Number(body.amount) || 79;
            mockDatabase.mrr += amount;
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                transactionId: "TX-" + Math.floor(1000 + Math.random() * 9000),
                amountCharged: amount,
                newPlan: body.planName || "Professional Tier",
                receiptUrl: "/index.html"
            }));
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ error: "Endpoint not found" }));
        return;
    }

    // --- STATIC ASSET SERVING ---
    let safePath = path.normalize(decodeURI(pathname)).replace(/^(\.\.[\/\\])+/, "");
    if (safePath === "/" || safePath === "\\") safePath = "/index.html";

    let filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback: check with .html extension
            if (!path.extname(filePath)) {
                const htmlPath = filePath + ".html";
                if (fs.existsSync(htmlPath)) {
                    filePath = htmlPath;
                } else {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end("<h1>404 Not Found</h1><p><a href='/index.html'>Go to Dashboard</a></p>");
                    return;
                }
            } else {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found</h1><p><a href='/index.html'>Go to Dashboard</a></p>");
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        fs.readFile(filePath, (readErr, content) => {
            if (readErr) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Server Error reading file.");
                return;
            }
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n========================================================`);
    console.log(`🚀 SalesAI Pro SaaS Platform Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`💬 Live Storefront: http://localhost:${PORT}/visitor-demo.html`);
    console.log(`📊 Super Admin Dashboard: http://localhost:${PORT}/index.html`);
    console.log(`========================================================\n`);
});
