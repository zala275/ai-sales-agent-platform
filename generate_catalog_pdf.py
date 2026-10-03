import sys
from fpdf import FPDF

class CatalogPDF(FPDF):
    def header(self):
        # Blue top bar
        self.set_fill_color(37, 99, 235)
        self.rect(0, 0, 210, 8, 'F')
        
        self.set_y(14)
        self.set_font('Helvetica', 'B', 18)
        self.set_text_color(15, 23, 42)
        self.cell(120, 8, 'ApexTech India Electronics & Lifestyle', ln=0)
        
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(100, 116, 139)
        self.cell(60, 8, 'DOC: CAT-2026-INDIA-INR', ln=1, align='R')
        
        self.set_font('Helvetica', '', 10)
        self.set_text_color(37, 99, 235)
        self.cell(120, 6, 'Official Product Specifications, Pricing (INR) & AI Catalog', ln=0)
        
        self.set_font('Helvetica', '', 8)
        self.set_text_color(148, 163, 184)
        self.cell(60, 6, 'Version 3.0 - Indian Rupee (INR) Edition', ln=1, align='R')
        
        self.ln(4)
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.4)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def footer(self):
        self.set_y(-14)
        self.set_font('Helvetica', '', 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, f'ApexTech India Pvt. Ltd. | Page {self.page_no()} | AI Sales Agent Platform Verified Knowledge Base (INR Edition)', align='C')

pdf = CatalogPDF()
pdf.set_auto_page_break(auto=True, margin=16)
pdf.add_page()

# Notice Box
pdf.set_fill_color(241, 245, 249)
pdf.set_draw_color(37, 99, 235)
pdf.set_line_width(0.6)
pdf.rect(10, pdf.get_y(), 190, 16, 'DF')
pdf.set_xy(14, pdf.get_y() + 3)
pdf.set_font('Helvetica', 'B', 9)
pdf.set_text_color(37, 99, 235)
pdf.cell(0, 5, 'AI Knowledge Base Ingestion Notice (India Region):', ln=1)
pdf.set_x(14)
pdf.set_font('Helvetica', '', 8.5)
pdf.set_text_color(51, 65, 85)
pdf.cell(0, 5, 'All prices listed in Indian Rupees (INR / Rs.). Includes 18% GST invoice, express nationwide delivery, and UPI/COD support.', ln=1)

pdf.ln(6)

# Section 1 Header
pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(15, 23, 42)
pdf.cell(0, 7, 'Featured Product Lineup & Indian Rupee (INR) Pricing', ln=1)
pdf.set_draw_color(203, 213, 225)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(4)

def add_product(name, category, price_tag, desc, specs):
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(226, 232, 240)
    start_y = pdf.get_y()
    
    # Dynamic height calculation
    box_height = 42 + len(specs) * 4.2
    if start_y + box_height > 275:
        pdf.add_page()
        start_y = pdf.get_y()
        
    pdf.rect(10, start_y, 190, box_height, 'DF')
    pdf.set_xy(14, start_y + 3)
    
    # Title & Badge
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(110, 6, name, ln=0)
    
    pdf.set_font('Helvetica', 'B', 8.5)
    pdf.set_text_color(37, 99, 235)
    pdf.cell(66, 6, f'[{category.upper()}]  {price_tag}', ln=1, align='R')
    
    # Description
    pdf.set_x(14)
    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(182, 4.2, desc)
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
        
    pdf.set_y(start_y + box_height + 4)

# Product 1
add_product(
    "1. Apex Pro Wireless Headphones",
    "Best Seller · Audio",
    "Rs. 14,999 (MRP Rs. 19,999)",
    "Over-ear flagship headphones with Hybrid Active Noise Cancellation (40dB), custom 40mm graphene dynamic drivers, and memory-foam protein leather cushions. Save 15% extra with coupon WELCOME15.",
    [
        ("Price (INR):", "Rs. 14,999 (Offer Price)", "With WELCOME15:", "Rs. 12,749 (Save Rs. 2,250)"),
        ("Battery Life:", "40h (ANC On) / 60h (Std)", "Fast Charge:", "10 mins = 5 hrs playback"),
        ("Connectivity:", "Bluetooth 5.3 + 3.5mm Aux", "Noise Reduction:", "Hybrid Dual-Mic 40dB ANC"),
        ("Available Colors:", "Matte Black, Pearl Silver", "Warranty:", "2-Year Direct Replacement")
    ]
)

