/**
 * AI Sales Agent SaaS Platform - Embeddable Sales Chat Widget
 * Can be dropped onto any website via:
 * <script src="widget/sales-widget.js" data-agent-key="agt_live_9a8b7c6d"></script>
 */

(function () {
    const scriptElem = document.currentScript || document.querySelector('script[data-gemini-key]') || document.querySelector('script[src*="sales-widget"]');
    const agentKey = (scriptElem && scriptElem.getAttribute("data-agent-key")) || "agt_live_default";
    const primaryColor = (scriptElem && scriptElem.getAttribute("data-primary-color")) || "#2170e4";
    const position = (scriptElem && scriptElem.getAttribute("data-position")) || "bottom-right";
    const defaultGeminiB64 = "QVEuQWI4Uk42SzZoT0Z4WjVBc0VRUjVwUGg5T3RadkRfcUdQQ3pyWUU2Rll4dTRMb0FEOUE=";
    const geminiApiKey = (scriptElem && scriptElem.getAttribute("data-gemini-key")) || (window.GEMINI_API_KEY || (typeof atob === "function" ? atob(defaultGeminiB64) : ""));

    // Comprehensive Knowledge Base for Autonomous E-Commerce Sales & Shopping Dialogue
    const SALES_RESPONSES = [
        {
            keywords: ["product", "products", "item", "items", "catalog", "collection", "stock", "sell", "buy", "store", "what do you have", "what are your products", "what is your product", "all products", "list", "show me"],
            response: "We specialize in premium lifestyle electronics and apparel: 1) Apex Pro Wireless ANC Headphones ($199), 2) Apex Ultra Smartwatch 2 ($299), 3) Apex Studio Soundbar 7.1 ($399), 4) Apex GaN III 100W Fast Charger ($49), and 5) Premium Organic Cotton T-Shirts ($29). Which one can I tell you more about?",
            intent: "products_catalog"
        },
        {
            keywords: ["headphone", "headphones", "earphone", "earphones", "earbud", "earbuds", "audio", "anc", "noise cancel", "noise cancelling", "sound quality", "bass", "mic", "calling", "music", "over ear", "apex pro"],
            response: "Our Apex Pro Wireless Headphones ($199) feature 40dB Active Noise Cancellation (ANC), 40-hour battery life (60h standard), Bluetooth 5.3, and custom 40mm graphene drivers for studio-grade audio. In stock in Matte Black and Pearl Silver with a 2-Year Warranty!",
            intent: "catalog_headphones"
        },
        {
            keywords: ["watch", "smartwatch", "wearable", "apex ultra", "smart watch", "fitness tracker", "gps", "heart rate", "ecg", "step", "sleep tracker"],
            response: "The Apex Ultra Smartwatch 2 ($299) is crafted with an aerospace titanium case, sapphire crystal AMOLED display, and 100m (10 ATM) water resistance. Features dual-frequency GPS, health sensors (ECG, SpO2, heart rate), and up to 14 days of battery life!",
            intent: "catalog_smartwatch"
        },
        {
            keywords: ["waterproof", "water resistant", "swim", "swimming", "shower", "bath", "rain", "diving", "pool", "water", "sweat", "gym"],
            response: "Yes! The Apex Ultra Smartwatch 2 has a 100-meter (10 ATM) water-resistance rating, making it completely safe for swimming, pool workouts, rain, and showering! Our headphones also feature IPX5 sweat-resistance for intense gym sessions.",
            intent: "waterproof_swimming"
        },
        {
            keywords: ["battery", "charge", "charging", "battery life", "how long does battery last", "standby", "runtime", "hours"],
            response: "Battery life across our products: Apex Pro Headphones last 40 hours with ANC enabled (60 hours standard), the Apex Ultra Smartwatch lasts up to 14 days on a single charge, and our 100W GaN Charger fast-charges devices from 0 to 80% in just 30 minutes!",
            intent: "battery_life"
        },
        {
            keywords: ["soundbar", "sound bar", "speaker", "subwoofer", "home theater", "tv sound", "dolby", "atmos", "500w", "cinema", "living room"],
            response: "The Apex Studio Soundbar 7.1 ($399) packs 500W peak power, upward-firing Dolby Atmos speakers, a wireless 8-inch auto-pairing subwoofer, and HDMI eARC connectivity for theater-grade surround sound at home!",
            intent: "catalog_soundbar"
        },
        {
            keywords: ["charger", "adapter", "gan", "100w", "fast charger", "fast charge", "wall plug", "usb c", "power delivery", "pd 3.0", "cable"],
            response: "The Apex GaN III Fast Charger 100W ($49) utilizes advanced gallium nitride semiconductors. It has 3x USB-C and 1x USB-A ports to rapidly charge MacBooks, laptops, iPhones, and Android phones simultaneously with built-in thermal surge protection!",
            intent: "catalog_charger"
        },
        {
            keywords: ["iphone", "android", "mac", "macbook", "windows", "laptop", "pc", "compatible", "compatibility", "connect", "work with", "pair", "ipad"],
            response: "All our electronics are 100% universal! The Apex Pro Headphones and Apex Studio Soundbar connect seamlessly via Bluetooth 5.3 and aux/HDMI to iPhone, Android, Mac, and Windows. The smartwatch pairs with both iOS (Apple) and Android devices.",
            intent: "compatibility"
        },
        {
            keywords: ["shirt", "t-shirt", "tshirt", "tee", "clothes", "clothing", "apparel", "wear", "cotton", "fabric", "material", "organic cotton", "gsm", "cloth"],
            response: "Our tees are made from 100% combed organic cotton (180 GSM). They are pre-shrunk, super soft, breathable, and double-stitched for everyday durability. They stay soft and retain their shape wash after wash!",
            intent: "apparel_material"
        },
        {
            keywords: ["size", "sizes", "fit", "fitting", "small", "medium", "large", "xl", "xxl", "xs", "chart", "measure", "measurements", "tight", "loose", "oversized", "oversize"],
            response: "We offer standard regular fit sizing from XS to XXL. If you like a true-to-size standard fit, order your regular size. If you love a trendy streetwear oversized fit, we suggest ordering one size up! We also offer free size exchanges if needed.",
            intent: "sizing"
        },
        {
            keywords: ["color", "colour", "colors", "colours", "shade", "shades", "black", "red", "green", "grey", "white", "coral"],
            response: "Our products come in curated premium colorways: Headphones in Matte Black & Pearl Silver; Apparel in Terracotta Coral, Forest Green, Charcoal Slate, and Classic Black using eco-friendly, non-fading reactive dyes.",
            intent: "colors"
        },
        {
            keywords: ["wash", "washing", "shrink", "shrinking", "iron", "dry clean", "machine wash", "laundry"],
            response: "Our organic cotton t-shirts are pre-shrunk during manufacturing! For best longevity, machine wash cold (30°C) with like colors, do not bleach, and tumble dry low or hang dry to maintain perfect shape.",
            intent: "washing_care"
        },
        {
            keywords: ["shipping", "delivery", "deliver", "ship", "arrive", "dispatch", "how long", "when will it come", "courier", "fedex", "tracking", "track order", "fast delivery", "urgent"],
            response: "Standard Express Delivery takes 2 to 4 business days nationwide! Orders placed before 3:00 PM are dispatched on the same day. Full tracking details are sent immediately to your email/SMS as soon as your parcel ships.",
            intent: "shipping_delivery"
        },
        {
            keywords: ["international", "worldwide", "abroad", "foreign", "canada", "usa", "uk", "overseas", "global"],
            response: "Yes, we ship internationally! International express delivery typically takes 5 to 7 business days, and duties/taxes are calculated transparently at checkout with end-to-end package tracking.",
            intent: "international_shipping"
        },
        {
            keywords: ["return", "returns", "refund", "refunds", "exchange", "exchanges", "replace", "replacement", "cancel", "cancellation", "money back", "don't like", "wrong item", "damaged", "broken"],
            response: "We offer a 30-day risk-free return and exchange policy! If you receive the wrong size, color, or simply change your mind, our team arranges a free doorstep courier pickup and processes a 100% full refund or instant replacement within 48 hours.",
            intent: "returns_refunds"
        },
        {
            keywords: ["warranty", "guarantee", "defect", "defective", "break", "repair", "claim", "coverage"],
            response: "All our electronic products are backed by our official 2-Year Comprehensive Hardware Replacement Warranty covering manufacturing anomalies, speaker drivers, sensors, and battery health with zero deductible fees!",
            intent: "warranty"
        },
        {
            keywords: ["discount", "discounts", "coupon", "coupons", "promo", "promo code", "code", "offer", "offers", "sale", "deal", "cheap", "cheaper", "save", "best price"],
            response: "Yes! We have an exclusive 15% discount for new shoppers today! Would you like me to apply it to your order? Just type your email address or phone number and I'll send your coupon code right away!",
            intent: "discounts_offers"
        },
        {
            keywords: ["payment", "pay", "payment methods", "cod", "cash on delivery", "upi", "google pay", "apple pay", "card", "credit card", "debit card", "emi", "net banking"],
            response: "We support all secure payment gateways: Credit/Debit Cards (Visa, Mastercard, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking, Apple Pay, and Cash on Delivery (COD) at checkout!",
            intent: "payments"
        },
        {
            keywords: ["gift", "present", "birthday", "anniversary", "boyfriend", "girlfriend", "brother", "sister", "husband", "wife", "friend", "recommend", "suggestion", "best item"],
            response: "Great gifts depend on their lifestyle: For music lovers, our Apex Pro ANC Headphones ($199) are an absolute crowd-pleaser; for fitness enthusiasts, the Apex Ultra Smartwatch ($299) is top-tier; and our 100% Organic Cotton Tees ($29) make an easy everyday favorite!",
            intent: "gifts"
        },
        {
            keywords: ["human", "real person", "agent", "talk to human", "representative", "contact", "phone", "email", "support number", "call", "helpdesk"],
            response: "Our support specialists are always happy to help! You can leave your email or phone number right here and a human representative will reach out shortly, or you can contact our support team at support@apextech.com.",
            intent: "human_support"
        },
        {
            keywords: ["genuine", "authentic", "fake", "original", "trust", "scam", "safe to buy", "why buy from you", "reviews"],
            response: "All items sold in our store are 100% authentic, brand-new, and sealed in official factory packaging. Every purchase is protected by our 30-day money-back guarantee, secure SSL checkout, and our official 2-year warranty!",
            intent: "authenticity"
        },
        {
            keywords: ["hello", "hi", "hey", "good morning", "good evening", "good afternoon", "namaste", "how are you", "what's up", "yo"],
            response: "Hello! Welcome to our store! 👋 I'm Alex, your AI shopping specialist. I'm here to help you find the right product, check sizing, track orders, or answer any policy questions. What can I help you find today?",
            intent: "greetings"
        },
        {
            keywords: ["thank you", "thanks", "thx", "appreciate", "helpful", "good bot", "great", "awesome", "perfect", "cool", "ok", "okay"],
            response: "You're very welcome! 😊 Feel free to ask if you need anything else, or type your email if you'd like our 15% discount code applied to your order. Happy shopping!",
            intent: "gratitude"
        },
        {
            keywords: ["who are you", "what are you", "what do you do", "bot", "chatbot", "ai", "are you ai"],
            response: "I am your AI Shopping & Sales Specialist! I'm trained on our store's complete product specs, sizing guides, stock availability, and shipping policies to help you make the best purchase 24/7.",
            intent: "identity"
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

    // Dynamic Knowledge Cache from Platform API
    let dynamicStoreKnowledge = [...SALES_RESPONSES];

    // Fetch latest uploaded knowledge on startup
    fetch("https://ai-sales-agent-platform.onrender.com/api/knowledge")
        .then(res => res.json())
        .then(data => {
            if (data.success && data.items && data.items.length) {
                data.items.forEach(newItem => {
                    dynamicStoreKnowledge.unshift({
                        keywords: newItem.keywords || [],
                        response: newItem.answer || newItem.content,
                        intent: newItem.title || "uploaded_knowledge"
                    });
                });
            }
        })
        .catch(err => {
            console.log("SalesAI widget running in offline standalone mode.");
        });

    // Chat Message Processing & Lead Extraction
    form.onsubmit = async (e) => {
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

        if (emailMatch || phoneMatch) {
            const email = emailMatch ? emailMatch[0] : "shopper@store.com";
            const phone = phoneMatch ? phoneMatch[0] : "+91 9876543210";

            const replyText = `🎉 Thank you! I have recorded your contact details (${email || phone}). Our store specialist will follow up with complete product information and assistance shortly!`;

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

            const agentBubble = document.createElement("div");
            agentBubble.className = "salesai-bubble-agent";
            agentBubble.innerHTML = replyText;
            messages.appendChild(agentBubble);
            messages.scrollTop = messages.scrollHeight;
            return;
        }

        // Show typing indicator
        const typingBubble = document.createElement("div");
        typingBubble.className = "salesai-bubble-agent";
        typingBubble.id = "salesai-typing-indicator";
        typingBubble.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;opacity:0.8;font-size:12px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#2563eb;animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></span>
            Alex is thinking...
        </span>`;
        messages.appendChild(typingBubble);
        messages.scrollTop = messages.scrollHeight;

        let replyText = "";

        // 1. Live Google Gemini Generative AI (Answers Literally Anything Instantly)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const systemContext = "You are Alex, an expert AI shopping specialist for ApexTech store. Store Catalog: Apex Pro Wireless Headphones ($199, 40dB ANC, 40h battery, Bluetooth 5.3, Matte Black and Pearl Silver), Apex Ultra Smartwatch 2 ($299, 100m water resistant, 14-day battery, titanium), Apex Studio Soundbar 7.1 ($399, 500W Dolby Atmos), Apex GaN III 100W Fast Charger ($49), Organic cotton t-shirts ($29, pre-shrunk, XS-XXL, 100% organic cotton, machine washable cold). Policies: 2-4 days express shipping nationwide, 30-day hassle-free returns with free pickup, 2-year warranty, 15% discount for new shoppers with coupon WELCOME15. Answer any question conversationally, concisely (2-3 sentences max), helpfully, and naturally like an expert human store sales specialist. If user asks about unrelated topics, answer pleasantly and relate back to store shopping.";

            const candidateModels = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.1-flash-lite"];

            if (geminiApiKey) {
                for (const model of candidateModels) {
                    try {
                        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-goog-api-key": geminiApiKey
                            },
                            body: JSON.stringify({
                                system_instruction: { parts: [{ text: systemContext }] },
                                contents: [{ role: "user", parts: [{ text: text }] }]
                            }),
                            signal: controller.signal
                        });

                        if (res.ok) {
                            const gData = await res.json();
                            if (gData.candidates && gData.candidates[0] && gData.candidates[0].content && gData.candidates[0].content.parts[0]) {
                                replyText = gData.candidates[0].content.parts[0].text.trim()
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/\n\n/g, '<br/><br/>')
                                    .replace(/\n/g, '<br/>');
                                break;
                            }
                        }
                    } catch (mErr) {
                        if (controller.signal.aborted) break;
                    }
                }
            } else {
                const res = await fetch("https://ai-sales-agent-platform.onrender.com/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text, agent_id: agentKey }),
                    signal: controller.signal
                });
                if (res.ok) {
                    const gData = await res.json();
                    if (gData.reply) replyText = gData.reply;
                }
            }
            clearTimeout(timeoutId);
        } catch (gErr) {
            console.log("Gemini API fallback triggered:", gErr);
        }

        // Remove typing indicator
        const activeTyping = document.getElementById("salesai-typing-indicator");
        if (activeTyping) activeTyping.remove();

        // 2. Safety Fallback: Intelligent Relevance Scoring Engine (If Gemini Offline/Rate-Limited)
        if (!replyText) {
            const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
            const words = cleanText.split(/\s+/).filter(w => w.length > 1);
            let bestMatch = null;
            let highestScore = 0;

            const HIGH_WEIGHT = ["battery", "waterproof", "swimming", "swim", "soundbar", "charger", "headphone", "headphones", "smartwatch", "t-shirt", "tshirt", "sizing", "discount", "coupon", "refund", "return", "warranty", "genuine", "gift"];

            for (const item of dynamicStoreKnowledge) {
                let score = 0;
                for (const k of item.keywords) {
                    let weight = HIGH_WEIGHT.includes(k) ? 10 : 3;
                    if (k.includes(" ")) {
                        if (cleanText.includes(k)) score += (weight + 6);
                    } else {
                        if (words.includes(k)) score += weight;
                        else if (cleanText.includes(k) && k.length > 3) score += (weight / 2);
                    }
                }
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = item;
                }
            }

            if (bestMatch && highestScore >= 3) {
                replyText = bestMatch.response;
            } else if (cleanText.includes("product") || cleanText.includes("sell") || cleanText.includes("what is your product") || cleanText.includes("items")) {
                replyText = "We specialize in premium lifestyle electronics and apparel: 1) Apex Pro Wireless ANC Headphones ($199), 2) Apex Ultra Smartwatch 2 ($299), 3) Apex Studio Soundbar 7.1 ($399), 4) Apex GaN III 100W Fast Charger ($49), and 5) Premium Organic Cotton T-Shirts ($29). Which one can I tell you more about?";
            } else if (cleanText.includes("hello") || cleanText.includes("hi") || cleanText.includes("hey")) {
                replyText = "Hello! Welcome to our store! 👋 I'm Alex, your AI shopping specialist. I'm here to help you find the right product, check sizing, track orders, or answer any policy questions. What can I help you find today?";
            } else {
                replyText = "That's a great question! I'm here to assist with our electronics, organic apparel, sizing recommendations, express shipping, and 30-day returns. Could you let me know which specific product or policy you'd like more details on?";
            }
        }

        const agentBubble = document.createElement("div");
        agentBubble.className = "salesai-bubble-agent";
        agentBubble.innerHTML = replyText;
        messages.appendChild(agentBubble);
        messages.scrollTop = messages.scrollHeight;
    };
})();
