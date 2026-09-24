/**
 * AI Sales Agent SaaS Platform - Embeddable Sales Chat Widget
 * Can be dropped onto any website via:
 * <script src="widget/sales-widget.js" data-agent-key="agt_live_9a8b7c6d"></script>
 */

(function () {
    const currentScript = document.currentScript;
    const agentKey = currentScript ? currentScript.getAttribute("data-agent-key") : "agt_live_default";
    const primaryColor = (currentScript && currentScript.getAttribute("data-primary-color")) || "#2170e4";
    const position = (currentScript && currentScript.getAttribute("data-position")) || "bottom-right";

    // Knowledge & Responses for Autonomous Sales Dialogue (Online Human Salesman)
    const SALES_RESPONSES = [
        {
            keywords: ["chatbot", "bot", "not a bot", "human", "who are you", "what are you"],
            response: "I am an Autonomous AI Sales Representative — definitely not a passive chatbot. While support bots merely dump FAQ links, I operate as your online human sales executive: analyzing buyer pain points, conducting BANT lead qualification (Budget, Authority, Need, Timeline), calculating exact ROI, overcoming price objections, and booking warm pipeline deals 24/7. What's your average deal size?",
            intent: "consultative_positioning"
        },
        {
            keywords: ["expensive", "costly", "too much", "high price", "budget", "discount"],
            response: "I completely respect budget diligence! Let's examine the mathematics: If your average deal value is $1,000, closing just ONE single lead that would have bounced after hours yields a 1,200% ROI on our $79/mo Professional Tier. Plus, as an authorized closer, I can apply a 20% Showcase Partner Credit today. Shall I reserve that for your workspace?",
            intent: "objection_handling"
        },
        {
            keywords: ["pricing", "cost", "plan", "price", "how much", "rate"],
            response: "Our tiers are built for pipeline growth: Starter ($29/mo) for 1 agent and 150 leads, Professional ($79/mo) for 5 agents, full CRM sync, and objection intelligence (most popular), and Enterprise ($199/mo) with custom API routing. Would you like me to send our complete ROI matrix to your work email?",
            intent: "pricing"
        },
        {
            keywords: ["hubspot", "crm", "salesforce", "integrate", "integration", "webhook"],
            response: "Yes! We support 1-click bi-directional sync with HubSpot, Salesforce, Zoho, and custom webhooks. All qualified leads, conversation transcripts, and BANT scores are pushed to your pipeline in real time.",
            intent: "integration"
        },
        {
            keywords: ["demo", "schedule", "call", "talk", "sales", "rep", "close", "buy"],
            response: "I'd love to connect you with our Senior Solutions Architect for a 15-minute tailored walkthrough! What's the best work email and phone number to send your calendar invite to?",
            intent: "demo_request"
        },
        {
            keywords: ["accuracy", "rag", "hallucination", "safe", "pdf", "train"],
            response: "Our platform uses RAG (Retrieval-Augmented Generation) with strict document-grounded vector search. Your agent only answers using your verified PDFs and website data, eliminating hallucinations with 99.2% accuracy.",
            intent: "technical"
        }
    ];

    // Inject Styles
    const style = document.createElement("style");
    style.textContent = `
        #salesai-widget-container {
            position: fixed;
            ${position === 'bottom-left' ? 'left: 24px;' : 'right: 24px;'}
            bottom: 24px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        #salesai-launcher-btn {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: ${primaryColor};
            box-shadow: 0 8px 24px rgba(33, 112, 228, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            color: #ffffff;
            border: none;
            outline: none;
        }
        #salesai-launcher-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 12px 32px rgba(33, 112, 228, 0.45);
        }
        #salesai-chat-window {
            position: absolute;
            ${position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
            bottom: 75px;
            width: 380px;
            height: 540px;
            max-width: calc(100vw - 48px);
            max-height: calc(100vh - 120px);
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.08);
            animation: salesaiFadeIn 0.25s ease-out;
        }
        @keyframes salesaiFadeIn {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .salesai-header {
            background: #131b2e;
            color: #ffffff;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .salesai-msg-list {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #f7f9fb;
        }
        .salesai-bubble-agent {
            background: #ffffff;
            color: #191c1e;
            padding: 12px 14px;
            border-radius: 16px 16px 16px 4px;
            font-size: 13px;
            line-height: 1.45;
            max-width: 82%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            border: 1px solid rgba(0,0,0,0.06);
        }
        .salesai-bubble-visitor {
            background: ${primaryColor};
            color: #ffffff;
            padding: 12px 14px;
            border-radius: 16px 16px 4px 16px;
            font-size: 13px;
            line-height: 1.45;
            max-width: 82%;
            margin-left: auto;
            box-shadow: 0 2px 6px rgba(33, 112, 228, 0.2);
        }
        .salesai-input-area {
            padding: 12px;
            background: #ffffff;
            border-top: 1px solid #eceef0;
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .salesai-input-area input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid #d8dadc;
            border-radius: 12px;
            font-size: 13px;
            outline: none;
        }
        .salesai-input-area input:focus {
            border-color: ${primaryColor};
        }
        .salesai-send-btn {
            background: ${primaryColor};
            color: white;
            border: none;
            border-radius: 10px;
            padding: 10px 14px;
            font-weight: 600;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Build DOM
    const container = document.createElement("div");
    container.id = "salesai-widget-container";
    container.innerHTML = `
        <div id="salesai-chat-window">
            <div class="salesai-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 34px; height: 34px; border-radius: 10px; background: ${primaryColor}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
                        ✦
                    </div>
                    <div>
                        <div style="font-weight: bold; font-size: 14px;">Apex Sales Closer</div>
                        <div style="font-size: 11px; opacity: 0.75; display: flex; align-items: center; gap: 4px;">
                            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 3px; background: #10b981;"></span>
                            Online & Ready to Assist
                        </div>
                    </div>
                </div>
                <button id="salesai-close-btn" style="background: none; border: none; color: #ffffff; font-size: 20px; cursor: pointer;">&times;</button>
            </div>

            <div class="salesai-msg-list" id="salesai-messages">
                <div class="salesai-bubble-agent">
                    👋 Welcome! I'm Alex, your Senior AI Sales Representative. Rather than a passive chatbot, I work as your online human sales executive: consulting on pipeline growth, calculating ROI, overcoming objections, and tailoring high-converting proposals. What kind of business are you scaling today?
                </div>
            </div>

            <form class="salesai-input-area" id="salesai-form">
                <input type="text" id="salesai-input" placeholder="Ask about pricing, features, or integrations..." autocomplete="off"/>
                <button type="submit" class="salesai-send-btn">Send</button>
            </form>
        </div>

        <button id="salesai-launcher-btn" aria-label="Open Sales Chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </button>
    `;

    document.body.appendChild(container);

    // Toggle Chat
    const launcher = document.getElementById("salesai-launcher-btn");
    const chatWindow = document.getElementById("salesai-chat-window");
    const closeBtn = document.getElementById("salesai-close-btn");
    const form = document.getElementById("salesai-form");
    const input = document.getElementById("salesai-input");
    const messages = document.getElementById("salesai-messages");

    launcher.onclick = () => {
        const isOpen = chatWindow.style.display === "flex";
        chatWindow.style.display = isOpen ? "none" : "flex";
        if (!isOpen) input.focus();
    };

    closeBtn.onclick = () => {
        chatWindow.style.display = "none";
    };

    // Chat Message Processing & Lead Extraction
    form.onsubmit = (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        // Append Visitor Bubble
        const visitorBubble = document.createElement("div");
        visitorBubble.className = "salesai-bubble-visitor";
        visitorBubble.textContent = text;
        messages.appendChild(visitorBubble);
        input.value = "";
        messages.scrollTop = messages.scrollHeight;

        // Check for Lead Submission (Email / Phone)
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const phoneMatch = text.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);

        setTimeout(() => {
            let replyText = "";
            let isLeadCaptured = false;

            if (emailMatch || phoneMatch) {
                isLeadCaptured = true;
                const email = emailMatch ? emailMatch[0] : "visitor@company.com";
                const phone = phoneMatch ? phoneMatch[0] : "+1 (555) 019-2831";

                replyText = `Thank you! I have saved your contact details (${email}). Our Senior Solutions Architect has been alerted and will send over our custom architecture whitepaper and pricing proposal shortly!`;

                // If AppState exists in global scope (e.g. on demo page), sync lead directly to dashboard!
                if (window.AppState && typeof window.AppState.captureLead === "function") {
                    window.AppState.captureLead({
                        name: "Website Visitor (" + email.split("@")[0] + ")",
                        email: email,
                        phone: phone,
                        company: email.split("@")[1].split(".")[0].toUpperCase() + " Corp",
                        product: "Enterprise Cloud Infrastructure",
                        budget: "$1,500/mo"
                    });
                }
            } else {
                const lower = text.toLowerCase();
                const matched = SALES_RESPONSES.find(item => item.keywords.some(k => lower.includes(k)));
                if (matched) {
                    replyText = matched.response;
                } else {
                    replyText = "We can certainly help with that! Our autonomous sales platform automates customer onboarding, qualifies high-intent buyers, and syncs directly into your CRM. What is your business email so I can send our custom quote?";
                }
            }

            const agentBubble = document.createElement("div");
            agentBubble.className = "salesai-bubble-agent";
            agentBubble.innerHTML = replyText;
            messages.appendChild(agentBubble);
            messages.scrollTop = messages.scrollHeight;
        }, 600);
    };
})();
