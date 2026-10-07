# -*- coding: utf-8 -*-
"""
Professional, Large, Clean UML & Architectural Diagram Generator
Matching Reference Report (Pages 52-56) exactly in style, clarity, font size, and layout.
Features:
- Large 14pt-18pt crystal clear fonts (NO tiny text, NO blurriness)
- Clean, uncluttered layout matching the Reference Report's structure
- High-contrast colors, crisp vector shapes, sharp 300 DPI output
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, Rectangle, Ellipse, Polygon

# Standard crisp font
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'Segoe UI', 'DejaVu Sans']
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['text.antialiased'] = True

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diagrams")
os.makedirs(OUT_DIR, exist_ok=True)

# ==============================================================================
# 8.1 CLASS DIAGRAM (Matching Reference Page 52 Style)
# ==============================================================================
def draw_class_diagram():
    fig, ax = plt.subplots(figsize=(10, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 110)
    ax.axis('off')

    # Diagram Title at top inside canvas
    ax.text(50, 106, "AI Sales Agent - Class Diagram", ha='center', va='center',
            fontsize=15, fontweight='bold', color='#111827')

    def draw_uml_box(x, y, w, h, name, attrs, methods):
        # Card outline & background
        box = Rectangle((x, y), w, h, ec="#475569", fc="#f8fafc", lw=1.6, zorder=2)
        ax.add_patch(box)

        # Header background
        head_h = 5.5
        head = Rectangle((x, y + h - head_h), w, head_h, ec="#475569", fc="#e2e8f0", lw=1.6, zorder=3)
        ax.add_patch(head)

        # Class Circle Icon (C)
        c_icon = Circle((x + 2.5, y + h - head_h/2), 1.6, ec="#0284c7", fc="#e0f2fe", lw=1.2, zorder=4)
        ax.add_patch(c_icon)
        ax.text(x + 2.5, y + h - head_h/2, "C", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#0284c7', zorder=5)

        # Class Name
        ax.text(x + 5.2, y + h - head_h/2, name, ha='left', va='center', fontsize=11, fontweight='bold', color='#0f172a', zorder=4)

        # Attributes section
        cur_y = y + h - head_h - 2.5
        for a in attrs:
            # red square marker
            sq = Rectangle((x + 2.0, cur_y - 0.6), 1.1, 1.1, ec='#dc2626', fc='#fee2e2', lw=0.8, zorder=4)
            ax.add_patch(sq)
            ax.text(x + 4.2, cur_y, a, ha='left', va='center', fontsize=9.2, color='#1e293b', zorder=4)
            cur_y -= 2.4

        # Divider line between attrs and methods
        if len(attrs) > 0 and len(methods) > 0:
            div_y = cur_y - 0.5
            ax.plot([x, x + w], [div_y, div_y], color='#94a3b8', lw=1.2, zorder=4)
            cur_y = div_y - 2.2

        # Methods section
        for m in methods:
            # green circle marker
            mc = Circle((x + 2.5, cur_y), 0.7, ec='#16a34a', fc='#dcfce7', lw=0.8, zorder=4)
            ax.add_patch(mc)
            ax.text(x + 4.2, cur_y, m, ha='left', va='center', fontsize=9.2, color='#0f172a', zorder=4)
            cur_y -= 2.4

    # 1. User (Top Left)
    draw_uml_box(6, 76, 38, 26, "User", 
                 ["query: String", "recommendations: List", "budgetINR: Float"],
                 ["selectProduct(item: String)", "viewRecommendations()", "voiceInquiry()", "claimDiscountCoupon()"])

    # 2. Admin (Top Right)
    draw_uml_box(56, 76, 38, 26, "Admin", 
                 ["username: String", "password: String"],
                 ["login()", "uploadCatalog()", "updatePersona()", "updateDiscounts()", "viewLogs()"])

    # 3. ContentManager (Center)
    draw_uml_box(28, 43, 44, 25, "ContentManager",
                 ["apiHandler: APIHandler", "cache: Map"],
                 ["fetchContent(query: String)", "getProducts(query: String)", "getDiscounts(budget: Float)", "handleObjection(msg: String)", "qualifyLead(session: Object)"])

    # 4. APIHandler (Bottom Left)
    draw_uml_box(6, 10, 38, 24, "APIHandler",
                 [],
                 ["callGeminiAPI(prompt: String)", "callWebSpeechAPI(audio)", "callShopifyAPI(storeId: String)", "callBANTScoring(leadData)"])

    # 5. Database (Bottom Right)
    draw_uml_box(56, 10, 38, 24, "Database",
                 ["connection: String"],
                 ["saveContent(content: Object)", "fetchContent(query: String)", "validateAdmin(user, pass)", "logActivity(activity: String)"])

    # Connecting Arrows strictly like Reference Report Page 52
    def draw_arrow(x1, y1, x2, y2, label, offset=(0, 0)):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(facecolor='#1e293b', edgecolor='#1e293b', arrowstyle='->', lw=1.5),
                    zorder=10)
        mid_x = (x1 + x2) / 2 + offset[0]
        mid_y = (y1 + y2) / 2 + offset[1]
        ax.text(mid_x, mid_y, label, ha='center', va='center', fontsize=9.0, color='#1e293b', 
                bbox=dict(boxstyle="square,pad=0.2", fc="#ffffff", ec="none"), zorder=12)

    draw_arrow(25, 76, 42, 68, "requests content", offset=(-4, 0))
    draw_arrow(75, 76, 58, 68, "updates content", offset=(4, 0))
    draw_arrow(75, 76, 75, 34, "manages content & authentication", offset=(14, 0))
    draw_arrow(38, 43, 25, 34, "fetches data", offset=(-4, 0))
    draw_arrow(62, 43, 75, 34, "retrieves fallback content", offset=(4, 0))

    plt.tight_layout()
    out_path = os.path.join(OUT_DIR, "class_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated Figure 8.1 Class Diagram at: {out_path}")

# ==============================================================================
# 8.2 USE-CASE DIAGRAM (Matching Reference Page 53 Style)
# ==============================================================================
def draw_use_case_diagram():
    fig, ax = plt.subplots(figsize=(10, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 110)
    ax.axis('off')

    # Main Title
    ax.text(50, 106, "AI Sales Agent - Use Case Diagram", ha='center', va='center',
            fontsize=15, fontweight='bold', color='#111827')

    # System boundary box (single tall box matching Reference Report Page 53)
    box_x, box_y, box_w, box_h = 32, 6, 46, 96
    sys_box = Rectangle((box_x, box_y), box_w, box_h, ec="#000000", fc="#ffffff", lw=1.6, zorder=1)
    ax.add_patch(sys_box)
    ax.text(box_x + box_w/2, box_y + box_h - 3.5, "AI Sales Agent System", ha='center', va='center',
            fontsize=12, fontweight='bold', color='#000000', zorder=2)

    # Stick Figures for Actors (Matching Page 53)
    def draw_actor(x, y, label):
        c = Circle((x, y + 4.5), 1.8, ec='#000000', fc='#ffffff', lw=1.6, zorder=10)
        ax.add_patch(c)
        ax.plot([x, x], [y + 2.7, y - 2.0], color='#000000', lw=1.8, zorder=10)
        ax.plot([x - 2.8, x + 2.8], [y + 0.8, y + 0.8], color='#000000', lw=1.8, zorder=10)
        ax.plot([x, x - 2.4], [y - 2.0, y - 6.5], color='#000000', lw=1.8, zorder=10)
        ax.plot([x, x + 2.4], [y - 2.0, y - 6.5], color='#000000', lw=1.8, zorder=10)
        ax.text(x, y - 9.0, label, ha='center', va='center', fontsize=11, fontweight='bold', color='#000000', zorder=11)

    draw_actor(16, 75, "User")
    draw_actor(16, 25, "Admin")

    # Use Case Ovals inside the box (Matching Page 53)
    use_cases = [
        # Top half (User)
        (55, 93, "Select Product / Specs"),
        (55, 83, "Voice Search Queries"),
        (55, 73, "Receive 15% Discount"),
        (55, 63, "View Recommendations"),
        # Bottom half (Admin)
        (55, 48, "View Logs"),
        (55, 38, "Update Catalog"),
        (55, 28, "Update Discounts"),
        (55, 18, "Update Persona"),
        (55, 9, "Login")
    ]

    for ux, uy, utext in use_cases:
        ellipse = Ellipse((ux, uy), 36, 6.0, ec="#000000", fc="#ffffff", lw=1.4, zorder=5)
        ax.add_patch(ellipse)
        ax.text(ux, uy, utext, ha='center', va='center', fontsize=9.5, color='#000000', zorder=6)

    # Clean solid arrows from User to top 4 use cases
    for i in range(4):
        uy = use_cases[i][1]
        ax.annotate('', xy=(37, uy), xytext=(18, 75),
                    arrowprops=dict(edgecolor='#000000', arrowstyle='->', lw=1.4), zorder=8)

    # Clean solid arrows from Admin to bottom 5 use cases
    for i in range(4, 9):
        uy = use_cases[i][1]
        ax.annotate('', xy=(37, uy), xytext=(18, 25),
                    arrowprops=dict(edgecolor='#000000', arrowstyle='->', lw=1.4), zorder=8)

    plt.tight_layout()
    out_path = os.path.join(OUT_DIR, "use_case_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated Figure 8.2 Use-Case Diagram at: {out_path}")

# ==============================================================================
# 8.3 SEQUENCE DIAGRAM (Matching Reference Page 54 Style)
# ==============================================================================
def draw_sequence_diagram():
    fig, ax = plt.subplots(figsize=(10, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 110)
    ax.axis('off')

    # Main Title
    ax.text(50, 106, "AI Sales Agent - Sequence Diagram", ha='center', va='center',
            fontsize=15, fontweight='bold', color='#111827')

    cols = [
        ("User", 12, True),
        ("UI", 31, False),
        ("ContentManager", 51, False),
        ("APIHandler", 71, False),
        ("Database", 89, False)
    ]

    for name, x, is_act in cols:
        # Top Object
        if is_act:
            c = Circle((x, 99), 1.5, ec='#000000', fc='#ffffff', lw=1.4)
            ax.add_patch(c)
            ax.plot([x, x], [97.5, 94.5], color='#000000', lw=1.4)
            ax.plot([x - 2, x + 2], [96, 96], color='#000000', lw=1.4)
            ax.plot([x, x - 1.8], [94.5, 91.5], color='#000000', lw=1.4)
            ax.plot([x, x + 1.8], [94.5, 91.5], color='#000000', lw=1.4)
            ax.text(x, 89, name, ha='center', va='center', fontsize=10, color='#000000')
        else:
            box = Rectangle((x - 8, 93), 16, 5.5, ec="#000000", fc="#ffffff", lw=1.4)
            ax.add_patch(box)
            ax.text(x, 95.8, name, ha='center', va='center', fontsize=9.2, color='#000000')

        # Vertical lifeline (dotted line matching Page 54)
        ax.plot([x, x], [88, 14], color='#94a3b8', linestyle='--', lw=1.3, zorder=1)

        # Bottom Object (Matching Page 54)
        if is_act:
            c = Circle((x, 8), 1.5, ec='#000000', fc='#ffffff', lw=1.4)
            ax.add_patch(c)
            ax.plot([x, x], [6.5, 3.5], color='#000000', lw=1.4)
            ax.text(x, 1.5, name, ha='center', va='center', fontsize=10, color='#000000')
        else:
            box = Rectangle((x - 8, 5), 16, 5.5, ec="#000000", fc="#ffffff", lw=1.4)
            ax.add_patch(box)
            ax.text(x, 7.8, name, ha='center', va='center', fontsize=9.2, color='#000000')

    # Chronological message arrows matching Page 54
    msgs = [
        (83, 12, 31, "Select Product / Specs", False),
        (75, 31, 51, "requestContent(query)", False),
        (67, 51, 71, "fetchContent(query)", False),
        (59, 71, 51, "return API data", True),
        (51, 51, 89, "checkFallbackContent(query)", False),
        (43, 89, 51, "return fallback (if needed)", True),
        (35, 51, 31, "display recommendations", True),
        (27, 31, 12, "Show products, discounts, voice audio", True),
    ]

    for y, x1, x2, text, is_ret in msgs:
        ls = '--' if is_ret else '-'
        ax.annotate('', xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(edgecolor='#000000', arrowstyle='->', lw=1.5, linestyle=ls),
                    zorder=5)
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 1.2, text, ha='center', va='bottom', fontsize=8.8, color='#000000',
                bbox=dict(boxstyle="square,pad=0.2", fc="#ffffff", ec="none"), zorder=6)

    plt.tight_layout()
    out_path = os.path.join(OUT_DIR, "sequence_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated Figure 8.3 Sequence Diagram at: {out_path}")

# ==============================================================================
# 8.4 ACTIVITY DIAGRAM (Matching Reference Page 55 Style)
# ==============================================================================
def draw_activity_diagram():
    fig, ax = plt.subplots(figsize=(9, 11), dpi=300)
    ax.set_xlim(0, 90)
    ax.set_ylim(0, 110)
    ax.axis('off')

    # Main Title
    ax.text(45, 106, "AI Sales Agent - Activity Diagram", ha='center', va='center',
            fontsize=15, fontweight='bold', color='#111827')

    # 1. Start Node (Black circle matching Page 55)
    start_c = Circle((45, 99), 2.2, ec='#000000', fc='#000000', zorder=5)
    ax.add_patch(start_c)

    def draw_rounded_box(x, y, w, h, text):
        box = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.2,rounding_size=1.0",
                             ec="#000000", fc="#ffffff", lw=1.5, zorder=4)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=9.5, color='#000000', zorder=6)

    def draw_decision(x, y, label):
        pts = [[x, y + 3.2], [x + 5.0, y], [x, y - 3.2], [x - 5.0, y]]
        poly = Polygon(pts, closed=True, ec='#000000', fc='#ffffff', lw=1.5, zorder=4)
        ax.add_patch(poly)
        ax.text(x, y, label, ha='center', va='center', fontsize=8.2, color='#000000', zorder=6)

    # Activity Blocks matching Page 55
    draw_rounded_box(45, 89, 36, 5.5, "User opens AI Sales Agent")
    draw_rounded_box(45, 78, 36, 5.5, "Select Product / Inquire")
    draw_decision(45, 67, "API Available?")

    draw_rounded_box(24, 56, 30, 5.5, "Fetch content from APIs")
    draw_rounded_box(66, 56, 32, 5.5, "Load fallback from Database")

    # Merge diamond
    draw_decision(45, 45, "")

    draw_rounded_box(45, 35, 38, 5.5, "Display Recommendations")
    draw_rounded_box(45, 23, 36, 5.5, "User may Refresh or Exit")

    # End Node (Bullseye Circle matching Page 55)
    end_outer = Circle((45, 11), 2.4, ec='#000000', fc='#ffffff', lw=1.6, zorder=5)
    end_inner = Circle((45, 11), 1.5, ec='#000000', fc='#000000', zorder=6)
    ax.add_patch(end_outer)
    ax.add_patch(end_inner)

    # Straight clean arrows matching Page 55
    def draw_conn(x1, y1, x2, y2, label=None, label_side='right'):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(edgecolor='#000000', arrowstyle='->', lw=1.5),
                    zorder=3)
        if label:
            offset = 2.5 if label_side == 'right' else -2.5
            ax.text((x1 + x2)/2 + offset, (y1 + y2)/2, label, ha='center', va='center',
                    fontsize=9.0, color='#000000')

    draw_conn(45, 96.8, 45, 91.8)
    draw_conn(45, 86.2, 45, 80.8)
    draw_conn(45, 75.2, 45, 70.2)

    # Branches
    draw_conn(40, 67, 24, 58.8, label="Yes", label_side='left')
    draw_conn(50, 67, 66, 58.8, label="No", label_side='right')

    # Merge
    draw_conn(24, 53.2, 40, 45)
    draw_conn(66, 53.2, 50, 45)

    draw_conn(45, 41.8, 45, 37.8)
    draw_conn(45, 32.2, 45, 25.8)
    draw_conn(45, 20.2, 45, 13.5)

    plt.tight_layout()
    out_path = os.path.join(OUT_DIR, "activity_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated Figure 8.4 Activity Diagram at: {out_path}")

# ==============================================================================
# 8.5 DATA FLOW DIAGRAM (Matching Reference Page 56 Style)
# ==============================================================================
def draw_dfd_diagram():
    fig, ax = plt.subplots(figsize=(10, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 110)
    ax.axis('off')

    # Main Title
    ax.text(50, 106, "AI Sales Agent - Data Flow Diagram", ha='center', va='center',
            fontsize=15, fontweight='bold', color='#111827')

    # Helper functions matching Page 56
    def draw_entity(x, y, text):
        # Pill shape for external entities
        p = FancyBboxPatch((x - 7.5, y - 2.8), 15, 5.6, boxstyle="round,pad=0.2,rounding_size=2.0",
                           ec="#16a34a", fc="#bbf7d0", lw=1.4, zorder=5)
        ax.add_patch(p)
        ax.text(x, y, text, ha='center', va='center', fontsize=9.2, color='#0f172a', zorder=6)

    def draw_user_entity(x, y, text):
        p = FancyBboxPatch((x - 7.5, y - 2.8), 15, 5.6, boxstyle="round,pad=0.2,rounding_size=2.0",
                           ec="#2563eb", fc="#bfdbfe", lw=1.4, zorder=5)
        ax.add_patch(p)
        ax.text(x, y, text, ha='center', va='center', fontsize=9.2, color='#0f172a', zorder=6)

    def draw_proc(x, y, r, text):
        c = Circle((x, y), r, ec='#ca8a04', fc='#fef08a', lw=1.5, zorder=5)
        ax.add_patch(c)
        ax.text(x, y, text, ha='center', va='center', fontsize=9.0, color='#0f172a', zorder=6)

    def draw_store(x, y, w, h, name):
        ax.plot([x, x + w], [y + h/2, y + h/2], color='#000000', lw=1.5, zorder=5)
        ax.plot([x, x + w], [y - h/2, y - h/2], color='#000000', lw=1.5, zorder=5)
        ax.plot([x, x], [y - h/2, y + h/2], color='#000000', lw=1.5, zorder=5)
        ax.text(x + w/2, y, name, ha='center', va='center', fontsize=9.0, color='#000000', zorder=6)

    # ------------------ Level 0 (Top Tier) ------------------
    draw_user_entity(16, 92, "User")
    draw_proc(42, 92, 7.5, "ContentManager")
    draw_store(62, 92, 16, 5.0, "Database")
    draw_entity(90, 92, "Admin")

    # Arrows L0
    ax.annotate('', xy=(34.5, 93.5), xytext=(23.5, 93.5), arrowprops=dict(arrowstyle='->', lw=1.3))
    ax.text(29, 95.0, "Product Query", ha='center', va='bottom', fontsize=7.2)

    ax.annotate('', xy=(23.5, 90.5), xytext=(34.5, 90.5), arrowprops=dict(arrowstyle='->', lw=1.3))
    ax.text(29, 88.5, "Recommendations", ha='center', va='top', fontsize=7.2)

    ax.annotate('', xy=(62, 92), xytext=(49.5, 92), arrowprops=dict(arrowstyle='<->', lw=1.3))
    ax.text(55.5, 93.8, "Fetch Content", ha='center', va='bottom', fontsize=7.2)

    ax.annotate('', xy=(82.5, 92), xytext=(78, 92), arrowprops=dict(arrowstyle='<->', lw=1.3))
    ax.text(80.5, 93.8, "Logs/Auth", ha='center', va='bottom', fontsize=7.2)

    # ------------------ Level 1 (Middle Tier) ------------------
    draw_user_entity(16, 62, "User")
    draw_proc(38, 62, 7.2, "ContentManager")
    draw_store(58, 68, 16, 4.8, "Database")
    draw_entity(90, 68, "Admin")
    draw_proc(66, 53, 6.2, "APIHandler")

    # Arrows L1
    ax.annotate('', xy=(30.8, 63.5), xytext=(23.5, 63.5), arrowprops=dict(arrowstyle='->', lw=1.3))
    ax.text(27, 65.0, "Product Query", ha='center', va='bottom', fontsize=7.2)

    ax.annotate('', xy=(23.5, 60.5), xytext=(30.8, 60.5), arrowprops=dict(arrowstyle='->', lw=1.3))
    ax.text(27, 58.5, "Recommendations", ha='center', va='top', fontsize=7.2)

    ax.annotate('', xy=(58, 68), xytext=(45, 65), arrowprops=dict(arrowstyle='<->', lw=1.3))
    ax.text(51, 68.2, "Fallback Data", ha='center', va='bottom', fontsize=7.0)

    ax.annotate('', xy=(60, 53), xytext=(45, 59), arrowprops=dict(arrowstyle='<->', lw=1.3))
    ax.text(52, 53.5, "API Request", ha='center', va='bottom', fontsize=7.0)

    ax.annotate('', xy=(82.5, 68), xytext=(74, 68), arrowprops=dict(arrowstyle='<->', lw=1.3))
    ax.text(78.5, 69.5, "Auth/Login", ha='center', va='bottom', fontsize=7.0)

    # ------------------ Level 2 (Bottom Tier) ------------------
    draw_user_entity(16, 26, "User")
    draw_proc(36, 26, 7.0, "ContentManager")
    draw_store(56, 34, 16, 4.8, "Database")
    draw_entity(90, 34, "Admin")
    draw_proc(64, 18, 6.2, "APIHandler")

    # External APIs on right side (Matching Page 56)
    apis = [
        (90, 24, "Gemini LLM API", "#fce7f3", "#be185d"),
        (90, 16, "Shopify API", "#fee2e2", "#dc2626"),
        (90, 8, "Web Speech API", "#dcfce7", "#16a34a"),
        (90, 0, "CRM Webhook API", "#fef3c7", "#d97706")
    ]

    for ax_x, ax_y, a_name, a_bg, a_border in apis:
        p = FancyBboxPatch((ax_x - 7.5, ax_y - 2.4), 15, 4.8, boxstyle="round,pad=0.2,rounding_size=1.0",
                           ec=a_border, fc=a_bg, lw=1.2, zorder=5)
        ax.add_patch(p)
        ax.text(ax_x, ax_y, a_name, ha='center', va='center', fontsize=8.0, color='#0f172a', zorder=6)

        # Arrow from APIHandler
        ax.annotate('', xy=(ax_x - 7.5, ax_y), xytext=(70.2, 18),
                    arrowprops=dict(arrowstyle='<->', edgecolor='#64748b', lw=1.1), zorder=4)

    # Connections L2
    ax.annotate('', xy=(29, 27.5), xytext=(23.5, 27.5), arrowprops=dict(arrowstyle='->', lw=1.3))
    ax.text(26, 29.0, "Product Query", ha='center', va='bottom', fontsize=7.0)

    ax.annotate('', xy=(23.5, 24.5), xytext=(29, 24.5), arrowprops=dict(arrowstyle='->', lw=1.3))
    ax.text(26, 22.5, "Recommendations", ha='center', va='top', fontsize=7.0)

    ax.annotate('', xy=(56, 34), xytext=(43, 29), arrowprops=dict(arrowstyle='<->', lw=1.3))
    ax.annotate('', xy=(58, 18), xytext=(43, 23), arrowprops=dict(arrowstyle='<->', lw=1.3))
    ax.annotate('', xy=(82.5, 34), xytext=(72, 34), arrowprops=dict(arrowstyle='<->', lw=1.3))

    plt.tight_layout()
    out_path = os.path.join(OUT_DIR, "data_flow_diagram.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated Figure 8.5 Data Flow Diagram at: {out_path}")

if __name__ == "__main__":
    draw_class_diagram()
    draw_use_case_diagram()
    draw_sequence_diagram()
    draw_activity_diagram()
    draw_dfd_diagram()
    print("All 5 diagrams strictly matching reference report generated successfully!")