# Product 2
add_product(
    "2. Apex Ultra Smartwatch 2",
    "Tactical · Wearable",
    "Rs. 19,999 (MRP Rs. 26,999)",
    "Rugged smartwatch with aerospace-grade titanium frame, sapphire crystal touchscreen, dual-frequency GPS navigation, and advanced biosensors. Water resistant up to 100 meters (10 ATM).",
    [
        ("Price (INR):", "Rs. 19,999 (Offer Price)", "With WELCOME15:", "Rs. 16,999 (Save Rs. 3,000)"),
        ("Water Resistance:", "100m (10 ATM - Swimming)", "Battery Life:", "Up to 14 Days Typical"),
        ("Display:", "1.9-inch AMOLED (1000 Nits)", "Health Sensors:", "ECG, SpO2, Heart, Sleep"),
        ("Case Sizes:", "44mm and 48mm Options", "Compatibility:", "Apple iOS & Android")
    ]
)

# Product 3
add_product(
    "3. Apex Studio Soundbar 7.1",
    "Home Theater · Audio",
    "Rs. 24,999 (MRP Rs. 34,999)",
    "Cinematic 9-driver soundbar system featuring dedicated upward-firing Dolby Atmos spatial channels and a wireless 8-inch downward subwoofer delivering 500W peak home theater output.",
    [
        ("Price (INR):", "Rs. 24,999 (Offer Price)", "With WELCOME15:", "Rs. 21,249 (Save Rs. 3,750)"),
        ("Audio Formats:", "Dolby Atmos, DTS:X, 7.1", "Total Peak Power:", "500W High Efficiency"),
        ("Connectivity:", "HDMI eARC, Optical, BT 5.2", "Subwoofer:", "Wireless 8-Inch Auto-Pair"),
        ("Voice Support:", "Google, Alexa, Apple AirPlay", "Warranty:", "2-Year Comprehensive")
    ]
)

# Product 4
add_product(
    "4. Apex GaN III Fast Charger 100W",
    "Power & Accessories",
    "Rs. 3,499 (MRP Rs. 4,999)",
    "Pocket-sized ultra-fast wall charger with GaN III semiconductors. Powers demanding laptops, tablets, and smartphones simultaneously with smart thermal surge load balancing.",
    [
        ("Price (INR):", "Rs. 3,499 (Offer Price)", "With WELCOME15:", "Rs. 2,974 (Save Rs. 525)"),
        ("Max Output:", "100W Power Delivery 3.0", "Port Config:", "3x USB-C + 1x USB-A QC4"),
        ("Safety Protection:", "Thermal Guard & Surge Cut", "Device Support:", "MacBook, iPhone, Galaxy, PC"),
        ("Dimensions:", "68mm x 65mm x 31mm", "Weight:", "195 grams")
    ]
)

# Product 5
add_product(
    "5. Premium Organic Cotton T-Shirts",
    "Lifestyle · Apparel",
    "Rs. 1,299 (MRP Rs. 1,799)",
    "Crafted from 100% premium combed organic cotton (180 GSM). Pre-shrunk, breathable, ultra-soft handfeel with reinforced double-stitched collar and hems. Machine washable cold.",
    [
        ("Price (INR):", "Rs. 1,299 (Offer Price)", "With WELCOME15:", "Rs. 1,104 (Save Rs. 195)"),
        ("Material:", "100% Organic Cotton (180 GSM)", "Available Sizes:", "XS, S, M, L, XL, XXL"),
        ("Available Colors:", "Classic Black, White, Navy", "Care Instructions:", "Machine Wash Cold"),
        ("Fit Type:", "Modern Regular Fit", "Exchange Policy:", "30-Day Free Sizing Exchange")
    ]
)

# Section 2: Policies & FAQs
pdf.ln(2)
pdf.set_font('Helvetica', 'B', 12)
pdf.set_text_color(15, 23, 42)
pdf.cell(0, 7, 'Shipping, Payment, Return & Warranty Policies (India)', ln=1)
pdf.set_draw_color(203, 213, 225)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(3)

faqs = [
    ("Q: How long does express shipping take across India?",
     "A: Standard Express Delivery takes 2 to 4 business days nationwide (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, etc.). Orders placed before 3:00 PM are dispatched same-day with BlueDart / Delhivery express tracking."),
    ("Q: Which payment methods and currencies are supported?",
     "A: All transactions are processed in Indian Rupees (INR / Rs.). We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, EMI options, and Cash on Delivery (COD) with verification."),
    ("Q: What is the 30-day return and exchange policy?",
     "A: We provide a 30-day hassle-free return and exchange policy. Free doorstep pickup is arranged across all serviceable Indian pincodes. Full refunds are processed within 24-48 hours back to your original payment method or UPI ID."),
    ("Q: What does the 2-Year Direct Replacement Warranty cover?",
     "A: All ApexTech electronic items include an official 2-Year Direct Replacement Warranty covering manufacturing defects, driver failures, internal circuitry, and battery health degradation exceeding 25%.")
]

for q, a in faqs:
    pdf.set_font('Helvetica', 'B', 8.5)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 4.5, q, ln=1)
    pdf.set_font('Helvetica', '', 8)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 3.8, a)
    pdf.ln(2)

pdf.output('testing_catalog.pdf')
print("Successfully generated Indian Rupee testing_catalog.pdf")
