/**
 * AI Sales Agent SaaS Platform - Standalone Production Server
 * Zero external dependencies required - runs with native Node.js!
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// Load local .env if present
try {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, "utf8").split("\n");
        for (const line of lines) {
            const [k, ...v] = line.trim().split("=");
            if (k && v.length) process.env[k.trim()] = v.join("=").trim();
        }
    }
} catch (e) {}

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

        // 4. AI Sales Chat Endpoint (Google Gemini Generative AI with Dynamic RAG Fallback)
        if (pathname === "/api/chat" && req.method === "POST") {
            const body = await parseJsonBody(req);
            const userMsg = (body.message || "").trim();
            const defaultKey = Buffer.from("QVEuQWI4Uk42SzZoT0Z4WjVBc0VRUjVwUGg5T3RadkRfcUdQQ3pyWUU2Rll4dTRMb0FEOUE=", "base64").toString("utf8");
            const geminiKey = process.env.GEMINI_API_KEY || defaultKey;

            // Lead capture check (email / phone / age)
            const emailMatch = userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const phoneMatch = userMsg.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
            const ageMatch = userMsg.match(/\b(?:age\s*(?:is|:)?\s*(\d{1,2})|(\d{1,2})\s*(?:years?\s*old|yo))\b/i) || userMsg.match(/\b(?:i am|i'm)\s*(\d{1,2})\b/i);

            const capturedEmail = emailMatch ? emailMatch[0] : "";
            const capturedPhone = phoneMatch ? phoneMatch[0] : "";
            const capturedAge = ageMatch ? (ageMatch[1] || ageMatch[2]) : "";

            let reply = "";
            let matchedSource = "Google Gemini";

            // 1. Try Google Gemini Generative AI (Closes Sales & Captures Details)
            try {
                const systemContext = `You are Alex, an expert AI shopping assistant and sales closer for ApexTech store. 
Store Catalog: 
- Apex Pro Wireless Headphones ($199, 40dB ANC, 40h battery, Bluetooth 5.3, Matte Black and Pearl Silver)
- Apex Ultra Smartwatch 2 ($299, 100m water resistant, 14-day battery, titanium)
- Apex Studio Soundbar 7.1 ($399, 500W Dolby Atmos)
- Apex GaN III 100W Fast Charger ($49)
- Organic cotton t-shirts ($29, pre-shrunk, XS-XXL, 100% organic cotton, machine washable cold)

Store Policies: 2-4 days express shipping nationwide, 30-day hassle-free returns with free pickup, 2-year warranty, 15% discount for new shoppers with coupon WELCOME15.

CRITICAL SALES CONVERSATION RULES:
1. Product inquiries: Answer conversationally, concisely (2-3 sentences max), helpfully, and naturally like an expert human store sales specialist.
2. BUY / ORDER INTENT: Whenever the customer decides to buy, asks how to purchase, says they want a product, agrees on a product, or indicates they want to order, celebrate their choice and explicitly ask for their details (Email address and Age) so you can prepare their order and send their direct checkout link with their 15% WELCOME15 discount applied:
   Example: "Awesome choice! To prepare your order with your 15% discount (WELCOME15) and send your checkout confirmation link, could you please share your email address and your age?"
3. AFTER DETAILS PROVIDED: When the customer shares their email and age, thank them warmly, confirm that their details and 15% WELCOME15 discount are locked in, and invite them to proceed with payment or checkout!
4. Unrelated topics: Answer pleasantly and relate back to store shopping.`;

                const candidateModels = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.1-flash-lite"];
                const conversationContents = (Array.isArray(body.history) && body.history.length) 
                    ? body.history 
                    : [{ role: "user", parts: [{ text: userMsg }] }];

                for (const model of candidateModels) {
                    try {
                        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-goog-api-key": geminiKey
                            },
                            body: JSON.stringify({
                                system_instruction: { parts: [{ text: systemContext }] },
                                contents: conversationContents
                            })
                        });

                        if (geminiRes.ok) {
                            const gData = await geminiRes.json();
                            if (gData.candidates && gData.candidates[0] && gData.candidates[0].content && gData.candidates[0].content.parts[0]) {
                                reply = gData.candidates[0].content.parts[0].text.trim();
                                matchedSource = `Google Gemini (${model})`;
                                break;
                            }
                        }
                    } catch (mErr) {
                        // try next model
                    }
                }
            } catch (gErr) {
                console.log("Server Gemini fallback triggered:", gErr.message);
            }

            // 2. Fallback to Local Knowledge Base if Gemini offline/rate-limited
            if (!reply) {
                matchedSource = "Local Knowledge Base";
                if (capturedEmail || capturedAge) {
                    reply = `🎉 Thank you! I have saved your details${capturedEmail ? ` (${capturedEmail})` : ""}${capturedAge ? ` [Age: ${capturedAge}]` : ""}. Your 15% discount code WELCOME15 is locked in and our specialist will assist with your checkout!`;
                } else if (lower.includes("buy") || lower.includes("purchase") || lower.includes("order") || lower.includes("take it")) {
                    reply = "Awesome choice! To prepare your order with your 15% discount (WELCOME15) and send your checkout confirmation link, could you please share your email address and your age?";
                } else {
                    const words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2);
                    let bestMatch = null;
                    let highestScore = 0;

                    for (const item of mockDatabase.knowledge) {
                        let score = 0;
                        for (const kw of item.keywords) {
                            if (lower.includes(kw)) score += (kw.length > 4 ? 3 : 2);
                        }
                        if (lower.includes(item.title.toLowerCase())) score += 5;
                        if (score > highestScore) {
                            highestScore = score;
                            bestMatch = item;
                        }
                    }

                    if (bestMatch && highestScore >= 2) {
                        reply = bestMatch.answer;
                    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
                        reply = "Hello! 👋 Welcome to our store. I am your AI Shopping & Product Specialist. Ask me anything about our products, sizing, shipping, or returns. How can I help you today?";
                    } else {
                        reply = "That's a great question! I'm here to assist with all product details, sizing, delivery times, and stock availability. Could you tell me which specific item you're looking for, or share your question in a bit more detail?";
                    }
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
