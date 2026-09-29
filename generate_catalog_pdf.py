import sys
from fpdf import FPDF

class CatalogPDF(FPDF):
    def header(self):
        # Blue top bar
        self.set_fill_color(37, 99, 235)
        self.rect(0, 0, 210, 8, 'F')
        
        self.set_y(14)
        self.set_font('Helvetica', 'B', 20)
        self.set_text_color(15, 23, 42)
        self.cell(120, 9, 'ApexTech Electronics', ln=0)
        
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(100, 116, 139)
        self.cell(60, 9, 'DOCUMENT: CAT-2026-TEST', ln=1, align='R')
        
        self.set_font('Helvetica', '', 10)
        self.set_text_color(37, 99, 235)
        self.cell(120, 6, 'Official Product Specifications & Testing Catalog', ln=0)
        
        self.set_font('Helvetica', '', 8)
        self.set_text_color(148, 163, 184)
        self.cell(60, 6, 'Version 2.4 - AI Ingestion Ready', ln=1, align='R')
        
        self.ln(4)
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.4)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-14)
        self.set_font('Helvetica', '', 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, f'ApexTech Electronics Inc. | Page {self.page_no()} | AI Sales Agent Platform Verified Knowledge Base', align='C')

pdf = CatalogPDF()
pdf.set_auto_page_break(auto=True, margin=18)
pdf.add_page()

# Notice Box
pdf.set_fill_color(241, 245, 249)
pdf.set_draw_color(37, 99, 235)
pdf.set_line_width(0.6)
pdf.rect(10, pdf.get_y(), 190, 16, 'DF')
pdf.set_xy(14, pdf.get_y() + 3)
pdf.set_font('Helvetica', 'B', 9)
pdf.set_text_color(37, 99, 235)
pdf.cell(0, 5, 'AI Knowledge Base Ingestion Notice:', ln=1)
pdf.set_x(14)
pdf.set_font('Helvetica', '', 8.5)
pdf.set_text_color(51, 65, 85)
pdf.cell(0, 5, 'This document contains verified technical specifications, pricing, warranty, and return policies for AI ingestion.', ln=1)

pdf.ln(6)

# Section 1 Header
pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(15, 23, 42)
pdf.cell(0, 8, 'Featured Product Lineup', ln=1)
pdf.set_draw_color(203, 213, 225)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(4)

def add_product(name, category, desc, specs):
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(226, 232, 240)
    start_y = pdf.get_y()
    
    # Calculate box height approx
    pdf.rect(10, start_y, 190, 48, 'DF')
    pdf.set_xy(14, start_y + 3)
    
    # Title & Badge
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(120, 6, name, ln=0)
    
    pdf.set_font('Helvetica', 'B', 8)
    pdf.set_text_color(37, 99, 235)
    pdf.cell(56, 6, f'[{category.upper()}]', ln=1, align='R')
    
    # Description
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(182, 4.5, desc)
    pdf.ln(2)
    
    # Specs Table 2-col
    pdf.set_font('Helvetica', '', 8)
    for k1, v1, k2, v2 in specs:
        pdf.set_x(14)
        pdf.set_font('Helvetica', 'B', 8)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(32, 4.2, k1, ln=0)
        pdf.set_font('Helvetica', '', 8)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(58, 4.2, v1, ln=0)
        
        pdf.set_font('Helvetica', 'B', 8)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(32, 4.2, k2, ln=0)
        pdf.set_font('Helvetica', '', 8)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(60, 4.2, v2, ln=1)
        
    pdf.set_y(start_y + 51)

# Product 1
add_product(
    "1. Apex Pro Wireless Headphones",
    "Best Seller · Audio",
    "Over-ear flagship headphones with Hybrid Active Noise Cancellation (40dB), custom 40mm graphene dynamic drivers, and memory-foam protein leather cushions.",
    [
        ("Battery Life:", "40h (ANC On) / 60h (Std)", "Fast Charge:", "10 mins = 5 hrs playback"),
        ("Connectivity:", "Bluetooth 5.3 + 3.5mm Aux", "Noise Reduction:", "Hybrid Dual-Mic ANC"),
        ("Available Colors:", "Matte Black, Pearl Silver", "Warranty:", "2-Year Hardware Replacement")
    ]
)

# Product 2
add_product(
    "2. Apex Ultra Smartwatch 2",
    "Tactical · Wearable",
    "Rugged smartwatch with aerospace-grade titanium frame, sapphire crystal touchscreen, dual-frequency GPS navigation, and advanced biosensors.",
    [
        ("Water Resistance:", "100m (10 ATM - Swimming)", "Battery Life:", "Up to 14 Days Typical"),
        ("Display:", "1.9-inch AMOLED (1000 Nits)", "Health Sensors:", "ECG, SpO2, Heart, Sleep"),
        ("Case Sizes:", "44mm and 48mm Options", "Compatibility:", "Apple iOS & Android")
    ]
)

# Product 3
add_product(
    "3. Apex Studio Soundbar 7.1",
    "Home Theater · Audio",
    "Cinematic 9-driver soundbar system featuring dedicated upward-firing Dolby Atmos spatial channels and a wireless 8-inch downward subwoofer.",
    [
        ("Audio Formats:", "Dolby Atmos, DTS:X, 7.1", "Total Peak Power:", "500W High Efficiency"),
        ("Connectivity:", "HDMI eARC, Optical, BT 5.2", "Subwoofer:", "Wireless 8-Inch Auto-Pair"),
        ("Voice Support:", "Google, Alexa, Apple AirPlay", "Warranty:", "2-Year Comprehensive")
    ]
)

# Product 4
add_product(
    "4. Apex GaN III Fast Charger 100W",
    "Power & Accessories",
    "Pocket-sized ultra-fast wall charger with GaN III semiconductors. Powers demanding laptops, tablets, and smartphones simultaneously with smart load balancing.",
    [
        ("Max Output:", "100W Power Delivery 3.0", "Port Config:", "3x USB-C + 1x USB-A QC4"),
        ("Safety Protection:", "Thermal Guard & Surge Cut", "Device Support:", "MacBook, iPhone, Galaxy, PC"),
        ("Dimensions:", "68mm x 65mm x 31mm", "Weight:", "195 grams")
    ]
)

# Section 2: Policies & FAQs
pdf.ln(3)
pdf.set_font('Helvetica', 'B', 13)
pdf.set_text_color(15, 23, 42)
pdf.cell(0, 8, 'Shipping, Return & Warranty Policies', ln=1)
pdf.set_draw_color(203, 213, 225)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(4)

faqs = [
    ("Q: How long does express shipping and delivery take?",
     "A: Standard Express Delivery takes 2 to 4 business days nationwide. Same-day dispatch applies for orders before 3:00 PM. International express takes 5 to 7 business days."),
    ("Q: What is the return and refund policy?",
     "A: We offer a 30-day risk-free return and exchange policy. Items must be in original packaging. Full refunds or instant replacements are issued within 48 hours of return inspection."),
    ("Q: How does the warranty claim process work?",
     "A: All ApexTech electronic products come with a 2-Year Direct Replacement Warranty covering manufacturing defects, battery degradation over 25%, and internal circuitry.")
]

for q, a in faqs:
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 5, q, ln=1)
    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 4.2, a)
    pdf.ln(2.5)

pdf.output('testing_catalog.pdf')
print("Successfully generated testing_catalog.pdf")
