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
    // CORS headers for embedded widgets
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Agent-Key");

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

        // 3. AI Sales Chat Endpoint
        if (pathname === "/api/chat" && req.method === "POST") {
            const body = await parseJsonBody(req);
            const message = (body.message || "").toLowerCase();
            let reply = "Hello! I am your autonomous AI Sales Agent. I can help answer questions about our plans, capabilities, and schedule a customized architecture demo. Would you like our pricing matrix?";

            if (message.includes("price") || message.includes("cost") || message.includes("plan")) {
                reply = "Our Starter plan is $29/mo, and our popular Professional tier is $79/mo for up to 5 agents and 1,000 captured leads. What is your business email so I can send the complete specification?";
            } else if (message.includes("hubspot") || message.includes("crm")) {
                reply = "Yes! We support direct bi-directional synchronization with HubSpot and Salesforce. What is your email to send the integration documentation?";
            } else if (message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
                reply = "Thank you! I have recorded your contact information and scheduled our senior solutions consultant to connect with you shortly.";
            }

            res.writeHead(200);
            res.end(JSON.stringify({
                reply,
                agent_id: body.agent_id || "agt_live_9a8b7c6d",
                sources_cited: ["ApexCloud Pricing Matrix", "RAG Vector Store Chunk #18"]
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
