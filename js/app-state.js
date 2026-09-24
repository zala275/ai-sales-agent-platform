/**
 * AI Sales Agent SaaS Platform - Core State & Navigation Controller
 * Handles persistent state, payment simulation, lead capture, and unified sidebar
 */

const AppState = (() => {
    // Initial Seed Data for the Showcase Demo
    const DEFAULT_DATA = {
        user: {
            name: "Ghanshyam Zala",
            email: "admin@salesai.pro",
            role: "super_admin", // 'super_admin' | 'business_owner'
            plan: "Professional Tier",
            planId: "professional",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt1Yw07Q6BOMOD20XaPXSJ7PmI8KW3I2DyPqBzTNi7azfGLELOXtcC3AFL2awka53srthWQbXp9DVbcWycGGbYMyn1zGjX0SR8IAhBm_WQD1hMtbcNVG6h0wTB5Exk8YszqHNHzNbD6ULjQhIPCyg7gARJBaqbSv-BC9jL6Dr7dRepB1QVAUyu_WggL-WX5jpyrQtAd2qc9vyfl5Ee2Kk3E2WrY6_S7PUJ4sMO7_JlBLUY0QyqOalFeA",
            company: "SalesAI Global",
            mrr: 18450
        },
        leads: [
            {
                id: "LD-8942",
                name: "David Miller",
                email: "david.m@acmecorp.com",
                phone: "+1 (555) 234-8901",
                company: "Acme Corp",
                product: "Enterprise Multi-Agent",
                budget: "$1,500/mo",
                score: "94% Hot",
                status: "hot",
                synced: true,
                time: "12 mins ago"
            },
            {
                id: "LD-8941",
                name: "Priya Patel",
                email: "priya@techventures.io",
                phone: "+91 98200 44122",
                company: "TechVentures",
                product: "Professional 5-Agent Suite",
                budget: "$500/mo",
                score: "88% Hot",
                status: "hot",
                synced: true,
                time: "45 mins ago"
            },
            {
                id: "LD-8940",
                name: "Marcus Sterling",
                email: "m.sterling@globalnet.org",
                phone: "+44 20 7946 0912",
                company: "GlobalNet Systems",
                product: "Custom API & White-label",
                budget: "$3,000/mo",
                score: "72% Warm",
                status: "warm",
                synced: false,
                time: "2 hours ago"
            },
            {
                id: "LD-8939",
                name: "Elena Rostova",
                email: "elena@novasoft.eu",
                phone: "+49 30 1234567",
                company: "NovaSoft Berlin",
                product: "Lead Gen Widget",
                budget: "$250/mo",
                score: "65% Warm",
                status: "warm",
                synced: true,
                time: "5 hours ago"
            },
            {
                id: "LD-8938",
                name: "Kevin Zhou",
                email: "kevin.zhou@nexustrade.cn",
                phone: "+86 21 6234 5678",
                company: "Nexus Trade",
                product: "Evaluation Trial",
                budget: "Undisclosed",
                score: "41% Cold",
                status: "cold",
                synced: false,
                time: "Yesterday"
            }
        ],
        transactions: [
            { id: "TX-9901", plan: "Professional Tier", amount: 79, date: "Today, 10:14 AM", status: "Paid", card: "Visa •••• 4242" },
            { id: "TX-9900", plan: "Enterprise Tier", amount: 199, date: "Yesterday", status: "Paid", card: "Mastercard •••• 8821" },
            { id: "TX-9899", plan: "Starter Tier", amount: 29, date: "Sep 22, 2026", status: "Paid", card: "Amex •••• 1009" }
        ],
        stats: {
            totalUsers: 2540,
            activeSubscriptions: 1824,
            activeAgents: 486,
            leadsCapturedMonth: 12450
        }
    };

    // Load or initialize storage
    const loadState = () => {
        try {
            const saved = localStorage.getItem("sales_ai_saas_state");
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn("Storage fallback to defaults", e);
        }
        localStorage.setItem("sales_ai_saas_state", JSON.stringify(DEFAULT_DATA));
        return DEFAULT_DATA;
    };

    let state = loadState();

    const saveState = () => {
        localStorage.setItem("sales_ai_saas_state", JSON.stringify(state));
        window.dispatchEvent(new CustomEvent("salesai:state-updated", { detail: state }));
    };

    // Toast Notification System
    const showToast = (title, message = "", type = "success") => {
        let toastContainer = document.getElementById("toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toast-container";
            toastContainer.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none";
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md text-sm transition-all duration-300 transform translate-y-4 opacity-0 ${
            type === "success" 
                ? "bg-[#131b2e]/95 text-white border-secondary-fixed/40" 
                : "bg-red-900/90 text-white border-red-500/40"
        }`;

        const icon = type === "success" ? "check_circle" : "error";
        toast.innerHTML = `
            <span class="material-symbols-outlined text-secondary-fixed text-lg">${icon}</span>
            <div>
                <strong class="font-semibold block">${title}</strong>
                ${message ? `<p class="text-xs text-white/70">${message}</p>` : ""}
            </div>
            <button onclick="this.parentElement.remove()" class="ml-2 text-white/50 hover:text-white">&times;</button>
        `;

        toastContainer.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove("translate-y-4", "opacity-0");
        });

        setTimeout(() => {
            toast.classList.add("translate-y-4", "opacity-0");
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // Showcase Payment Simulator
    const openPaymentSimulator = (planId = "professional", planName = "Professional Tier", amount = 79) => {
        let modal = document.getElementById("payment-simulator-modal");
        if (modal) modal.remove();

        modal = document.createElement("div");
        modal.id = "payment-simulator-modal";
        modal.className = "fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in";
        modal.innerHTML = `
            <div class="bg-surface-container-lowest dark:bg-[#131b2e] border border-outline-variant/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-on-surface">
                <!-- Header -->
                <div class="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-primary-container text-white">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary-fixed">credit_card</span>
                        <h3 class="font-bold text-lg">Simulated Checkout</h3>
                    </div>
                    <button onclick="document.getElementById('payment-simulator-modal').remove()" class="text-white/60 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <!-- Body -->
                <div class="p-6 space-y-4">
                    <div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <div>
                            <span class="text-xs uppercase tracking-wider text-outline font-semibold">Selected Plan</span>
                            <h4 class="font-bold text-base text-on-surface" id="modal-plan-name">${planName}</h4>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-outline">Billed Monthly</span>
                            <div class="font-extrabold text-xl text-secondary-container" id="modal-plan-price">$${amount}.00</div>
                        </div>
                    </div>

                    <div class="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex gap-2.5 items-start">
                        <span class="material-symbols-outlined text-base text-blue-600 mt-0.5">verified_user</span>
                        <div>
                            <strong>Demo Mode Active:</strong> No real card will be charged. This demonstrates the full payment flow, receipt generation, and live account tier upgrade for your showcase.
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs font-semibold text-outline mb-1">Card Number</label>
                            <div class="relative">
                                <input type="text" value="4242 •••• •••• 4242" readonly class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-sm font-mono text-on-surface" />
                                <span class="material-symbols-outlined absolute right-3 top-2.5 text-outline text-base">lock</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-outline mb-1">Expiry</label>
                                <input type="text" value="12 / 28" readonly class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-sm font-mono text-on-surface" />
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-outline mb-1">CVC</label>
                                <input type="text" value="888" readonly class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-sm font-mono text-on-surface" />
                            </div>
                        </div>
                    </div>

                    <button id="btn-confirm-simulated-payment" class="w-full py-3 px-4 bg-secondary-container hover:bg-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-4">
                        <span>Confirm & Complete Payment ($${amount}.00)</span>
                        <span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("btn-confirm-simulated-payment").onclick = () => {
            const btn = document.getElementById("btn-confirm-simulated-payment");
            btn.innerHTML = `<span class="inline-block animate-spin mr-2">⚙</span> Authorizing with Bank...`;
            btn.disabled = true;

            setTimeout(() => {
                // Update State
                state.user.plan = planName;
                state.user.planId = planId;
                state.user.mrr += amount;
                state.transactions.unshift({
                    id: "TX-" + Math.floor(1000 + Math.random() * 9000),
                    plan: planName,
                    amount: amount,
                    date: "Just now",
                    status: "Paid",
                    card: "Visa •••• 4242"
                });
                state.stats.activeSubscriptions += 1;
                saveState();

                modal.remove();
                showToast("🎉 Payment Successful!", `Account upgraded to ${planName}. MRR updated.`);

                // Update UI elements in DOM if present
                const planBadges = document.querySelectorAll(".current-plan-badge");
                planBadges.forEach(b => b.textContent = planName);

                const mrrDisplays = document.querySelectorAll(".mrr-display");
                mrrDisplays.forEach(d => d.textContent = `$${state.user.mrr.toLocaleString()}`);
            }, 1200);
        };
    };

    // Lead Capture Function (called from Visitor Widget or Demo)
    const captureLead = (leadData) => {
        const newLead = {
            id: "LD-" + Math.floor(8900 + Math.random() * 1000),
            name: leadData.name || "Anonymous Visitor",
            email: leadData.email || "visitor@example.com",
            phone: leadData.phone || "+1 (555) 019-2831",
            company: leadData.company || "Prospective Client",
            product: leadData.product || "AI Sales Agent Suite",
            budget: leadData.budget || "$500 - $1,500/mo",
            score: "96% Hot",
            status: "hot",
            synced: true,
            time: "Just now"
        };

        state.leads.unshift(newLead);
        state.stats.leadsCapturedMonth += 1;
        saveState();

        showToast("🔥 New Lead Captured!", `${newLead.name} (${newLead.company}) submitted contact details.`);
        return newLead;
    };

    // Master Sidebar Navigation Builder
    const renderSidebar = (activePage) => {
        const navContainer = document.getElementById("main-sidebar-container");
        if (!navContainer) return;

        const navSections = [
            {
                heading: "Core Platform",
                links: [
                    { id: "dashboard", href: "index.html", label: "Dashboard", icon: "dashboard", badge: "" },
                    { id: "onboarding", href: "onboarding.html", label: "Customer Onboarding", icon: "rocket_launch", badge: "New" },
                    { id: "analytics", href: "analytics.html", label: "Analytics & Funnels", icon: "analytics", badge: "" }
                ]
            },
            {
                heading: "AI Engine & RAG",
                links: [
                    { id: "agents", href: "agents.html", label: "AI Agents Studio", icon: "smart_toy", badge: "Live" },
                    { id: "cognitive", href: "cognitive.html", label: "Cognitive Intelligence", icon: "psychology", badge: "AI Core" },
                    { id: "knowledge", href: "knowledge-base.html", label: "Knowledge Base", icon: "menu_book", badge: "RAG" },
                    { id: "knowledge-audit", href: "knowledge-audit.html", label: "Knowledge Audit", icon: "fact_check", badge: "Semantic" },
                    { id: "ab-testing", href: "ab-testing.html", label: "A/B Testing Lab", icon: "science", badge: "" }
                ]
            },
            {
                heading: "Sales & Pipeline",
                links: [
                    { id: "leads", href: "leads.html", label: "Leads Pipeline", icon: "person_search", badge: state.leads.length },
                    { id: "transcripts", href: "lead-detail.html", label: "Deep Transcripts", icon: "chat_bubble", badge: "" },
                    { id: "integrations", href: "integrations.html", label: "CRM Data Sync", icon: "sync_alt", badge: "" },
                    { id: "deployment", href: "deployment.html", label: "JS Deployment", icon: "code", badge: "Snippet" }
                ]
            },
            {
                heading: "System & Billing",
                links: [
                    { id: "billing", href: "billing.html", label: "Billing & Plans", icon: "payments", badge: "Showcase" },
                    { id: "team", href: "team.html", label: "Team & Permissions", icon: "group", badge: "" },
                    { id: "settings", href: "settings.html", label: "Settings & API", icon: "settings", badge: "" },
                    { id: "notifications", href: "notifications.html", label: "Notifications", icon: "notifications", badge: "3" },
                    { id: "support", href: "support.html", label: "Support Portal", icon: "help_center", badge: "" }
                ]
            },
            {
                heading: "Live Interactive Demos",
                links: [
                    { id: "visitor-demo", href: "visitor-demo.html", label: "💬 Test Live Widget", icon: "play_circle", badge: "Live Demo", highlight: true },
                    { id: "mobile-view", href: "mobile-view.html", label: "📱 Mobile App View", icon: "stay_current_portrait", badge: "" }
                ]
            }
        ];

        let menuHtml = "";
        navSections.forEach(section => {
            menuHtml += `
                <div class="pt-3 pb-1">
                    <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                        ${section.heading}
                    </div>
                    <ul class="space-y-0.5">
            `;

            section.links.forEach(item => {
                const isActive = item.id === activePage;
                const activeClasses = isActive
                    ? "bg-blue-600/20 text-blue-300 border-l-4 border-blue-500 font-semibold"
                    : item.highlight
                        ? "bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 border-l-4 border-blue-400 font-medium"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60 font-normal";

                menuHtml += `
                    <li>
                        <a href="${item.href}" class="flex items-center justify-between px-3.5 py-2 rounded-r-lg transition-colors text-[13px] group ${activeClasses}">
                            <div class="flex items-center gap-2.5 truncate">
                                <span class="material-symbols-outlined text-[19px] transition-transform group-hover:scale-105">${item.icon}</span>
                                <span class="truncate font-medium">${item.label}</span>
                            </div>
                            ${item.badge ? `<span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}">${item.badge}</span>` : ""}
                        </a>
                    </li>
                `;
            });

            menuHtml += `
                    </ul>
                </div>
            `;
        });

        navContainer.innerHTML = `
            <aside class="w-[280px] bg-[#0b1120] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 shadow-xl z-50">
                <!-- Brand -->
                <div class="p-5 border-b border-slate-800/80 flex items-center justify-between">
                    <a href="index.html" class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                            ✦
                        </div>
                        <div>
                            <h1 class="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                                SalesAI <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono uppercase">Pro</span>
                            </h1>
                            <p class="text-[11px] text-slate-400 font-medium current-plan-badge">${state.user.plan}</p>
                        </div>
                    </a>
                </div>

                <!-- Nav Menu -->
                <div class="flex-1 overflow-y-auto py-2 px-2 space-y-1 custom-scrollbar">
                    ${menuHtml}
                </div>

                <!-- Showcase Upgrade Callout -->
                <div class="p-3 mx-3 my-2 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/20">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] font-bold text-blue-300">Showcase Simulator</span>
                        <span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">Ready</span>
                    </div>
                    <p class="text-[11px] text-slate-300 mb-2">Test 1-click plan upgrade & real-time revenue trigger.</p>
                    <button onclick="AppState.openPaymentSimulator('enterprise', 'Enterprise Tier', 199)" class="w-full py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow">
                        ⚡ Simulate Upgrade ($199)
                    </button>
                </div>

                <!-- User Footer -->
                <div class="p-4 border-t border-slate-800/80 flex items-center justify-between bg-black/30">
                    <div class="flex items-center gap-2.5 truncate">
                        <img src="${state.user.avatar}" class="w-8 h-8 rounded-full object-cover border border-slate-700" alt="Avatar" />
                        <div class="truncate">
                            <p class="text-xs font-semibold text-white truncate">${state.user.name}</p>
                            <p class="text-[10px] text-slate-400 truncate">${state.user.email}</p>
                        </div>
                    </div>
                    <a href="settings.html" class="text-slate-400 hover:text-white p-1" title="Settings">
                        <span class="material-symbols-outlined text-[18px]">tune</span>
                    </a>
                </div>
            </aside>
        `;
    };

    // Auto-inject Crystal Clarity High-Contrast Stylesheet across all pages
    const injectClarityStyles = () => {
        if (document.getElementById("salesai-clarity-enhancer")) return;
        const style = document.createElement("style");
        style.id = "salesai-clarity-enhancer";
        style.textContent = `
            /* 1. Global Font Smoothing & Anti-Aliasing */
            *, *::before, *::after {
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                text-rendering: optimizeLegibility !important;
            }

            /* 2. Eliminate Blurry Backdrop Filters on Cards & Surfaces */
            .glass-card, [class*="glass-card"] {
                background-color: #ffffff !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                border: 1px solid #e2e8f0 !important;
                box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05) !important;
            }

            /* 3. Solid, Sharp Navigation Header (No Blurry Glassmorphism) */
            header {
                background-color: #ffffff !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                border-bottom: 1px solid #e2e8f0 !important;
            }

            /* 4. High-Contrast Typography */
            h1, h2, h3, h4, h5, h6, .text-on-surface {
                color: #0f172a !important;
            }

            p, .text-on-surface-variant {
                color: #334155 !important;
            }

            .text-outline {
                color: #64748b !important;
                font-weight: 500 !important;
            }

            /* 5. Crisp Inputs & Tables */
            input, select, textarea {
                color: #0f172a !important;
                font-weight: 500 !important;
            }

            table th {
                color: #475569 !important;
                font-weight: 600 !important;
            }

            table td {
                color: #0f172a !important;
            }
        `;
        document.head.appendChild(style);
    };

    return {
        getState: () => state,
        saveState,
        showToast,
        openPaymentSimulator,
        captureLead,
        renderSidebar,
        injectClarityStyles
    };
})();

// Auto-initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    AppState.injectClarityStyles();
    const pageId = document.body.getAttribute("data-page") || "dashboard";
    AppState.renderSidebar(pageId);
});
