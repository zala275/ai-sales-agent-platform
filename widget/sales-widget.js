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
    const chatHistory = [];
    let userSubmittedDetails = false;

    // Comprehensive Knowledge Base for Autonomous E-Commerce Sales & Shopping Dialogue
    const SALES_RESPONSES = [
        {
            keywords: ["product", "products", "item", "items", "catalog", "collection", "stock", "sell", "buy", "store", "what do you have", "what are your products", "what is your product", "all products", "list", "show me"],
            response: "We specialize in premium lifestyle electronics and apparel: 1) Apex Pro Wireless ANC Headphones (₹14,999), 2) Apex Ultra Smartwatch 2 (₹19,999), 3) Apex Studio Soundbar 7.1 (₹24,999), 4) Apex GaN III 100W Fast Charger (₹3,499), and 5) Premium Organic Cotton T-Shirts (₹1,299). Which one can I tell you more about?",
            intent: "products_catalog"
        },
        {
            keywords: ["headphone", "headphones", "earphone", "earphones", "earbud", "earbuds", "audio", "anc", "noise cancel", "noise cancelling", "sound quality", "bass", "mic", "calling", "music", "over ear", "apex pro"],
            response: "Our Apex Pro Wireless Headphones (₹14,999 / Offer: ₹12,749 with WELCOME15) feature 40dB Active Noise Cancellation (ANC), 40-hour battery life (60h standard), Bluetooth 5.3, and custom 40mm graphene drivers for studio-grade audio. In stock in Matte Black and Pearl Silver with a 2-Year Warranty!",
            intent: "catalog_headphones"
        },
        {
            keywords: ["watch", "smartwatch", "wearable", "apex ultra", "smart watch", "fitness tracker", "gps", "heart rate", "ecg", "step", "sleep tracker"],
            response: "The Apex Ultra Smartwatch 2 (₹19,999 / Offer: ₹16,999 with WELCOME15) is crafted with an aerospace titanium case, sapphire crystal AMOLED display, and 100m (10 ATM) water resistance. Features dual-frequency GPS, health sensors (ECG, SpO2, heart rate), and up to 14 days of battery life!",
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
            response: "The Apex Studio Soundbar 7.1 (₹24,999 / Offer: ₹21,249 with WELCOME15) packs 500W peak power, upward-firing Dolby Atmos speakers, a wireless 8-inch auto-pairing subwoofer, and HDMI eARC connectivity for theater-grade surround sound at home!",
            intent: "catalog_soundbar"
        },
        {
            keywords: ["charger", "adapter", "gan", "100w", "fast charger", "fast charge", "wall plug", "usb c", "power delivery", "pd 3.0", "cable"],
            response: "The Apex GaN III Fast Charger 100W (₹3,499 / Offer: ₹2,974 with WELCOME15) utilizes advanced gallium nitride semiconductors. It has 3x USB-C and 1x USB-A ports to rapidly charge MacBooks, laptops, iPhones, and Android phones simultaneously with built-in thermal surge protection!",
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
            response: "Great gifts depend on their lifestyle: For music lovers, our Apex Pro ANC Headphones (₹14,999) are an absolute crowd-pleaser; for fitness enthusiasts, the Apex Ultra Smartwatch (₹19,999) is top-tier; and our 100% Organic Cotton Tees (₹1,299) make an easy everyday favorite!",
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
        .salesai-mic-btn {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            width: 38px;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }
        .salesai-mic-btn:hover {
            background: #e2e8f0;
            color: #1e293b;
        }
        .salesai-mic-btn.listening {
            background: #ef4444;
            color: #ffffff;
            border-color: #dc2626;
            animation: pulse-mic 1.2s infinite;
        }
        @keyframes pulse-mic {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
            50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
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
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #2563eb, #6366f1); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(37,99,235,0.35); flex-shrink: 0;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="8" width="18" height="12" rx="4"/>
                            <path d="M12 2v6"/>
                            <circle cx="8.5" cy="13" r="1.5" fill="#ffffff"/>
                            <circle cx="15.5" cy="13" r="1.5" fill="#ffffff"/>
                            <path d="M9.5 17h5"/>
                        </svg>
                    </div>
                    <div>
                        <div style="font-weight: bold; font-size: 14px; letter-spacing: -0.2px;">Alex · AI Sales Specialist</div>
                        <div style="font-size: 11px; opacity: 0.85; display: flex; align-items: center; gap: 5px;">
                            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981;"></span>
                            Online &amp; Ready to Assist
                        </div>
                    </div>
                </div>
                <button id="salesai-close-btn" style="background: none; border: none; color: #ffffff; font-size: 20px; cursor: pointer; opacity: 0.8; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.8">&times;</button>
            </div>

            <div class="salesai-msg-list" id="salesai-messages">
                <div class="salesai-bubble-agent">
                    👋 Welcome to our store! I'm Alex, your AI Sales &amp; Shopping Specialist. Ask me anything about our products, sizing, express delivery, or 30-day return policy. How can I help you today?
                </div>
            </div>

            <form class="salesai-input-area" id="salesai-form">
                <input type="text" id="salesai-input" placeholder="Ask about products, sizes, shipping..." autocomplete="off"/>
                <button type="button" id="salesai-mic-btn" class="salesai-mic-btn" title="Speak question (Voice Input)" aria-label="Voice Input">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                </button>
                <button type="submit" class="salesai-send-btn">Send</button>
            </form>
        </div>

        <button id="salesai-launcher-btn" aria-label="Open Sales Chat">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="8" width="18" height="12" rx="4"/>
                <path d="M12 2v6"/>
                <circle cx="8.5" cy="13" r="1.5" fill="#ffffff"/>
                <circle cx="15.5" cy="13" r="1.5" fill="#ffffff"/>
                <path d="M9.5 17h5"/>
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

    // Voice Input Handler (Speech-to-Text via Web Speech API)
    const micBtn = document.getElementById("salesai-mic-btn");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (micBtn) {
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = navigator.language || "en-US";

            let isListening = false;

            micBtn.onclick = () => {
                if (isListening) {
                    recognition.stop();
                    return;
                }
                try {
                    recognition.start();
                    isListening = true;
                    micBtn.classList.add("listening");
                    input.placeholder = "Listening... Speak your question now!";
                } catch (recErr) {
                    console.warn("Speech recognition start failed:", recErr);
                }
            };

            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                input.value = speechResult;
                input.focus();
                setTimeout(() => {
                    form.dispatchEvent(new Event("submit"));
                }, 300);
            };

            recognition.onerror = (event) => {
                console.log("Speech recognition error:", event.error);
                isListening = false;
                micBtn.classList.remove("listening");
                input.placeholder = "Ask about products, sizes, shipping...";
            };

            recognition.onend = () => {
                isListening = false;
                micBtn.classList.remove("listening");
                input.placeholder = "Ask about products, sizes, shipping...";
            };
        } else {
            micBtn.onclick = () => {
                alert("Voice input is supported in Google Chrome, Microsoft Edge, and Safari.");
            };
        }
    }

    // Dynamic Knowledge Cache from Platform API and Uploaded Catalogs
    let dynamicStoreKnowledge = [...SALES_RESPONSES];
    let uploadedCatalogContent = "";

    // 1. Read locally cached/uploaded catalog from browser localStorage
    try {
        const localCat = localStorage.getItem("salesai_uploaded_catalog");
        if (localCat) {
            const parsed = JSON.parse(localCat);
            if (parsed && parsed.content) {
                uploadedCatalogContent = parsed.content;
                console.log("[SalesAI] Loaded uploaded catalog:", parsed.filename);
            }
        }
    } catch (e) {}

    // 2. Fetch latest uploaded knowledge from server
    const knowledgeEndpoint = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
        ? "/api/knowledge" 
        : "https://ai-sales-agent-platform.onrender.com/api/knowledge";

    fetch(knowledgeEndpoint)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.items && data.items.length) {
                const catalogItems = [];
                data.items.forEach(newItem => {
                    dynamicStoreKnowledge.unshift({
                        keywords: newItem.keywords || [],
                        response: newItem.answer || newItem.content,
                        intent: newItem.title || "uploaded_knowledge"
                    });
                    if (newItem.answer || newItem.content) {
                        catalogItems.push(`${newItem.title || 'Product'}: ${newItem.answer || newItem.content}`);
                    }
                });
                if (catalogItems.length) {
                    uploadedCatalogContent = catalogItems.join("\n\n");
                }
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

        // Record to multi-turn conversation history
        chatHistory.push({ role: "user", parts: [{ text: text }] });

        // Check for Lead Submission (Email / Phone / Age)
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const phoneMatch = text.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
        const ageMatch = text.match(/\b(?:age\s*(?:is|:)?\s*(\d{1,2})|(\d{1,2})\s*(?:years?\s*old|yo))\b/i) || text.match(/\b(?:i am|i'm)\s*(\d{1,2})\b/i);

        const capturedEmail = emailMatch ? emailMatch[0] : "";
        const capturedPhone = phoneMatch ? phoneMatch[0] : "";
        const capturedAge = ageMatch ? (ageMatch[1] || ageMatch[2]) : "";

        if (capturedEmail || capturedPhone || capturedAge) {
            if (capturedEmail) userSubmittedDetails = true;
            if (window.AppState && typeof window.AppState.captureLead === "function") {
                window.AppState.captureLead({
                    name: "Shopify Visitor (" + (capturedEmail ? capturedEmail.split("@")[0] : "Customer") + ")",
                    email: capturedEmail || "shopper@store.com",
                    phone: capturedPhone || "+1 (555) 019-2831",
                    company: capturedAge ? `Customer (Age: ${capturedAge})` : "Shopify Store Lead",
                    product: "Storefront Product Order",
                    budget: "Retail / E-Commerce"
                });
            }
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

        // 1. Live Google Gemini Generative AI (Answers Anything & Closes Sales)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const catalogPrompt = uploadedCatalogContent 
                ? `UPLOADED STORE CATALOG & PRODUCT DETAILS (STRICTLY GROUND YOUR PRODUCT ANSWERS IN THIS CATALOG):\n${uploadedCatalogContent.slice(0, 15000)}`
                : `Store Catalog (All Prices in Indian Rupees - ₹ INR):
- Apex Pro Wireless Headphones (₹14,999, 40dB ANC, 40h battery, Bluetooth 5.3, Matte Black and Pearl Silver)
- Apex Ultra Smartwatch 2 (₹19,999, 100m water resistant, 14-day battery, titanium)
- Apex Studio Soundbar 7.1 (₹24,999, 500W Dolby Atmos)
- Apex GaN III 100W Fast Charger (₹3,499)
- Organic cotton t-shirts (₹1,299, pre-shrunk, XS-XXL, 100% organic cotton, machine washable cold)`;

            const systemContext = `You are Alex, an expert AI shopping specialist and sales closer for the store. 
${catalogPrompt}

Store Policies: 2-4 days express shipping across India, 30-day hassle-free returns with free pickup, 2-year warranty, 15% discount for new shoppers with coupon WELCOME15. All prices are in Indian Rupees (₹ / INR). Cash on delivery (COD) and UPI supported nationwide.

MULTILINGUAL INTELLIGENCE (AUTO-DETECT):
- Automatically detect the customer's language (Spanish, Hindi, French, German, Japanese, Gujarati, Arabic, etc.).
- ALWAYS respond in the EXACT SAME LANGUAGE the user writes or speaks, translating all product details, prices, and closing prompts naturally and fluently into their native language!

CRITICAL SALES CONVERSATION RULES:
1. PRODUCT INQUIRIES & RECOMMENDATIONS (NO DETAILS REQUESTED): Answer conversationally, concisely (2-3 sentences max), helpfully, and enthusiastically using the store catalog in the customer's language. Focus purely on answering their questions, explaining features, specs, sizes, and pricing. You may mention the 15% discount code WELCOME15 if relevant, but STRICTLY DO NOT ask for their email address, age, or personal contact details during general browsing or product questions!
2. BUY / PURCHASE CONFIRMATION (ONLY ASK DETAILS HERE AT THE VERY END): ONLY ask for their email address and age AFTER the customer explicitly confirms they want to buy, says "I want to buy", "I'll take it", "how do I buy", "order this", "checkout", or agrees to purchase a product. At that moment, celebrate their purchase decision and ask for their details (Email address and Age) translated into their language:
   Example: "Awesome choice! To lock in your 15% discount (WELCOME15) and prepare your checkout confirmation link, could you please share your email address and your age?"
3. AFTER DETAILS PROVIDED: When the customer shares their email and age, thank them warmly, confirm that their details and 15% WELCOME15 discount are locked in, and invite them to proceed with payment or checkout!
4. Unrelated topics: Answer pleasantly and relate back to store shopping.`;

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
                                contents: chatHistory.slice(-10)
                            }),
                            signal: controller.signal
                        });

                        if (res.ok) {
                            const gData = await res.json();
                            if (gData.candidates && gData.candidates[0] && gData.candidates[0].content && gData.candidates[0].content.parts[0]) {
                                const rawReply = gData.candidates[0].content.parts[0].text.trim();
                                chatHistory.push({ role: "model", parts: [{ text: rawReply }] });
                                replyText = rawReply
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
                    body: JSON.stringify({ message: text, agent_id: agentKey, history: chatHistory.slice(-10) }),
                    signal: controller.signal
                });
                if (res.ok) {
                    const gData = await res.json();
                    if (gData.reply) {
                        replyText = gData.reply;
                        chatHistory.push({ role: "model", parts: [{ text: replyText }] });
                    }
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

            if (capturedEmail || capturedAge) {
                replyText = `🎉 Thank you! I have saved your details${capturedEmail ? ` (${capturedEmail})` : ""}${capturedAge ? ` [Age: ${capturedAge}]` : ""}. Your 15% discount code <strong>WELCOME15</strong> is locked in and your order has been prepared!`;
            } else if (cleanText.includes("buy") || cleanText.includes("purchase") || cleanText.includes("order") || cleanText.includes("take it")) {
                replyText = "Awesome choice! To prepare your order with your 15% discount (<strong>WELCOME15</strong>) and send your checkout confirmation link, could you please share your <strong>email address</strong> and your <strong>age</strong>?";
            } else {
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
                    replyText = "We specialize in premium lifestyle electronics and apparel: 1) Apex Pro Wireless ANC Headphones (₹14,999), 2) Apex Ultra Smartwatch 2 (₹19,999), 3) Apex Studio Soundbar 7.1 (₹24,999), 4) Apex GaN III 100W Fast Charger (₹3,499), and 5) Premium Organic Cotton T-Shirts (₹1,299). Which one can I tell you more about?";
                } else if (cleanText.includes("hello") || cleanText.includes("hi") || cleanText.includes("hey")) {
                    replyText = "Hello! Welcome to our store! 👋 I'm Alex, your AI shopping specialist. I'm here to help you find the right product, check sizing, track orders, or answer any policy questions. What can I help you find today?";
                } else {
                    replyText = "That's a great question! I'm here to assist with our electronics, organic apparel, sizing recommendations, express shipping, and 30-day returns. Could you let me know which specific product or policy you'd like more details on?";
                }
            }
        }

        const agentBubble = document.createElement("div");
        agentBubble.className = "salesai-bubble-agent";
        agentBubble.innerHTML = replyText;

        // Render interactive email & age capture card if prompt asks for details upon buy confirmation
        const lowerReply = replyText.toLowerCase();
        if (lowerReply.includes("email") && (lowerReply.includes("age") || lowerReply.includes("checkout") || lowerReply.includes("order")) && !userSubmittedDetails && !capturedEmail) {
            const card = document.createElement("div");
            card.style.marginTop = "12px";
            card.style.padding = "12px";
            card.style.background = "#ffffff";
            card.style.border = "1px solid #cbd5e1";
            card.style.borderRadius = "10px";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.gap = "8px";
            card.style.boxShadow = "0 3px 10px rgba(0,0,0,0.06)";
            card.innerHTML = `
                <div style="font-size:11px;font-weight:700;color:#1e293b;text-transform:uppercase;letter-spacing:0.5px;display:flex;align-items:center;gap:5px;">
                    <span>🏷️</span> Apply 15% Off (WELCOME15) &amp; Order
                </div>
                <input type="email" class="salesai-inline-email" placeholder="Your Email Address" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;outline:none;" />
                <input type="number" class="salesai-inline-age" placeholder="Your Age (e.g. 25)" style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;outline:none;" />
                <button type="button" class="salesai-inline-submit" style="background:#2563eb;color:#ffffff;border:none;padding:9px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;transition:background 0.2s;">
                    Lock In 15% Off &amp; Get Checkout Link →
                </button>
            `;
            const submitBtn = card.querySelector(".salesai-inline-submit");
            const emailInp = card.querySelector(".salesai-inline-email");
            const ageInp = card.querySelector(".salesai-inline-age");

            submitBtn.onclick = () => {
                const em = emailInp.value.trim();
                const ag = ageInp.value.trim();
                if (!em || !em.includes("@")) {
                    emailInp.style.borderColor = "#ef4444";
                    emailInp.focus();
                    return;
                }
                userSubmittedDetails = true;
                input.value = `My email is ${em}${ag ? ` and my age is ${ag}` : ""}`;
                form.dispatchEvent(new Event("submit"));
                card.remove();
            };
            agentBubble.appendChild(card);
        }

        messages.appendChild(agentBubble);
        messages.scrollTop = messages.scrollHeight;
    };
})();
