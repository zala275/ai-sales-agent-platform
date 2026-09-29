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

    // Knowledge & Responses for Autonomous Sales Dialogue (E-Commerce & Product Specialist)
    const SALES_RESPONSES = [
        {
            keywords: ["product", "item", "catalog", "collection", "stock", "sell", "buy", "store", "what do you have", "show"],
            response: "We have our latest featured collection available right here in our store! You can browse our products on the homepage, check sizes and colors, and place your order securely. Are you looking for a specific item, size, or style today?",
            intent: "product_discovery"
        },
        {
            keywords: ["shirt", "t-shirt", "tshirt", "tee", "top", "clothes", "clothing", "apparel", "wear", "fabric", "material", "cotton"],
            response: "Our t-shirts are crafted from 100% premium combed organic cotton (180 GSM). They are pre-shrunk, breathable, ultra-soft, and designed for lasting everyday comfort. Available in multiple colorways with reinforced double-stitched hems. Would you like size details?",
            intent: "product_specs"
        },
        {
            keywords: ["size", "fit", "measurement", "small", "medium", "large", "xl", "xxl", "xs", "chart"],
            response: "Our apparel follows standard regular fit sizing (XS, S, M, L, XL, XXL). For a standard fit, order your regular size. If you prefer a trendy oversized streetwear look, we recommend sizing up one size! Which size do you usually wear?",
            intent: "sizing"
        },
        {
            keywords: ["color", "colour", "shade", "black", "red", "green", "grey", "white"],
            response: "We have multiple fresh colors in stock, including Terracotta Coral, Forest Green, Charcoal Slate, and Classic Black. All colors use eco-friendly, fade-resistant dyes that stay vibrant wash after wash.",
            intent: "colors"
        },
        {
            keywords: ["headphone", "audio", "earphone", "anc", "music"],
            response: "Our Apex Pro Wireless Headphones feature 40dB Active Noise Cancellation (ANC), 40-hour battery life (60h standard), Bluetooth 5.3, and lossless audio drivers. In stock in Matte Black and Pearl Silver with a 2-Year Warranty!",
            intent: "catalog_electronics"
        },
        {
            keywords: ["watch", "smartwatch", "swim", "waterproof", "gps"],
            response: "The Apex Ultra Smartwatch 2 features an aerospace titanium chassis, sapphire crystal AMOLED display, and 100m (10 ATM) water resistance — perfectly safe for swimming and diving! Includes ECG, heart rate, and 14-day battery life.",
            intent: "catalog_wearable"
        },
        {
            keywords: ["soundbar", "speaker", "sound", "dolby", "tv"],
            response: "The Apex Studio Soundbar features 500W peak power, Dolby Atmos 7.1 surround sound, a wireless 8-inch subwoofer, and HDMI eARC connectivity for cinematic home theater audio!",
            intent: "catalog_soundbar"
        },
        {
            keywords: ["charger", "adapter", "gan", "100w", "power delivery", "fast charge"],
            response: "The Apex GaN III Fast Charger 100W delivers 100W Power Delivery 3.0 via 3x USB-C and 1x USB-A ports. It rapidly powers MacBooks, laptops, iPhones, and Android devices simultaneously with Thermal Guard protection!",
            intent: "catalog_charger"
        },
        {
            keywords: ["shipping", "delivery", "arrive", "dispatch", "days", "time", "track", "courier", "fast"],
            response: "Standard Express Delivery takes 2 to 4 business days nationwide! Orders placed before 3:00 PM are dispatched on the same day. Tracking details are automatically sent to your email as soon as the order ships.",
            intent: "shipping_policy"
        },
        {
            keywords: ["return", "refund", "exchange", "replace", "cancel", "money back"],
            response: "We offer a 30-day risk-free return and exchange policy! If you need a different size, color, or a full refund, our return process is 100% hassle-free with complimentary pickup.",
            intent: "return_policy"
        },
        {
            keywords: ["warranty", "guarantee"],
            response: "All products come with our official 2-Year Full Hardware & Quality Replacement Warranty covering manufacturing defects and hardware anomalies with zero deductible fees.",
            intent: "warranty"
        },
        {
            keywords: ["discount", "coupon", "code", "promo", "offer", "sale", "deal", "cheap"],
            response: "Yes! We offer a special 15% discount code for new visitors. Would you like me to apply it to your order? Just type your email or phone number and I'll send it over right now!",
            intent: "discount"
        },
        {
            keywords: ["payment", "pay", "cod", "upi", "card", "visa", "mastercard"],
            response: "We accept all secure payment methods: Credit/Debit Cards, Net Banking, UPI, Apple Pay, Google Pay, and Cash on Delivery (COD) where eligible at checkout.",
            intent: "payment"
        },
        {
            keywords: ["hello", "hi", "hey", "good morning", "good evening", "namaste", "help"],
            response: "Hello! Welcome to our store! 👋 How can I help you today? Feel free to ask me anything about our products, sizing, delivery times, or return policies!",
            intent: "greeting"
        },
        {
            keywords: ["chatbot", "bot", "not a bot", "human", "who are you", "what are you", "alex"],
            response: "I am your AI Sales & Shopping Assistant! Unlike basic chatbots, I am trained directly on our store's products, inventory, and policies to help you find the perfect item and answer all questions 24/7.",
            intent: "identity"
        },
        {
            keywords: ["hubspot", "crm", "salesforce", "integrate", "integration"],
            response: "Yes! For business integrations, our platform provides 1-click bi-directional sync with HubSpot, Salesforce, Zoho, and webhooks so all customer inquiries and leads are automatically synchronized.",
            intent: "integration"
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
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 10px 18px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
            transition: all 0.18s ease;
        }
        .salesai-send-btn:hover {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
        }
        .salesai-send-btn:active {
            transform: scale(0.96);
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
                    👋 Welcome to our store! I'm Alex, your AI Sales &amp; Shopping Specialist. Ask me anything about our products, sizing, express delivery, or 30-day return policy. How can I help you today?
                </div>
            </div>

            <form class="salesai-input-area" id="salesai-form">
                <input type="text" id="salesai-input" placeholder="Ask about products, sizes, shipping..." autocomplete="off"/>
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
                const email = emailMatch ? emailMatch[0] : "shopper@store.com";
                const phone = phoneMatch ? phoneMatch[0] : "+91 9876543210";

                replyText = `🎉 Thank you! I have recorded your contact details (${email || phone}). Our store specialist will follow up with complete product information and assistance shortly!`;

                // If AppState exists in global scope (e.g. on demo page), sync lead directly to dashboard!
                if (window.AppState && typeof window.AppState.captureLead === "function") {
                    window.AppState.captureLead({
                        name: "Shopify Visitor (" + (email.includes("@") ? email.split("@")[0] : "Customer") + ")",
                        email: email,
                        phone: phone,
                        company: "Shopify Store Lead",
                        product: "Storefront Product Inquiry",
                        budget: "Retail / E-Commerce"
                    });
                }
            } else {
                const lower = text.toLowerCase();
                const matched = SALES_RESPONSES.find(item => item.keywords.some(k => lower.includes(k)));
                if (matched) {
                    replyText = matched.response;
                } else {
                    replyText = "That's a great question! I'm here to assist with all product details, sizing, delivery times, and stock availability. Could you let me know which item you're looking for, or leave your email so our store team can help you right away?";
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
