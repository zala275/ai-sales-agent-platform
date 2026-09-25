/**
 * AI Sales Agent SaaS Platform - Standalone Production & Showcase Server
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

// In-Memory Data Store (Simulated Database for Showcase)
let mockDatabase = {
    leads: [
        { id: "LD-8942", name: "David Miller", email: "david.m@acmecorp.com", phone: "+1 (555) 234-8901", company: "Acme Corp", product: "Enterprise Multi-Agent", budget: "$1,500/mo", score: "94% Hot", status: "hot", synced: true, time: "12 mins ago" },
        { id: "LD-8941", name: "Priya Patel", email: "priya@techventures.io", phone: "+91 98200 44122", company: "TechVentures", product: "Professional 5-Agent Suite", budget: "$500/mo", score: "88% Hot", status: "hot", synced: true, time: "45 mins ago" },
        { id: "LD-8940", name: "Marcus Sterling", email: "m.sterling@globalnet.org", phone: "+44 20 7946 0912", company: "GlobalNet Systems", product: "Custom API & White-label", budget: "$3,000/mo", score: "72% Warm", status: "warm", synced: false, time: "2 hours ago" }
    ],
    agents: [
        { id: "agt_live_9a8b7c6d", name: "Apex Closer Pro", tone: "consultative", role: "Senior AI Sales Executive", active: true },
        { id: "agt_live_3f2b1a9c", name: "Stitch Inbound AI", tone: "persuasive", role: "Growth Specialist", active: true }
    ],
    mrr: 18450
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
                    budget: body.budget || "$1,000/mo",
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

        // 3. AI Sales Chat Endpoint (Autonomous Online Salesman)
        if (pathname === "/api/chat" && req.method === "POST") {
            const body = await parseJsonBody(req);
            const message = (body.message || "").toLowerCase();
            let reply = "Hello! I am your autonomous AI Sales Representative — not a passive chatbot. I work as your online human sales executive: consulting on pipeline growth, calculating ROI, overcoming objections, and tailoring high-converting proposals. What kind of business are you scaling today?";

            if (message.includes("chatbot") || message.includes("bot") || message.includes("not a bot") || message.includes("who are you")) {
                reply = "I am an Autonomous AI Sales Representative — definitely not a passive chatbot. While support bots merely dump FAQ links, I operate as your online human sales executive: analyzing buyer pain points, conducting BANT lead qualification (Budget, Authority, Need, Timeline), calculating exact ROI, overcoming price objections, and booking warm pipeline deals 24/7. What's your average deal size?";
            } else if (message.includes("expensive") || message.includes("costly") || message.includes("too much") || message.includes("budget") || message.includes("discount")) {
                reply = "I completely respect budget diligence! Let's examine the mathematics: If your average deal value is $1,000, closing just ONE single lead that would have bounced after hours yields a 1,200% ROI on our $79/mo Professional Tier. Plus, as an authorized closer, I can apply a 20% Showcase Partner Credit today. Shall I reserve that for your workspace?";
            } else if (message.includes("price") || message.includes("cost") || message.includes("plan")) {
                reply = "Our plans start at $29/mo for Starter, $79/mo for Professional (our most popular with 5 agents and full CRM sync), and $199/mo for Enterprise. What is your business email so I can send the complete specification and custom ROI breakdown?";
            } else if (message.includes("hubspot") || message.includes("crm") || message.includes("salesforce")) {
                reply = "Yes! We support direct bi-directional synchronization with HubSpot and Salesforce. What is your email to send the integration documentation?";
            } else if (message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
                reply = "Thank you! I have captured your contact information, qualified your lead score as Hot (95%), and synchronized it into our pipeline. Our senior solutions consultant will connect with you shortly.";
            }

            res.writeHead(200);
            res.end(JSON.stringify({
                reply,
                agent_id: body.agent_id || "agt_live_9a8b7c6d",
                sources_cited: ["ApexCloud Pricing Matrix", "RAG Vector Store Chunk #18", "BANT Qualification Engine"]
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
                receiptUrl: "/billing.html"
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
    console.log(`💬 Test Live Widget: http://localhost:${PORT}/visitor-demo.html`);
    console.log(`📊 Super Admin Dashboard: http://localhost:${PORT}/index.html`);
    console.log(`📱 Mobile View: http://localhost:${PORT}/mobile-view.html`);
    console.log(`========================================================\n`);
});
