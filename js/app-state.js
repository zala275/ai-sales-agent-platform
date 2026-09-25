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
        let current = DEFAULT_DATA;
        try {
            const saved = localStorage.getItem("sales_ai_saas_state");
            if (saved) {
                const parsed = JSON.parse(saved);
                current = { ...DEFAULT_DATA, ...parsed };
                // Always guarantee Ghanshyam Zala and Professional Tier
                current.user = {
                    ...DEFAULT_DATA.user,
                    ...(parsed.user || {}),
                    name: "Ghanshyam Zala",
                    email: "admin@salesai.pro",
                    plan: (parsed.user && parsed.user.plan) ? parsed.user.plan : "Professional Tier"
                };
            }
        } catch (e) {
            console.warn("Storage fallback to defaults", e);
        }
        localStorage.setItem("sales_ai_saas_state", JSON.stringify(current));
        return current;
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
                    <div class="sidebar-section-heading text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                        ${section.heading}
                    </div>
                    <ul class="space-y-0.5">
            `;

            section.links.forEach(item => {
                const isActive = item.id === activePage;
                const activeClasses = isActive
                    ? "active-link bg-blue-600/30 text-white border-l-4 border-blue-400 font-bold"
                    : item.highlight
                        ? "bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-l-4 border-blue-400 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium";

                menuHtml += `
                    <li>
                        <a href="${item.href}" class="sidebar-nav-link flex items-center justify-between px-3.5 py-2.5 rounded-r-lg transition-colors text-[13.5px] group ${activeClasses}">
                            <div class="flex items-center gap-2.5 truncate">
                                <span class="material-symbols-outlined text-[20px] transition-transform group-hover:scale-105">${item.icon}</span>
                                <span class="truncate">${item.label}</span>
                            </div>
                            ${item.badge ? `<span class="badge text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}">${item.badge}</span>` : ""}
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
            <!-- Mobile Dark Backdrop Overlay -->
            <div id="mobile-sidebar-backdrop" onclick="AppState.toggleMobileSidebar(false)" class="fixed inset-0 bg-black/60 z-[9998] hidden transition-opacity duration-300 md:hidden backdrop-blur-sm"></div>

            <!-- Master Sidebar (Responsive: Off-canvas on mobile, fixed left on desktop) -->
            <aside id="main-sidebar" class="w-[280px] bg-[#0f172a] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-[9999] select-none transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out" style="background-color: #0f172a !important; color: #ffffff !important;">
                <!-- Brand Header (100% Guaranteed Visible, Crisp & High Contrast) -->
                <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0b1120]" style="background-color: #0b1120 !important; border-bottom: 1px solid #1e293b !important; padding: 16px !important;">
                    <a href="index.html" class="flex items-center gap-3" style="display: flex !important; align-items: center !important; gap: 12px !important; text-decoration: none !important;">
                        <div style="width: 40px !important; height: 40px !important; border-radius: 10px !important; background: linear-gradient(135deg, #2563eb, #6366f1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 800 !important; color: #ffffff !important; font-size: 18px !important; flex-shrink: 0 !important; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35) !important;">
                            ✦
                        </div>
                        <div style="min-width: 0 !important; display: block !important;">
                            <div class="sidebar-brand-name flex items-center gap-1.5 leading-none" style="display: flex !important; align-items: center !important; gap: 6px !important; line-height: 1 !important;">
                                <span style="color: #ffffff !important; font-weight: 800 !important; font-size: 17.5px !important; letter-spacing: -0.02em !important;">SalesAI</span>
                                <span class="pro-tag" style="background-color: #2563eb !important; color: #ffffff !important; font-size: 10px !important; font-weight: 800 !important; padding: 2px 6px !important; border-radius: 4px !important; text-transform: uppercase !important; font-family: monospace !important; letter-spacing: 0.05em !important;">PRO</span>
                            </div>
                            <div class="plan-badge-text current-plan-badge" style="color: #60a5fa !important; font-weight: 700 !important; font-size: 12.5px !important; margin-top: 5px !important; display: flex !important; align-items: center !important; gap: 5px !important;">
                                <span style="width: 7px !important; height: 7px !important; border-radius: 50% !important; background-color: #34d399 !important; display: inline-block !important;"></span>
                                <span style="color: #60a5fa !important; font-weight: 700 !important;">${state.user.plan || "Professional Tier"}</span>
                            </div>
                        </div>
                    </a>

                    <!-- Mobile Close Button (Hidden on Desktop) -->
                    <button onclick="AppState.toggleMobileSidebar(false)" class="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" title="Close Menu">
                        <span class="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                <!-- Nav Menu -->
                <div class="flex-1 overflow-y-auto py-2 px-2 space-y-1 custom-scrollbar">
                    ${menuHtml}
                </div>

                <!-- Showcase Upgrade Callout -->
                <div class="p-3 mx-3 my-2 rounded-xl bg-gradient-to-br from-blue-950/70 to-indigo-950/60 border border-blue-500/30">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] font-bold text-blue-300">Showcase Simulator</span>
                        <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">Ready</span>
                    </div>
                    <p class="text-[11.5px] text-slate-300 mb-2 leading-tight">Test 1-click plan upgrade & real-time revenue trigger.</p>
                    <button onclick="AppState.openPaymentSimulator('enterprise', 'Enterprise Tier', 199)" class="w-full py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow">
                        ⚡ Simulate Upgrade ($199)
                    </button>
                </div>

                <!-- User Footer (Ghanshyam Zala & Email 100% Guaranteed Crisp & Visible) -->
                <div class="sidebar-user-footer p-4 border-t border-slate-800 flex items-center justify-between bg-[#0b1120]" style="background-color: #0b1120 !important; border-top: 1px solid #1e293b !important; padding: 14px 16px !important; display: flex !important; align-items: center !important; justify-content: space-between !important;">
                    <div class="flex items-center gap-3 min-w-0" style="display: flex !important; align-items: center !important; gap: 10px !important; min-width: 0 !important; overflow: hidden !important;">
                        <img src="${state.user.avatar}" class="w-9 h-9 rounded-full object-cover border-2 border-blue-500/40 flex-shrink-0" style="width: 38px !important; height: 38px !important; border-radius: 50% !important; object-fit: cover !important; border: 2px solid #3b82f6 !important; flex-shrink: 0 !important;" alt="Avatar" />
                        <div class="min-w-0" style="min-width: 0 !important; overflow: hidden !important;">
                            <div class="sidebar-user-name" style="color: #ffffff !important; font-weight: 700 !important; font-size: 14px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; line-height: 1.25 !important;">
                                ${state.user.name || "Ghanshyam Zala"}
                            </div>
                            <div class="sidebar-user-email" style="color: #94a3b8 !important; font-weight: 500 !important; font-size: 11.5px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; margin-top: 2px !important;">
                                ${state.user.email || "admin@salesai.pro"}
                            </div>
                        </div>
                    </div>
                    <a href="settings.html" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors ml-1" style="color: #94a3b8 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 6px !important; border-radius: 6px !important;" title="Settings">
                        <span class="material-symbols-outlined text-[19px]" style="font-size: 20px !important; color: #94a3b8 !important;">tune</span>
                    </a>
                </div>
            </aside>

            <!-- Native-Feeling Mobile Bottom Navigation Bar (Screens < 768px) -->
            <nav id="mobile-bottom-nav" class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around py-2 px-1 shadow-2xl">
                <a href="index.html" class="flex flex-col items-center gap-0.5 text-[10.5px] font-semibold ${activePage === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}">
                    <span class="material-symbols-outlined text-[21px]">dashboard</span>
                    <span>Dashboard</span>
                </a>
                <a href="agents.html" class="flex flex-col items-center gap-0.5 text-[10.5px] font-semibold ${activePage === 'agents' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}">
                    <span class="material-symbols-outlined text-[21px]">smart_toy</span>
                    <span>Agents</span>
                </a>
                <a href="leads.html" class="flex flex-col items-center gap-0.5 text-[10.5px] font-semibold ${activePage === 'leads' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}">
                    <span class="material-symbols-outlined text-[21px]">person_search</span>
                    <span>Leads</span>
                </a>
                <a href="visitor-demo.html" class="flex flex-col items-center gap-0.5 text-[10.5px] font-semibold ${activePage === 'visitor-demo' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}">
                    <span class="material-symbols-outlined text-[21px]">play_circle</span>
                    <span>Live Demo</span>
                </a>
                <button onclick="AppState.toggleMobileSidebar(true)" class="flex flex-col items-center gap-0.5 text-[10.5px] font-semibold text-slate-600 hover:text-slate-900">
                    <span class="material-symbols-outlined text-[21px]">menu</span>
                    <span>All Menu</span>
                </button>
            </nav>
        `;

        // Auto-inject mobile hamburger menu button into page <header>
        setTimeout(() => {
            const header = document.querySelector("header");
            if (header && !header.querySelector("#mobile-menu-trigger")) {
                const trigger = document.createElement("button");
                trigger.id = "mobile-menu-trigger";
                trigger.className = "md:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 cursor-pointer";
                trigger.setAttribute("aria-label", "Open Navigation Menu");
                trigger.onclick = () => toggleMobileSidebar(true);
                trigger.innerHTML = `<span class="material-symbols-outlined text-[24px]">menu</span>`;
                header.insertBefore(trigger, header.firstChild);
            }
        }, 50);
    };

    // Toggle Mobile Sidebar Drawer (Off-canvas)
    const toggleMobileSidebar = (open = null) => {
        const sidebar = document.getElementById("main-sidebar");
        const backdrop = document.getElementById("mobile-sidebar-backdrop");
        if (!sidebar) return;

        const isClosed = sidebar.classList.contains("-translate-x-full");
        const shouldOpen = open !== null ? open : isClosed;

        if (shouldOpen) {
            sidebar.classList.remove("-translate-x-full");
            sidebar.classList.add("translate-x-0");
            if (backdrop) backdrop.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        } else {
            sidebar.classList.add("-translate-x-full");
            sidebar.classList.remove("translate-x-0");
            if (backdrop) backdrop.classList.add("hidden");
            document.body.style.overflow = "";
        }
    };

    // Auto-inject Crystal Clarity High-Contrast Stylesheet across all pages
    const injectClarityStyles = () => {
        let style = document.getElementById("salesai-clarity-enhancer");
        if (!style) {
            style = document.createElement("style");
            style.id = "salesai-clarity-enhancer";
            document.head.appendChild(style);
        }
        style.textContent = `
            /* 1. Global Font Smoothing & Anti-Aliasing */
            *, *::before, *::after {
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                text-rendering: optimizeLegibility !important;
            }

            /* 2. Eliminate Blurry Backdrop Filters on Cards & Surfaces */
            *, .glass-card, [class*="glass-card"] {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }

            .glass-card, [class*="glass-card"], .clean-card {
                background-color: #ffffff !important;
                border: 1px solid #cbd5e1 !important;
                box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.08) !important;
            }

            /* 3. Solid, Sharp Navigation Header (No Blurry Glassmorphism) */
            header {
                background-color: #ffffff !important;
                border-bottom: 1px solid #e2e8f0 !important;
            }

            /* 4. MAIN CONTENT TYPOGRAPHY ONLY (Never touch aside) */
            main h1, main h2, main h3, main h4, main h5, main h6 {
                color: #0f172a !important;
                font-weight: 800 !important;
                letter-spacing: -0.015em !important;
            }

            main p, main .text-on-surface-variant {
                color: #334155 !important;
                font-size: 14.5px !important;
                line-height: 1.6 !important;
            }

            main .text-xs {
                font-size: 12.5px !important;
            }

            main .text-outline {
                color: #64748b !important;
                font-weight: 500 !important;
            }

            /* 5. SIDEBAR BRAND & USER FOOTER MUST BE BRIGHT WHITE */
            aside {
                background-color: #0f172a !important;
                color: #ffffff !important;
            }

            aside .sidebar-brand-name, aside .sidebar-brand-name span {
                color: #ffffff !important;
                font-weight: 800 !important;
                font-size: 17.5px !important;
            }

            aside .sidebar-brand-name span.pro-tag {
                background-color: #2563eb !important;
                color: #ffffff !important;
                font-size: 10px !important;
                font-weight: 800 !important;
                padding: 2px 6px !important;
                border-radius: 4px !important;
            }

            aside .plan-badge-text, aside .current-plan-badge {
                color: #60a5fa !important;
                font-weight: 700 !important;
                font-size: 12.5px !important;
            }

            aside .sidebar-section-heading {
                color: #94a3b8 !important;
                font-size: 11px !important;
                font-weight: 700 !important;
            }

            aside a.sidebar-nav-link {
                color: #cbd5e1 !important;
                font-size: 13.5px !important;
                font-weight: 500 !important;
            }

            aside a.sidebar-nav-link:hover {
                color: #ffffff !important;
                background-color: rgba(255, 255, 255, 0.08) !important;
            }

            aside a.sidebar-nav-link.active-link {
                color: #ffffff !important;
                background-color: #1e3a8a !important;
                font-weight: 700 !important;
                border-left: 4px solid #3b82f6 !important;
            }

            aside .sidebar-user-name {
                color: #ffffff !important;
                font-weight: 700 !important;
                font-size: 14px !important;
            }

            aside .sidebar-user-email {
                color: #94a3b8 !important;
                font-size: 11.5px !important;
                font-weight: 500 !important;
            }

            /* 6. Crisp Inputs & Tables */
            input, select, textarea {
                color: #0f172a !important;
                font-weight: 500 !important;
                font-size: 13.5px !important;
            }

            table th {
                color: #475569 !important;
                font-weight: 700 !important;
                font-size: 12.5px !important;
            }

            table td {
                color: #0f172a !important;
                font-size: 13.5px !important;
            }
        `;
    };

    return {
        getState: () => state,
        saveState,
        showToast,
        openPaymentSimulator,
        captureLead,
        renderSidebar,
        toggleMobileSidebar,
        injectClarityStyles
    };
})();

// Auto-initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    AppState.injectClarityStyles();
    const pageId = document.body.getAttribute("data-page") || "dashboard";
    AppState.renderSidebar(pageId);
});
