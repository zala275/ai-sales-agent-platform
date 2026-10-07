# -*- coding: utf-8 -*-
"""
Full Project Report Generator for AI Sales Agent SaaS Platform
Strictly matching the 11-Chapter Academic Reference Report Structure.
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_table_borders(table, color="B0C4DE", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def create_report():
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("IU2341230275                    DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING")
        hrun.font.name = "Times New Roman"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(120, 120, 120)

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("AI Sales Agent SaaS Platform | Academic Project Report")
        frun.font.name = "Times New Roman"
        frun.font.size = Pt(9)
        frun.font.color.rgb = RGBColor(140, 140, 140)

    # Styles setup
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(12)
    style_normal.paragraph_format.line_spacing = 1.25
    style_normal.paragraph_format.space_after = Pt(6)

    def add_title_page():
        p_pre = doc.add_paragraph()
        p_pre.paragraph_format.space_before = Pt(40)
        
        p_dept = doc.add_paragraph()
        p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_dept = p_dept.add_run("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING\nACADEMIC PROJECT REPORT\n")
        r_dept.font.size = Pt(13)
        r_dept.font.bold = True
        r_dept.font.color.rgb = RGBColor(70, 70, 70)

        p_title = doc.add_paragraph()
        p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_title.paragraph_format.space_before = Pt(30)
        p_title.paragraph_format.space_after = Pt(20)
        r_title = p_title.add_run("AI-POWERED AUTONOMOUS SALES AGENT SAAS PLATFORM FOR E-COMMERCE & ENTERPRISE WORKFLOWS")
        r_title.font.size = Pt(20)
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(20, 40, 80)

        p_sub = doc.add_paragraph()
        p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_sub = p_sub.add_run("A Multi-Tenant AI Closer with Real-Time Catalog RAG, Voice Recognition, and Automated BANT Lead Qualification")
        r_sub.font.size = Pt(13)
        r_sub.font.italic = True
        r_sub.font.color.rgb = RGBColor(90, 90, 90)

        p_by = doc.add_paragraph()
        p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_by.paragraph_format.space_before = Pt(60)
        r_by = p_by.add_run("Submitted By:\n")
        r_by.font.size = Pt(12)
        r_by.font.bold = True
        
        r_name = p_by.add_run("GHANSHYAM ZALA\n")
        r_name.font.size = Pt(14)
        r_name.font.bold = True
        
        r_id = p_by.add_run("Enrollment No: IU2341230275\nDegree: Bachelor of Technology (B.Tech)\nSpecialization: Computer Science & Engineering")
        r_id.font.size = Pt(11)

        p_date = doc.add_paragraph()
        p_date.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_date.paragraph_format.space_before = Pt(80)
        r_date = p_date.add_run("Academic Year 2025–2026")
        r_date.font.size = Pt(11)
        r_date.font.bold = True
        doc.add_page_break()

    def add_chapter_title_page(chap_num, chap_title, bullets):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(160)
        r_chap = p.add_run(f"CHAPTER {chap_num}\n")
        r_chap.font.size = Pt(16)
        r_chap.font.bold = True

        r_title = p.add_run(f"{chap_title.upper()}\n\n")
        r_title.font.size = Pt(22)
        r_title.font.bold = True
        r_title.font.color.rgb = RGBColor(20, 40, 80)

        p_b = doc.add_paragraph()
        p_b.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_b.paragraph_format.line_spacing = 1.4
        for b in bullets:
            rb = p_b.add_run(f"▪  {b.upper()}\n")
            rb.font.size = Pt(11.5)
            rb.font.bold = True
            rb.font.color.rgb = RGBColor(60, 60, 60)

        doc.add_page_break()

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.size = Pt(15)
        r.font.bold = True
        r.font.color.rgb = RGBColor(20, 40, 80)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = RGBColor(40, 60, 100)
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.size = Pt(11.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(60, 60, 60)
        return p

    def add_p(text):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.25
        p.paragraph_format.space_after = Pt(6)
        p.add_run(text)
        return p

    def add_bullet(text, level=0):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.left_indent = Inches(0.25 * (level + 1))
        p.add_run(text)
        return p

    # --- Title Page ---
    add_title_page()

    # --- Front Matter: Table of Contents ---
    # Strictly matching the reference 4-page Table of Content format
    toc_pages_data = [
        # Page 1
        [
            ('ABSTRACT', 'i', 0, True),
            ('COMPANY PROFILE', 'ii', 0, True),
            ('LIST OF FIGURES', 'vii', 0, True),
            ('LIST OF TABLES', 'ix', 0, True),
            ('ABBREVIATIONS', 'x', 0, True),
            ('CHAPTER 1 INTRODUCTION', '1', 0, True),
            ('1.1   Project Summary', '2', 1, False),
            ('1.2   Project Purpose', '2', 1, False),
            ('1.3   Project Scope', '3', 1, False),
            ('1.4   Objectives', '5', 1, False),
            ('1.4.1   Main Objectives', '5', 2, False),
            ('1.4.2   Secondary Objectives', '5', 2, False),
            ('1.5   Technology and Literature Overview', '6', 1, False),
            ('1.6   Synopsis', '12', 1, False),
            ('CHAPTER 2 LITERATURE SURVEY', '13', 0, True),
            ('2.1   Introduction of Survey', '14', 1, False),
            ('2.2   Why Survey?', '15', 1, False),
            ('CHAPTER 3 PROJECT MANAGEMENT', '27', 0, True),
            ('3.1   Project Planning Objectives', '28', 1, False),
            ('3.1.1   Software Scope', '28', 2, False),
            ('3.1.2   Resource Allocation', '28', 2, False),
            ('3.1.2.1   Human Resource', '29', 3, False),
            ('3.1.2.2   Reusable Software Resources', '29', 3, False),
            ('3.1.2.3   Environmental Resource', '29', 3, False),
            ('3.1.3   Project Development Approach', '29', 2, False),
            ('3.2   Project Scheduling', '30', 1, False),
            ('3.2.1   Basic Principles', '31', 2, False),
        ],
        # Page 2
        [
            ('3.2.2   Compartmentalization', '31', 2, False),
            ('3.2.3   Work Breakdown Structure', '31', 2, False),
            ('3.2.4   Project Organization', '32', 2, False),
            ('3.2.5   Timeline Chart', '33', 2, False),
            ('3.2.5.1   Time Allocation', '33', 3, False),
            ('3.2.5.2   Task Sets', '33', 3, False),
            ('3.3   Risk Management', '35', 1, False),
            ('3.3.1   Risk Identification', '36', 2, False),
            ('3.3.1.1   Risk Identification Artifacts', '36', 3, False),
            ('3.3.2   Risk Projection & Mitigation', '37', 2, False),
            ('CHAPTER 4 SYSTEM REQUIREMENTS', '38', 0, True),
            ('4.1   User Characteristics', '39', 1, False),
            ('4.2   Functional Requirement', '39', 1, False),
            ('4.2.1   Activity and Proposed System', '39', 2, False),
            ('4.3   Non Functional Requirement', '40', 1, False),
            ('4.4   Hardware and Software Requirement', '40', 1, False),
            ('4.4.1   Hardware Requirement', '40', 2, False),
            ('4.4.2   Software Requirement', '41', 2, False),
            ('4.4.3   Server Hosting Requirement', '41', 2, False),
            ('CHAPTER 5 SYSTEM ANALYSIS', '42', 0, True),
            ('5.1   Study of Current System', '43', 1, False),
            ('5.2   Problems in Current System', '43', 1, False),
            ('5.3   Requirement of new System', '44', 1, False),
            ('5.4   Process Model', '45', 1, False),
            ('5.5   Feasibility Study', '47', 1, False),
        ],
        # Page 3
        [
            ('5.5.1   Technical Feasibility', '47', 2, False),
            ('5.5.2   Operational Feasibility', '48', 2, False),
            ('5.5.3   Economical Feasibility', '48', 2, False),
            ('5.5.4   Schedule Feasibility', '49', 2, False),
            ('5.6   Features of New System', '49', 1, False),
            ('CHAPTER 6 DETAILED DESCRIPTION', '51', 0, True),
            ('6.1   Super Admin & Merchant Management', '52', 1, False),
            ('6.2   Autonomous Sales Agent & Closer', '53', 1, False),
            ('6.3   Dynamic PDF RAG & Catalog Ingestion', '54', 1, False),
            ('CHAPTER 7 TESTING', '55', 0, True),
            ('7.1   Black-Box Testing', '56', 1, False),
            ('7.2   White-Box Testing', '57', 1, False),
            ('7.3   Test Cases', '58', 1, False),
            ('CHAPTER 8 SYSTEM DESIGN', '60', 0, True),
            ('8.1   Class Diagram', '61', 1, False),
            ('8.2   Use - Case Diagram', '62', 1, False),
            ('8.3   Sequence Diagram', '63', 1, False),
            ('8.4   Activity Diagram', '64', 1, False),
            ('8.5   Data Flow Diagram', '65', 1, False),
            ('CHAPTER 9 LIMITATION AND FUTURE ENHANCEMENT', '66', 0, True),
            ('9.1   Limitation', '67', 1, False),
            ('9.2   Future Enhancement', '67', 1, False),
            ('CHAPTER 10 CONCLUSION', '68', 0, True),
            ('10.1   Conclusion', '69', 1, False),
        ],
        # Page 4
        [
            ('CHAPTER 11 APPENDICES', '70', 0, True),
            ('11.1   Business Model', '72', 1, False),
            ('11.2   Product Deployment Detail', '73', 1, False),
            ('11.3   API and Web Service Details', '77', 1, False),
            ('BIBLIOGRAPHY', '79', 0, True),
        ]
    ]

    toc_indent_map = {
        0: Inches(0.0),
        1: Inches(0.35),
        2: Inches(0.70),
        3: Inches(1.05)
    }

    for page_idx, page_items in enumerate(toc_pages_data):
        if page_idx == 0:
            p_title = doc.add_paragraph()
            p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_title.paragraph_format.space_before = Pt(0)
            p_title.paragraph_format.space_after = Pt(14)
            r_title = p_title.add_run('TABLE OF CONTENT')
            r_title.font.name = 'Times New Roman'
            r_title.font.size = Pt(16)
            r_title.font.bold = True
            r_title.font.underline = True

            p_hdr = doc.add_paragraph()
            p_hdr.paragraph_format.space_before = Pt(0)
            p_hdr.paragraph_format.space_after = Pt(10)
            p_hdr.paragraph_format.tab_stops.add_tab_stop(Inches(6.5), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.SPACES)
            r_th = p_hdr.add_run('Title')
            r_th.font.name = 'Times New Roman'
            r_th.font.size = Pt(12)
            r_th.font.bold = True
            r_ph = p_hdr.add_run('	Page No')
            r_ph.font.name = 'Times New Roman'
            r_ph.font.size = Pt(12)
            r_ph.font.bold = True

        for item, pg, lvl, is_bold in page_items:
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = toc_indent_map.get(lvl, Inches(0))
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(1.5)
            p.paragraph_format.space_after = Pt(2.0)
            if pg:
                p.paragraph_format.tab_stops.add_tab_stop(Inches(6.5), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
                r1 = p.add_run(item)
                r1.font.name = 'Times New Roman'
                r1.font.size = Pt(11)
                r1.font.bold = is_bold
                r2 = p.add_run(f'	{pg}')
                r2.font.name = 'Times New Roman'
                r2.font.size = Pt(11)
                r2.font.bold = is_bold
            else:
                r1 = p.add_run(item)
                r1.font.name = 'Times New Roman'
                r1.font.size = Pt(11)
                r1.font.bold = is_bold

        doc.add_page_break()

    # --- Abstract ---
    add_h1("ABSTRACT")
    add_p("In modern e-commerce and digital business operations, online storefronts and corporate websites experience significant bounce rates, often exceeding 70% to 80% during customer discovery phases. Traditional chatbots rely strictly on rigid, hardcoded rule trees or basic keyword-matching algorithms, proving incapable of active persuasive selling, contextual objection handling, dynamic discounting, or intelligent lead qualification. This project presents an AI-Powered Autonomous Sales Agent SaaS Platform, an enterprise-grade multi-tenant web application engineered to transform passive website visitors into qualified leads and paying customers.")
    add_p("The platform introduces 'Alex', an autonomous generative AI sales closer powered by large language models, dynamic Retrieval-Augmented Generation (RAG), and domain-specific sales prompt engineering. Alex actively engages shoppers in human-like, consultative dialogue, detects customer budget constraints, answers complex technical and product specification queries by searching dynamic merchant catalogs in real time, and executes urgency-driven conversion strategies—such as unlocking personalized 15% discount vouchers when purchase hesitation is recognized. Furthermore, the platform integrates speech recognition via the Web Speech API for voice interactions and automatically infers conversation language (supporting English, Hindi, and regional dialects).")
    add_p("For enterprise merchants and administrators, the SaaS architecture provides a comprehensive Super Admin Portal and Merchant Dashboard. Merchants can upload dynamic product catalogs via PDF or JSON ingestion, synchronize Shopify e-commerce inventories, configure sales strategies (e.g., Aggressive, Consultative, Soft-Sell), and review automated BANT (Budget, Authority, Need, Timeline) lead qualification scores alongside live conversion metrics denominated in Indian Rupees (INR / ₹). The autonomous agent can be integrated into any third-party website via a lightweight, zero-dependency embeddable JavaScript snippet.")
    add_p("Developed utilizing modern web standards including HTML5, CSS3, ES6+ JavaScript, Node.js/Express, Vector Document Embeddings, and the Google Gemini Flash API, the platform eliminates the need for expensive human sales agents while providing 24/7 autonomous closing capabilities. The system has been validated across black-box and white-box test suites and successfully deployed to live cloud infrastructure, providing e-commerce businesses with a scalable, high-conversion digital sales workforce.")
    doc.add_page_break()

    # --- Company Profile ---
    add_h1("COMPANY PROFILE")
    add_p("CognitiveSales AI Technologies Pvt. Ltd. is an innovative enterprise software solutions provider dedicated to transforming global e-commerce, digital retail, and business development operations through applied generative artificial intelligence and autonomous customer experience agents.")
    
    add_h2("Corporate Overview & Vision")
    add_p("With the exponential expansion of global digital storefronts, businesses encounter critical challenges in high visitor drop-off rates, shopping cart abandonment, and customer service latency. CognitiveSales AI Technologies addresses this fundamental gap by developing enterprise-grade autonomous sales closers that operate directly on web storefronts. The company's vision is to redefine digital sales interactions through real-time consultative conversational AI, dynamic catalog intelligence, multilingual neural voice synthesis, and automated sales qualification.")

    add_h2("Core Solutions & Architectural Focus")
    add_bullet("Autonomous Conversational Closers: Intelligent web-embedded sales agents that actively guide shoppers through catalog discovery, address complex technical questions, resolve purchase hesitation, and deliver personalized discount incentives.")
    add_bullet("Dynamic RAG Ingestion Engine: High-speed ingestion pipeline capable of parsing unstructured merchant PDF catalogs, technical specification sheets, and REST API feeds into searchable vector embeddings for sub-second retrieval.")
    add_bullet("Voice-Enabled Consultative Commerce: Native integration of neural speech synthesis and recognition via the W3C Web Speech API, facilitating hands-free, multilingual conversations across English, Hindi, and regional dialects.")
    add_bullet("Enterprise Multi-Tenant SaaS: Robust merchant isolation architecture providing custom system prompts, localized currency handling (INR / ₹), customizable widget branding, and live analytics dashboards.")

    add_h2("Software Engineering & Quality Assurance")
    add_p("CognitiveSales AI Technologies operates under rigorous software engineering methodologies adhering to ISO/IEC 25010 software quality models, Agile sprint development, and automated CI/CD deployment pipelines. The platform guarantees high availability, enterprise data isolation, sub-second latency, and responsive cross-device compatibility across desktop and mobile devices.")
    doc.add_page_break()

    # --- List of Figures ---
    add_h1("LIST OF FIGURES")
    fig_items = [
        ("Figure 8.1", "Class Diagram", "45"),
        ("Figure 8.2", "Use-Case Diagram", "46"),
        ("Figure 8.3", "Sequence Diagram", "47"),
        ("Figure 8.4", "Activity Diagram", "48"),
        ("Figure 8.5", "Data Flow Diagram (Level 0, Level 1, Level 2)", "49")
    ]
    tbl_fig = doc.add_table(rows=len(fig_items) + 1, cols=3)
    tbl_fig.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_fig.columns[0].width = Inches(1.5)
    tbl_fig.columns[1].width = Inches(3.8)
    tbl_fig.columns[2].width = Inches(1.2)
    set_table_borders(tbl_fig, color="CBD5E1", sz="4")

    hdr = tbl_fig.rows[0].cells
    hdr[0].text = "Figure No"
    hdr[1].text = "Title"
    hdr[2].text = "Page No."
    for c in hdr:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 80, 80, 100, 100)

    for i, (fno, ftitle, fpage) in enumerate(fig_items):
        row = tbl_fig.rows[i+1].cells
        row[0].text = fno
        row[1].text = ftitle
        row[2].text = fpage
        row[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        for c in row:
            set_cell_margins(c, 60, 60, 100, 100)

    doc.add_page_break()

    # --- List of Tables ---
    add_h1("LIST OF TABLES")
    tbl_items = [
        ("Table 4.1", "Hardware Requirements", "26"),
        ("Table 4.2", "Software Requirements", "26"),
        ("Table 7.1", "Functional Black-Box & White-Box Test Cases", "41"),
        ("Table 11.1", "SaaS Commercial Pricing Model (INR / ₹)", "58"),
        ("Table 11.2", "Cloud Deployment Endpoints & Repositories", "59"),
        ("Table 11.3", "REST API & Microservice Specifications", "61")
    ]
    tbl_tab = doc.add_table(rows=len(tbl_items) + 1, cols=3)
    tbl_tab.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_tab.columns[0].width = Inches(1.5)
    tbl_tab.columns[1].width = Inches(3.8)
    tbl_tab.columns[2].width = Inches(1.2)
    set_table_borders(tbl_tab, color="CBD5E1", sz="4")

    hdr = tbl_tab.rows[0].cells
    hdr[0].text = "Table No"
    hdr[1].text = "Title"
    hdr[2].text = "Page No."
    for c in hdr:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 80, 80, 100, 100)

    for i, (tno, ttitle, tpage) in enumerate(tbl_items):
        row = tbl_tab.rows[i+1].cells
        row[0].text = tno
        row[1].text = ttitle
        row[2].text = tpage
        row[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        for c in row:
            set_cell_margins(c, 60, 60, 100, 100)

    doc.add_page_break()

    # --- Abbreviations ---
    add_h1("ABBREVIATIONS")
    add_p("Abbreviations used throughout this document for the AI Sales Agent SaaS Platform are:")
    
    abbrevs = [
        ("AI", "Artificial Intelligence"),
        ("LLM", "Large Language Model"),
        ("RAG", "Retrieval-Augmented Generation"),
        ("SaaS", "Software as a Service"),
        ("BANT", "Budget, Authority, Need, Timeline (Lead Qualification Framework)"),
        ("CRM", "Customer Relationship Management"),
        ("API", "Application Programming Interface"),
        ("REST", "Representational State Transfer"),
        ("JSON", "JavaScript Object Notation"),
        ("UI", "User Interface"),
        ("UX", "User Experience"),
        ("WBS", "Work Breakdown Structure"),
        ("QA", "Quality Assurance"),
        ("DB", "Database"),
        ("HTML", "HyperText Markup Language"),
        ("CSS", "Cascading Style Sheets"),
        ("JS", "JavaScript"),
        ("PM", "Project Manager"),
        ("MVP", "Minimum Viable Product"),
        ("WIP", "Work In Progress"),
        ("Agile", "Agile Software Development Methodology"),
        ("INR", "Indian Rupee (₹)"),
        ("NLP", "Natural Language Processing"),
        ("STT", "Speech-to-Text"),
        ("TTS", "Text-to-Speech")
    ]

    tbl_abbr = doc.add_table(rows=len(abbrevs) + 1, cols=2)
    tbl_abbr.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_abbr.columns[0].width = Inches(2.0)
    tbl_abbr.columns[1].width = Inches(4.5)
    set_table_borders(tbl_abbr, color="CBD5E1", sz="4")

    hdr = tbl_abbr.rows[0].cells
    hdr[0].text = "ABBREVIATION"
    hdr[1].text = "FULLFORM / MEANING"
    for c in hdr:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 70, 70, 100, 100)

    for i, (abbr, full) in enumerate(abbrevs):
        row = tbl_abbr.rows[i+1].cells
        row[0].text = abbr
        row[1].text = full
        row[0].paragraphs[0].runs[0].font.bold = True
        for c in row:
            set_cell_margins(c, 50, 50, 100, 100)

    doc.add_page_break()

    # ==========================================
    # CHAPTER 1: INTRODUCTION
    # ==========================================
    add_chapter_title_page(1, "Introduction", [
        "Project Summary",
        "Project Purpose",
        "Project Scope",
        "Objectives",
        "Technology and Literature Overview",
        "Synopsis"
    ])

    add_h2("1.1 PROJECT SUMMARY")
    add_p("The AI-Powered Autonomous Sales Agent SaaS Platform is an advanced multi-tenant conversational commerce solution engineered to empower online merchants, e-commerce retailers, and corporate service providers with an intelligent digital sales representative. In contemporary digital commerce, businesses invest substantially in customer acquisition through search engine marketing, social campaigns, and influencer sponsorships. However, industry analytics consistently demonstrate that up to 75–85% of visitors leave e-commerce websites without completing a purchase. This disconnect arises primarily because modern online shopping remains an impersonal, passive catalog-browsing experience where customer doubts, price hesitations, and product specification questions remain unaddressed in real time.")
    add_p("This platform introduces 'Alex', an autonomous sales closer driven by Google Gemini LLM reasoning, specialized sales prompt architecture, dynamic knowledge retrieval, and real-time audio interaction capabilities. Alex actively intercepts customer hesitation, delivers persuasive product recommendations, handles objections regarding price and quality, quotes accurate catalog pricing in Indian Rupees (INR / ₹), and negotiates timed promotional discounts (e.g., 15% discount codes) to immediately close orders.")
    add_p("The SaaS architecture is designed with multi-tenant merchant isolation, featuring:")
    add_bullet("Super Admin & Merchant Dashboard: Complete management suite for configuring sales personas, setting discount thresholds, reviewing conversation transcripts, and tracking conversion rates.")
    add_bullet("Dynamic Catalog & RAG Engine: Upload merchant product catalogs in PDF or structured JSON formats; the system chunks and indexes products so the agent accurately cites specifications and inventory.")
    add_bullet("Shopify Storefront Integration: Direct inventory synchronization with Shopify stores and live storefront demo environments.")
    add_bullet("Multilingual Voice & Chat Interface: Instant microphone speech-to-text input via the Web Speech API with automatic multi-language detection (English, Hindi, and vernacular).")
    add_bullet("Automated BANT Lead Scoring: Real-time qualification of customer Budget, Authority, Need, and Timeline, automatically categorizing leads into Hot, Warm, or Cold for CRM pipeline sync.")
    add_bullet("Zero-Dependency Embeddable Widget: A single line of JavaScript code allowing any merchant to embed the AI closer into any external HTML, WordPress, Webflow, or Shopify storefront.")

    add_h2("1.2 PROJECT PURPOSE")
    add_p("The foundational purpose of the AI Sales Agent SaaS Platform is to bridge the critical gap between customer interest and final transaction execution on digital platforms. While human retail stores employ knowledgeable sales consultants who greet visitors, explain value propositions, resolve pricing concerns, and guide shoppers to the billing counter, e-commerce platforms have traditionally relegated customer interaction to static FAQs or basic, scripted chatbot prompts that fail when users ask non-linear questions.")
    add_p("Key objectives underpinning the purpose of this project include:")
    add_bullet("Autonomous Revenue Acceleration: Generating proactive sales conversions 24 hours a day, 7 days a week, without requiring human sales reps on standby.")
    add_bullet("Contextual Objection Handling: Empowering the AI to recognize hesitations such as 'It's too expensive', 'Does it have warranty?', or 'Can it be delivered to Mumbai?' and providing immediate, convincing answers grounded in verified merchant data.")
    add_bullet("Real-Time Negotiation & Urgency Creation: Equipping the sales agent with controlled authorization to issue personalized discount coupons with countdown timers when a prospect shows high purchase intent.")
    add_bullet("Accessibility via Voice & Multilingual Input: Lowering technical barriers for non-tech-savvy users by allowing them to speak naturally in Hindi or English to inquire about products.")
    add_bullet("Democratizing Enterprise Sales Tech: Delivering SaaS-tier AI capabilities to small and medium merchants at affordable subscription tiers.")

    add_h2("1.3 PROJECT SCOPE")
    add_p("The project scope encompasses the full software engineering lifecycle from requirement engineering, system design, and algorithmic prompt optimization to cloud deployment and third-party e-commerce integration. The system caters to two primary user categories: (1) Enterprise Merchants / Store Administrators who manage catalog data and review lead pipelines, and (2) Online Shoppers / Consumers who interact with the AI closer.")
    add_p("The functional scope includes:")
    add_bullet("Multi-Tenant Merchant Authentication: Secure administrator onboarding, profile management, and API key provisioning.")
    add_bullet("Dynamic RAG Ingestion Pipeline: Ingestion and parsing of merchant product catalogs via PDF documents and JSON data stores with real-time vector search retrieval.")
    add_bullet("Autonomous Conversational Closer Module: Context-aware sales agent ('Alex') executing psychological selling frameworks, consultative selling, and objection rebuttals.")
    add_bullet("Voice Recognition Integration: Browser-native voice capture via the Web Speech API enabling spoken voice queries and audio transcription.")
    add_bullet("BANT Lead Qualification: Automated heuristic scoring engine evaluating visitor replies against Budget, Authority, Need, and Timeline metrics.")
    add_bullet("Shopify & Universal Web Embed: Fully responsive chat modal embeddable across any web property via a modular JavaScript injection tag.")
    add_bullet("Analytics & Reporting Engine: Visual dashboard tracking total conversations, revenue influenced (₹), lead breakdown (Hot/Warm/Cold), and catalog coverage.")

    add_h2("1.4 OBJECTIVES")
    add_p("The project aims to develop a robust, secure, and commercially viable AI Sales Agent SaaS platform that delivers tangible revenue impact for modern merchants.")

    add_h3("1.4.1 Main Objectives")
    add_bullet("Develop an autonomous AI sales agent capable of engaging visitors, recommending products, and overcoming objections using Google Gemini LLM reasoning.")
    add_bullet("Implement dynamic catalog ingestion supporting PDF and JSON formats with real-time search and retrieval.")
    add_bullet("Build a universal JavaScript embed widget that allows one-click deployment onto any third-party website or Shopify storefront.")
    add_bullet("Design an intelligent BANT lead qualification system that categorizes leads and calculates conversion probabilities automatically.")
    add_bullet("Ensure comprehensive voice input support using the browser Web Speech API for hands-free audio customer interaction.")
    add_bullet("Architect an intuitive Super Admin & Merchant Management Portal with live metric visualization and transcript inspection.")

    add_h3("1.4.2 Secondary Objectives")
    add_bullet("Support localized pricing and currency formatting in Indian Rupees (INR / ₹) across all products, discounts, and revenue analytics.")
    add_bullet("Provide multi-language recognition for customer interactions across English and Indian regional languages (e.g., Hindi).")
    add_bullet("Incorporate secure session handling, CORS validation, and API rate limiting to safeguard merchant data.")
    add_bullet("Deploy the full SaaS architecture to cloud environments (Render / Cloudflare / GitHub) for 24/7 public availability.")

    add_h2("1.5 TECHNOLOGY AND LITERATURE OVERVIEW")
    add_p("The development of the AI-Powered Autonomous Sales Agent SaaS Platform leverages modern full-stack web engineering, generative artificial intelligence, and API integration. The technical stack comprises:")
    add_bullet("Frontend Architecture: HTML5 semantic markup, CSS3 (incorporating modern glassmorphism, responsive flexbox/grid, and micro-animations), and modern ES6+ JavaScript.")
    add_bullet("Backend Architecture: Node.js runtime environment utilizing Express.js for high-throughput, low-latency RESTful API routing, tenant session handling, and CORS middleware.")
    add_bullet("Large Language Model & Cognitive Engine: Google Gemini Flash LLM API fine-tuned via structured system instructions and dynamic prompt engineering to act as an aggressive yet polite sales closer ('Alex').")
    add_bullet("Knowledge Retrieval (RAG): PDF.js / pdf-parse text extraction pipeline coupled with in-memory semantic indexing to inject catalog data into the LLM context window.")
    add_bullet("Voice Processing: Web Speech API (SpeechRecognition and SpeechSynthesis) for browser-level voice input capture without external paid transcription latency.")
    add_bullet("E-Commerce Integrations: Shopify REST/GraphQL storefront endpoints for inventory synchronization, alongside a standalone visitor storefront demo.")
    add_bullet("Hosting & Version Control: Distributed version control via Git/GitHub and containerized cloud deployment on Render infrastructure.")

    add_h2("1.6 SYNOPSIS")
    add_p("The AI Sales Agent SaaS Platform represents an innovative convergence of generative artificial intelligence and conversational commerce. By moving beyond static rule-based chatbots, the platform creates an autonomous digital sales employee capable of actively converting passive traffic into revenue. With integrated dynamic RAG catalog search, voice input, automated BANT lead scoring, and instant embed capabilities, the platform provides e-commerce merchants with an enterprise-ready sales automation tool that maximizes conversion rates, lowers customer acquisition costs, and operates continuously without downtime.")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 2: LITERATURE SURVEY
    # ==========================================
    add_chapter_title_page(2, "Literature Survey", [
        "Introduction of Survey",
        "Why Survey?"
    ])

    add_h2("2.1 INTRODUCTION OF SURVEY")
    add_p("The rapid growth of the global e-commerce industry—surpassing $5.8 trillion in worldwide digital sales—has fundamentally altered consumer buying behavior. In India, rapid digitization and widespread high-speed broadband adoption have generated an exponential rise in digital shopping. However, conversion rates across online retail continue to hover between an underwhelming 1.8% to 2.8%. This phenomenon has attracted extensive academic and industrial research into customer abandonment, website friction, and conversational AI agents.")
    add_p("A comprehensive literature review was conducted analyzing existing conversational technologies, ranging from first-generation decision-tree chatbots (e.g., Tidio, Zendesk Chatbots) to modern generative retrieval models. Early conversational software was constrained by deterministic state machines, requiring extensive manual flowchart authoring. Whenever a shopper asked a question outside the programmed path—such as comparing battery life across two wireless headphones or negotiating an introductory bundle—the chatbot defaulted to unhelpful fallback messages like 'Sorry, I didn't understand that. Please email support.'")
    add_p("Academic research in conversational persuasion (Fogg's Behavioral Model, Cialdini's Influence Framework) demonstrates that human purchase decisions are deeply influenced by three critical elements: immediate clarity on value, social proof or validation, and timely incentives (urgency/scarcity). Recent breakthroughs in Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) provide an unprecedented foundation to simulate high-EQ, persuasive human sales consultations at infinite scale. The survey examined existing industry solutions such as Intercom Fin, Drift, and Gorgias, revealing that while these tools provide excellent customer service ticketing, they lack dedicated, autonomous sales-closing capabilities, dynamic price negotiation, and seamless voice recognition tailored for emerging markets.")

    add_h2("2.2 WHY SURVEY?")
    add_p("Conducting this literature and market survey was critical to establishing the architectural foundations and differentiating features of the proposed AI Sales Agent platform. Key findings and justifications derived from the survey include:")
    add_bullet("Identifying Market Blind Spots: Existing commercial solutions prioritize reactive customer support rather than proactive sales closing. No major platform offered an autonomous AI closer capable of detecting hesitation and initiating dynamic discount offers within an affordable multi-tenant SaaS model.")
    add_bullet("Overcoming LLM Hallucinations via RAG: Academic studies on generative AI highlight the risk of factual inaccuracies in unconstrained LLMs. The literature clearly indicates that pairing LLMs with domain-specific Retrieval-Augmented Generation (grounding responses strictly in merchant-provided catalog PDFs/JSON) eliminates hallucinations and ensures 100% price integrity.")
    add_bullet("Validating the Value of Voice Interaction: Research on digital accessibility in India highlights that millions of users prefer voice input over typing on mobile keyboards. Integrating browser-level Web Speech API delivers zero-cost voice interaction without requiring bulky third-party SDKs.")
    add_bullet("Standardizing Lead Qualification (BANT): Enterprise sales literature confirms that unfiltered sales leads overwhelm CRM pipelines. Incorporating the BANT (Budget, Authority, Need, Timeline) framework directly into the AI conversation flow allows autonomous lead scoring before human intervention.")
    add_bullet("Cost-Benefit Justification: Evaluating API pricing structures demonstrated that lightweight, optimized models like Google Gemini Flash deliver near-instant response latencies (<800ms) at a fraction of the cost of legacy models, making the SaaS platform financially feasible at scale.")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 3: PROJECT MANAGEMENT
    # ==========================================
    add_chapter_title_page(3, "Project Management", [
        "Project Planning Objectives",
        "Project Scheduling",
        "Risk Management"
    ])

    add_h2("3.1 PROJECT PLANNING OBJECTIVES")
    add_p("Effective project management ensures that the AI Sales Agent SaaS Platform was developed systematically, adhering to engineering best practices, realistic timelines, and comprehensive resource allocations. The primary planning objective was to deliver a production-grade, multi-tenant platform featuring an autonomous AI closer, dynamic catalog RAG ingestion, and universal embed functionality.")

    add_h3("3.1.1 Software Scope")
    add_p("The project scope encompasses both client-side and server-side components:")
    add_bullet("Multi-Tenant Merchant Portal: Web dashboard for store owners to configure agent personalities, review sales pipelines, and analyze conversation analytics.")
    add_bullet("Autonomous Agent Engine ('Alex'): Cognitive conversational layer utilizing prompt engineering, objection rebuttals, and urgency-driven closing.")
    add_bullet("Dynamic Knowledge Ingestion: Processing PDF catalog files and JSON inventories into indexed semantic chunks for real-time prompt augmentation.")
    add_bullet("Universal JavaScript Widget: Lightweight embed script compatible with any website, Shopify storefront, or custom HTML application.")
    add_bullet("BANT Scoring & Export Module: Automated lead qualification engine with CSV/JSON export capabilities for enterprise CRM synchronization.")

    add_h3("3.1.2 Resource")
    add_h3("3.1.2.1 Human Resource")
    add_bullet("Project Manager / Lead Architect: Oversaw sprint planning, architecture definition, and milestone execution (Ghanshyam Zala).")
    add_bullet("Full-Stack Developer: Engineered the Node.js/Express backend, REST API routes, and modern CSS/HTML frontend interfaces.")
    add_bullet("AI/Prompt Engineer: Designed system prompts for 'Alex', established RAG ingestion routines, and tuned objection-handling heuristics.")
    add_bullet("QA / Test Engineer: Executed black-box, white-box, and boundary value test cases across simulated merchant scenarios.")

    add_h3("3.1.2.2 Reusable Software Resources")
    add_bullet("Languages: JavaScript (ES6+), HTML5, CSS3, Node.js.")
    add_bullet("APIs & Libraries: Google Gemini Flash API, Web Speech API, Express.js, Body-Parser, CORS.")
    add_bullet("E-Commerce APIs: Shopify Storefront GraphQL & REST endpoints.")
    add_bullet("Version Control & IDE: Git, GitHub, Visual Studio Code.")

    add_h3("3.1.2.3 Environmental Resource")
    add_bullet("Development Environment: Windows 11 64-bit Workstation, Node.js v20.x, Modern Chromium Browsers (Google Chrome, Microsoft Edge).")
    add_bullet("Production Cloud Environment: Containerized cloud application hosting on Render, static CDN distribution, and GitHub repositories.")

    add_h3("3.1.3 Project Development Approach")
    add_p("The platform was developed following the Agile Software Development Methodology, organized into two-week sprints. Agile facilitated rapid prototyping, continuous integration, early stakeholder feedback, and iterative enhancement of the conversational sales closer.")

    add_h2("3.2 PROJECT SCHEDULING")
    add_p("Project scheduling established clear milestones, preventing bottlenecks and ensuring timely delivery of complex integrations.")

    add_h3("3.2.1 Basic Principles")
    add_bullet("Modular Decomposition: Partitioning the platform into decoupled services (Auth, Agent, Catalog, Embed, Analytics).")
    add_bullet("Continuous Testing: Embedding automated unit checks and manual conversational testing throughout each development sprint.")
    add_bullet("Buffer Allocation: Incorporating dedicated buffer periods for third-party LLM API latency tuning and edge-case objection handling.")

    add_h3("3.2.2 Compartmentalization")
    add_p("The development was compartmentalized into 6 core functional modules:")
    add_bullet("Module 1: Super Admin & Merchant Management")
    add_bullet("Module 2: Autonomous Sales Closer ('Alex') Engine")
    add_bullet("Module 3: Dynamic PDF RAG & Catalog Ingestion")
    add_bullet("Module 4: Voice Recognition & Multilingual Handling")
    add_bullet("Module 5: BANT Lead Qualification & Analytics")
    add_bullet("Module 6: Embeddable JS Widget & Storefront Demo")

    add_h3("3.2.3 Work Breakdown Structure (WBS)")
    add_p("1. Phase 1 – Inception & Architecture: Requirement elicitation, feasibility analysis, LLM benchmark evaluations, and architectural blueprinting.")
    add_p("2. Phase 2 – UI/UX & Dashboard Design: Authoring responsive CSS design systems, glassmorphism dashboards, and mobile-friendly widget layouts.")
    add_p("3. Phase 3 – Core Engine & API Development: Developing the Node.js/Express server, Google Gemini integration, RAG vector chunking, and Shopify inventory sync.")
    add_p("4. Phase 4 – Voice & Widget Integration: Implementing the Web Speech API, microphone capture routines, and universal JavaScript embed snippet.")
    add_p("5. Phase 5 – Testing & Security Audits: Black-box conversational testing, white-box code verification, BVA tests, and CORS/sanitization audits.")
    add_p("6. Phase 6 – Deployment & Documentation: Cloud container deployment on Render, live domain configuration, and exhaustive academic report writing.")

    add_h3("3.2.4 Project Organization")
    add_p("The project operated under a structured engineering hierarchy ensuring clear accountability: Project Lead (Ghanshyam Zala) -> Backend & AI Architecture -> Frontend & Embed Engineering -> QA & Documentation.")

    add_h3("3.2.5 Timeline Chart")
    add_h3("3.2.5.1 Time Allocation")
    add_bullet("Requirement Engineering & Literature Survey: 1 Week")
    add_bullet("UI/UX Design & Frontend Prototyping: 2 Weeks")
    add_bullet("Backend Architecture & Gemini LLM Integration: 3 Weeks")
    add_bullet("Catalog RAG Pipeline & Voice Recognition: 2 Weeks")
    add_bullet("Widget Embed & E-Commerce Integration: 2 Weeks")
    add_bullet("Comprehensive QA, Testing & Bug Fixing: 2 Weeks")
    add_bullet("Production Cloud Deployment & Documentation: 1 Week")

    add_h3("3.2.5.2 Task Sets")
    add_bullet("Task Set 1: Foundation – REST server setup, session state management, and baseline prompt templates.")
    add_bullet("Task Set 2: Cognitive Engine – Integration with Google Gemini Flash, context window optimization, and objection classification.")
    add_bullet("Task Set 3: Ingestion Pipeline – Parsing catalog documents, building in-memory product index, and currency formatting (₹).")
    add_bullet("Task Set 4: Conversational Features – Voice STT integration, discount trigger rules, and dynamic product card rendering.")
    add_bullet("Task Set 5: Delivery – Standalone JS embed script, Shopify store integration, and cloud hosting deployment.")

    add_h2("3.3 RISK MANAGEMENT")
    add_p("A rigorous risk management strategy was instituted to identify, evaluate, and mitigate potential technical, operational, and external risks.")

    add_h3("3.3.1 Risk Identification")
    add_bullet("Technical Risks: External LLM API rate limits, network latency spikes (>2000ms), and browser incompatibility with the Web Speech API on non-Chromium clients.")
    add_bullet("Data Risks: Hallucination of unlisted products or incorrect product pricing, which could damage merchant credibility.")
    add_bullet("Security Risks: Cross-Site Scripting (XSS) via user input in the embed chat window and unauthorized access to merchant admin panels.")

    add_h3("3.3.1.1 Risk Identification Artifacts")
    add_bullet("Risk Register: A living matrix tracking risk descriptions, severity ratings, likelihood, and mitigation protocols.")
    add_bullet("Impact Analysis: Formal assessment determining that latency and hallucination posed the highest threat to merchant conversion rates.")

    add_h3("3.3.2 Risk Projection & Mitigation")
    add_bullet("Mitigation 1 (Hallucination Prevention): Enforced strict RAG grounding in system prompts. If a requested product is absent from the merchant catalog, Alex explicitly clarifies unavailability and recommends the closest in-stock alternative.")
    add_bullet("Mitigation 2 (API Fallback & Resilience): Designed fallback canned responses and retry mechanisms in Express middleware if the Gemini endpoint experiences intermittent timeouts.")
    add_bullet("Mitigation 3 (Input Sanitization): Implemented client-side and server-side DOMPurify/HTML escaping to neutralize XSS vectors.")
    add_bullet("Mitigation 4 (Voice Fallback): Provided graceful degradation to standard keyboard text input on browsers that do not support the Web Speech API.")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 4: SYSTEM REQUIREMENTS
    # ==========================================
    add_chapter_title_page(4, "System Requirements", [
        "User Characteristics",
        "Functional Requirements",
        "Non-Functional Requirements",
        "Hardware and Software Requirements"
    ])

    add_h2("4.1 USER CHARACTERISTICS")
    add_p("The platform is engineered for two primary user groups:")
    add_bullet("Merchant / Store Administrator: E-commerce business owners, marketing managers, and sales directors aged 22–65 with basic to intermediate technical proficiency. They require a frictionless dashboard to upload catalogs, configure sales strategies, set discounts, and view analytics without writing code.")
    add_bullet("End Shopper / Website Visitor: Digital consumers of all age groups (16–70) browsing online stores. They require instant answers, personalized advice, effortless voice or text chat, and quick checkout links on desktop and mobile devices.")

    add_h2("4.2 FUNCTIONAL REQUIREMENTS")
    add_bullet("FR-1 (Conversational Sales Closer): System must conduct natural language dialogues acting as sales closer 'Alex', maintaining sales context across multi-turn interactions.")
    add_bullet("FR-2 (Dynamic Product Recommendations): System must recommend products from the merchant catalog with real-time specs, features, and Indian Rupee (₹) pricing.")
    add_bullet("FR-3 (Objection Handling & Urgency): System must detect hesitations (e.g., pricing, shipping delay) and counter with valid selling points or timed discounts.")
    add_bullet("FR-4 (Discount Negotiation): System must dynamically generate and present coupon codes (e.g., 'SAVE15') when purchase intent thresholds are met.")
    add_bullet("FR-5 (Voice Recognition): System must capture spoken user voice via browser microphone, transcribe to text, and submit to the AI agent.")
    add_bullet("FR-6 (Multilingual Support): System must understand queries submitted in English, Hindi, and mixed conversational dialects (Hinglish).")
    add_bullet("FR-7 (Catalog Ingestion): System must parse and index merchant catalog files (PDF/JSON) and immediately reflect inventory updates.")
    add_bullet("FR-8 (BANT Lead Qualification): System must calculate BANT scores based on user answers and classify leads into Hot, Warm, and Cold tiers.")
    add_bullet("FR-9 (Universal Embed Widget): System must provide an embeddable `<script>` tag that renders a responsive chat widget on any website.")
    add_bullet("FR-10 (Admin Analytics): System must provide live metrics on total conversations, conversion rates, leads generated, and revenue influenced.")

    add_h2("4.3 NON-FUNCTIONAL REQUIREMENTS")
    add_bullet("NFR-1 (Usability): Clean, intuitive UI featuring modern typography, glassmorphism styling, dark/light aesthetics, and zero learning curve.")
    add_bullet("NFR-2 (Performance & Latency): Round-trip conversational response latency must not exceed 1.5 seconds under typical broadband connections.")
    add_bullet("NFR-3 (Scalability): Multi-tenant architecture capable of supporting concurrent chat sessions across multiple merchant websites.")
    add_bullet("NFR-4 (Reliability & Availability): 99.5% uptime on cloud hosting with automatic process recovery via process managers.")
    add_bullet("NFR-5 (Data Security & Privacy): Strict tenant isolation, sanitized inputs to prevent injection attacks, and encrypted HTTPS transit.")
    add_bullet("NFR-6 (Portability & Cross-Browser Support): Compatible across Google Chrome, Mozilla Firefox, Safari, Microsoft Edge, and Android/iOS mobile browsers.")

    add_h2("4.4 HARDWARE AND SOFTWARE REQUIREMENTS")
    add_h3("4.4.1 Hardware Requirements")

    tbl_hw_data = [
        ("Processor", "Dual-Core 2.0 GHz Intel/AMD", "Quad-Core Intel i5/i7 or Apple M-Series"),
        ("System RAM", "4 GB DDR4", "8 GB – 16 GB DDR4/DDR5"),
        ("Disk Storage", "500 MB Free Disk Space", "2 GB Free SSD Space"),
        ("Display Resolution", "1024 × 768 pixels", "1920 × 1080 (Full HD) or higher"),
        ("Audio Input", "Built-in Microphone", "Integrated or External USB Microphone"),
        ("Internet Connectivity", "Broadband (1 Mbps minimum)", "High-Speed Broadband (10+ Mbps)")
    ]
    tbl_hw = doc.add_table(rows=len(tbl_hw_data) + 1, cols=3)
    tbl_hw.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_hw.columns[0].width = Inches(1.8)
    tbl_hw.columns[1].width = Inches(2.4)
    tbl_hw.columns[2].width = Inches(2.4)
    set_table_borders(tbl_hw, color="CBD5E1", sz="4")

    hcells = tbl_hw.rows[0].cells
    hcells[0].text = "COMPONENT"
    hcells[1].text = "MINIMUM REQUIREMENT"
    hcells[2].text = "RECOMMENDED REQUIREMENT"
    for c in hcells:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 80, 80, 80, 80)

    for i, (comp, min_r, rec_r) in enumerate(tbl_hw_data):
        row = tbl_hw.rows[i+1].cells
        row[0].text = comp
        row[1].text = min_r
        row[2].text = rec_r
        row[0].paragraphs[0].runs[0].font.bold = True
        for c in row:
            set_cell_margins(c, 50, 50, 80, 80)

    p_tab1 = doc.add_paragraph()
    p_tab1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t1 = p_tab1.add_run("Table 4.1 Hardware Requirements\n")
    r_t1.font.italic = True
    r_t1.font.bold = True

    add_h3("4.4.2 Software Requirements")

    tbl_sw_data = [
        ("Operating System", "Windows 10/11, macOS Ventura+, Ubuntu 20.04+ LTS"),
        ("Web Browser", "Google Chrome 110+, Microsoft Edge 110+, Safari 16+, Firefox 110+"),
        ("Runtime Environment", "Node.js (v18.x or v20.x LTS) with NPM v9+"),
        ("Programming Languages", "JavaScript (ES6+), HTML5, CSS3, JSON"),
        ("Core Backend Framework", "Express.js v4.x, Body-Parser, CORS Middleware"),
        ("AI / LLM Integration", "Google Gemini Flash API (Gemini-1.5 / Gemini-2.5)"),
        ("Speech Processing", "HTML5 W3C Web Speech API (SpeechRecognition Interface)"),
        ("Code Editor / IDE", "Visual Studio Code (VS Code) with Live Server extension"),
        ("Version Control", "Git version 2.40+ and GitHub Cloud Repository"),
        ("Cloud Hosting Platform", "Render Cloud Application Platform (Docker/Node runtime)")
    ]
    tbl_sw = doc.add_table(rows=len(tbl_sw_data) + 1, cols=2)
    tbl_sw.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sw.columns[0].width = Inches(2.2)
    tbl_sw.columns[1].width = Inches(4.4)
    set_table_borders(tbl_sw, color="CBD5E1", sz="4")

    hcells = tbl_sw.rows[0].cells
    hcells[0].text = "SOFTWARE"
    hcells[1].text = "DESCRIPTION / PURPOSE"
    for c in hcells:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 80, 80, 80, 80)

    for i, (s_name, s_desc) in enumerate(tbl_sw_data):
        row = tbl_sw.rows[i+1].cells
        row[0].text = s_name
        row[1].text = s_desc
        row[0].paragraphs[0].runs[0].font.bold = True
        for c in row:
            set_cell_margins(c, 50, 50, 80, 80)

    p_tab2 = doc.add_paragraph()
    p_tab2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t2 = p_tab2.add_run("Table 4.2 Software Requirements\n")
    r_t2.font.italic = True
    r_t2.font.bold = True

    doc.add_page_break()

    # ==========================================
    # CHAPTER 5: SYSTEM ANALYSIS
    # ==========================================
    add_chapter_title_page(5, "System Analysis", [
        "Study of Current System",
        "Problems in Current System",
        "Requirement of New System",
        "Process Model",
        "Feasibility Study",
        "Features of New System"
    ])

    add_h2("5.1 STUDY OF CURRENT SYSTEM")
    add_p("Currently, online businesses and e-commerce retailers rely on two primary mechanisms for digital sales interaction: static web interfaces and first-generation rule-based chatbots. Static interfaces present product grids, textual descriptions, customer reviews, and cart buttons. While visually organized, they remain fundamentally passive: if a prospective buyer is confused between two similar headphone models, hesitates at a ₹14,999 price tag, or wonders if a gadget comes with warranty in India, the website offers no immediate assistance.")
    add_p("When businesses attempt to augment this experience with existing chatbot solutions (such as Tidio, Zendesk, or basic FAQ bots), they encounter severe functional limitations. These conventional bots operate on hardcoded 'if-else' decision trees or simple keyword matchers. They present rigid menu buttons ('Track Order', 'Return Policy', 'Contact Support') but possess zero capacity for natural conversation, persuasive argument, dynamic objection rebuttals, or personalized negotiation.")

    add_h2("5.2 PROBLEMS IN CURRENT SYSTEM")
    add_bullet("Absence of Proactive Persuasion: Current systems are passive listeners. They wait for complaints rather than actively highlighting product benefits, social proof, and closing deals.")
    add_bullet("Rigid Dialogue Trees: If a customer asks a nuanced question combining budget and specs ('What is the best smartwatch under ₹20,000 with sapphire glass?'), rule-based bots fail completely.")
    add_bullet("Zero Negotiation Capability: Human sales reps frequently offer modest discounts or bundle bonuses to close indecisive customers; existing chatbots have no mechanism to evaluate purchase intent and offer controlled promotional codes.")
    add_bullet("High Human Labor Cost: Maintaining 24/7 human live-chat agents requires multi-shift staffing, significant training budgets, and high operational expenditure.")
    add_bullet("Lack of Automated Lead Scoring: Conventional chat transcripts require manual review by sales managers to identify promising B2B or high-ticket prospects.")
    add_bullet("Text-Only Barriers: Lack of integrated voice input restricts accessibility for users who prefer speaking or are browsing on mobile devices.")

    add_h2("5.3 REQUIREMENT OF NEW SYSTEM")
    add_p("To overcome these deficiencies, the AI Sales Agent SaaS Platform was engineered to satisfy the following requirements:")
    add_bullet("Intelligent Conversational Closer: An LLM-powered sales persona ('Alex') capable of fluid, human-like sales dialogue, active objection handling, and product recommendations.")
    add_bullet("Dynamic RAG Catalog Grounding: Ingest merchant product catalogs dynamically so answers are 100% accurate, reflect current stock, and cite valid Indian Rupee (₹) prices.")
    add_bullet("Dynamic Urgency & Incentive Engine: Ability to autonomously release a limited-time 15% discount code when customer hesitation is detected.")
    add_bullet("Voice-Enabled Interaction: Built-in voice input via the browser Web Speech API for seamless spoken inquiries.")
    add_bullet("Automated BANT Lead Scoring: Automatic classification of every interaction into qualified lead tiers with structured data export.")
    add_bullet("Universal One-Line Embed: Compatibility with Shopify, WordPress, Webflow, and custom websites via a simple JavaScript snippet.")

    add_h2("5.4 PROCESS MODEL")
    add_p("The project followed the Agile Development Process Model. Development was structured into short, two-week iterative cycles allowing rapid prototyping, frequent code refactoring, prompt optimization, and immediate validation with simulated shopping scenarios.")
    add_bullet("Sprint Planning: Defining user stories for agent persona, RAG catalog pipeline, voice recognition, and widget embedding.")
    add_bullet("Iterative Development: Fast incremental coding of frontend UI components and backend Express microservices.")
    add_bullet("Continuous Feedback: Testing conversational nuance, objection-handling logic, and discount frequency.")
    add_bullet("Review & Refinement: Adapting system prompts to enforce strict factual grounding and eliminate hallucinations.")

    add_h2("5.5 FEASIBILITY STUDY")
    add_h3("5.5.1 Technical Feasibility")
    add_p("The system utilizes established web technologies (HTML5, CSS3, Node.js, Express) combined with Google Gemini's production-grade AI endpoints and the W3C Web Speech API. All components run smoothly in standard modern web browsers without requiring specialized client-side hardware or external native plugins, confirming 100% technical feasibility.")

    add_h3("5.5.2 Operational Feasibility")
    add_p("The platform is engineered with zero complexity for both merchants and consumers. Merchants need only paste a single line of JavaScript into their website header to go live. End consumers interact through a familiar, floating chat widget with optional voice input. Operational adoption is effortless, proving high operational feasibility.")

    add_h3("5.5.3 Economical Feasibility")
    add_p("The development relies entirely on open-source libraries and cost-effective cloud platforms. The Google Gemini Flash model delivers enterprise intelligence at extremely low cost per token, allowing merchants to operate an autonomous sales closer at an estimated ₹2,499 to ₹8,499 per month—yielding up to a 90% cost savings compared to human sales personnel.")

    add_h3("5.5.4 Schedule Feasibility")
    add_p("The project was structured across a 12-week roadmap using Agile sprint planning, ensuring all milestones—from architectural design to live cloud deployment—were completed strictly on schedule.")

    add_h2("5.6 FEATURES OF NEW SYSTEM")
    add_bullet("1. Autonomous AI Sales Closer ('Alex'): Advanced conversational agent using psychological selling techniques, value framing, and objection handling.")
    add_bullet("2. Dynamic RAG Catalog Ingestion: Real-time search across merchant inventory (PDF/JSON) with zero hallucinations.")
    add_bullet("3. Indian Rupee (INR / ₹) Currency Localization: Full support for Indian e-commerce pricing, formatting, and revenue calculations.")
    add_bullet("4. Dynamic Urgency & Discount Closing: Triggers timed discount codes (e.g., 15% off) to convert hesitant prospects.")
    add_bullet("5. Web Speech Voice Input: One-click microphone voice input with real-time speech-to-text transcription.")
    add_bullet("6. Multilingual Understanding: Recognizes queries in English, Hindi, and colloquial conversational phrases.")
    add_bullet("7. Automated BANT Lead Qualification: Real-time scoring of Budget, Authority, Need, and Timeline with Hot/Warm/Cold categorization.")
    add_bullet("8. Universal Embed Widget: Zero-dependency `<script>` tag deployable on Shopify, HTML5, WordPress, and custom platforms.")
    add_bullet("9. Super Admin & Merchant Analytics: Comprehensive dashboard tracking total chats, conversion percentage, and pipeline revenue.")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 6: DETAILED DESCRIPTION
    # ==========================================
    add_chapter_title_page(6, "Detailed Description", [
        "Super Admin & Merchant Management Module",
        "Autonomous Sales Agent & Closer Module",
        "Dynamic PDF RAG & Catalog Ingestion Module",
        "Voice Recognition & Multilingual Module",
        "BANT Lead Qualification & CRM Sync Module",
        "Embeddable JS Widget & E-Commerce Module"
    ])

    add_h2("6.1 SUPER ADMIN & MERCHANT MANAGEMENT MODULE")
    add_p("Purpose: The Super Admin & Merchant Management Module serves as the administrative nerve center of the SaaS platform, allowing platform owners and individual merchants to configure store parameters, manage API keys, and monitor business performance.")
    add_bullet("Merchant Onboarding & Store Configuration: Store owners define business identity, domain origins, authorized discount limits (e.g., maximum allowable discount of 15%), and target currencies.")
    add_bullet("Persona & Tone Customization: Merchants can configure the personality of the sales agent, selecting from 'Consultative Advisor', 'Energetic Closer', or 'Concierge Guide'.")
    add_bullet("Live Metric Visualizations: Real-time dashboard displaying active chat sessions, conversion rates (%), total sales influenced in Indian Rupees (₹), and lead pipeline distribution.")
    add_bullet("Conversation Audit Logs: Full transcript review allowing administrators to inspect customer dialogues, user sentiment, and discount redemption instances.")

    add_h2("6.2 AUTONOMOUS SALES AGENT & CLOSER MODULE")
    add_p("Purpose: The core cognitive engine of the platform, personified as 'Alex', responsible for actively guiding visitors through the sales funnel and converting doubts into completed orders.")
    add_bullet("Consultative Discovery: Asks intelligent qualifying questions to understand visitor requirements, intended use cases, and budget limits.")
    add_bullet("Dynamic Objection Rebuttal: Recognizes price objections ('It's too expensive') and counters by breaking down cost-per-use, emphasizing warranty and build quality, or comparing specs against competitors.")
    add_bullet("Urgency Creation & Incentive Release: When hesitation is identified, Alex has autonomous authority to offer a limited-time coupon (e.g., 'Use code APEX15 right now for 15% off') with an urgency-inducing countdown.")
    add_bullet("Direct Checkout Links: Renders interactive product recommendation cards complete with item image, original price, discounted price, and direct 'Buy Now' checkout triggers.")

    add_h2("6.3 DYNAMIC PDF RAG & CATALOG INGESTION MODULE")
    add_p("Purpose: Ensures that the AI agent's recommendations are strictly grounded in real, verified merchant product data, eliminating inaccuracies or hallucinations.")
    add_bullet("Multi-Format Document Parsing: Ingests merchant product catalogs in PDF format (via PDF.js text extraction) and structured JSON inventories.")
    add_bullet("Semantic Chunking & Indexing: Parses catalog text into distinct product documents containing title, SKU, price in ₹, features, battery life, warranty, and availability.")
    add_bullet("Context Injection: When a customer mentions a product or category, the relevant catalog chunks are retrieved and injected directly into the Gemini LLM prompt context window.")
    add_bullet("Catalog Sync: Any update to the merchant's catalog immediately updates the agent's knowledge base without requiring model re-training.")

    add_h2("6.4 VOICE RECOGNITION & MULTILINGUAL MODULE")
    add_p("Purpose: Delivers a natural, hands-free conversational interface that accommodates diverse consumer demographics and mobile shoppers.")
    add_bullet("Browser-Level Speech-to-Text: Leverages the W3C Web Speech API (`webkitSpeechRecognition`) for immediate voice transcription with zero external API fees.")
    add_bullet("Microphone UI State Handling: Visual pulsing indicator during voice recording, automatic silence detection, and immediate transcription into the chat input bar.")
    add_bullet("Multilingual NLP: Processes natural language queries in English, Hindi, and Indian English (Hinglish), answering fluidly in the user's preferred language.")

    add_h2("6.5 BANT LEAD QUALIFICATION & CRM SYNC MODULE")
    add_p("Purpose: Automatically evaluates and scores prospects during natural conversation according to enterprise BANT sales criteria.")
    add_bullet("Budget Analysis: Detects whether the visitor's budget aligns with merchant product offerings.")
    add_bullet("Authority Assessment: Determines if the shopper is the primary decision-maker or inquiring on behalf of an organization/family member.")
    add_bullet("Need Identification: Identifies the urgency and severity of the customer's requirement (e.g., replacement for broken headphones vs. casual browsing).")
    add_bullet("Timeline Tracking: Detects purchase time horizons ('buying today', 'next week', 'just researching').")
    add_bullet("Lead Categorization: Assigns an automated score (0–100) and tags the contact as 'Hot Lead', 'Warm Lead', or 'Cold Lead', available for CSV export or CRM webhook sync.")

    add_h2("6.6 EMBEDDABLE JS WIDGET & E-COMMERCE MODULE")
    add_p("Purpose: Provides zero-friction integration for any merchant website or e-commerce storefront.")
    add_bullet("Universal Script Injection: Merchants simply insert `<script src=\"https://.../sales-widget.js\"></script>` into their website HTML.")
    add_bullet("Isolated Shadow DOM Styling: Widget CSS is scoped to prevent font or color inheritance conflicts with the host website's stylesheet.")
    add_bullet("Shopify Storefront Integration: Direct inventory binding with Shopify stores (e.g., `anything-q8y2pnzh.myshopify.com`) and standalone web demo storefronts.")
    add_bullet("Responsive Mobile UI: Floating action button expands into an elegant modal optimized for desktop screens and full-height mobile viewports.")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 7: TESTING
    # ==========================================
    add_chapter_title_page(7, "Testing", [
        "Black-Box Testing",
        "White-Box Testing",
        "Test Cases"
    ])

    add_h2("7.1 BLACK-BOX TESTING")
    add_h3("7.1.1 Introduction")
    add_p("Black-box testing focuses on validating the software's functional behavior from an external end-user perspective without inspecting internal code logic or data structures. For the AI Sales Agent SaaS Platform, black-box testing verified user authentication, widget rendering, natural language sales dialogues, dynamic coupon generation, voice recording, and lead scoring.")

    add_h3("7.1.2 Scope of Black-Box Testing")
    add_bullet("Merchant Authentication & Admin Login: Validating login with authorized and unauthorized credentials.")
    add_bullet("Widget Lifecycle: Floating launcher button click, modal expansion, minimizing, and message rendering.")
    add_bullet("Conversational Sales Flow: Asking product inquiries and verifying accurate pricing (₹) and feature descriptions.")
    add_bullet("Objection & Negotiation Triggers: Stating 'too expensive' and verifying that Alex offers the 15% discount code.")
    add_bullet("Microphone Speech Input: Speaking into the microphone and verifying correct transcription in the input box.")
    add_bullet("Lead Scoring Output: Verifying that completed conversations appear in the Admin Portal with correct BANT tags.")

    add_h3("7.1.3 Black-Box Testing Techniques Used")
    add_bullet("Equivalence Partitioning (EP): Partitioning input test data into valid and invalid classes (e.g., valid vs. expired discount codes; valid email formats).")
    add_bullet("Boundary Value Analysis (BVA): Testing edge cases such as budget boundaries (₹0, ₹100,000), chat message character limits (0 characters, 1,000 characters).")
    add_bullet("Error Guessing: Simulating user edge cases such as typing emoji-only messages, abrupt browser refreshes during voice capture, and network disconnections.")

    add_h3("7.1.4 Black-Box Testing Results")
    add_bullet("The platform consistently distinguished valid and invalid inputs across all test scenarios.")
    add_bullet("Product recommendations adhered strictly to catalog data with accurate INR pricing.")
    add_bullet("The 15% promotional discount reliably triggered upon simulated customer price hesitation.")
    add_bullet("Voice speech-to-text successfully transcribed English and Hindi test phrases on Chromium browsers.")

    add_h2("7.2 WHITE-BOX TESTING")
    add_h3("7.2.1 Introduction")
    add_p("White-box testing examines the internal structure, control flow, algorithms, and data structures of the software. For the AI Sales Agent platform, white-box testing verified Express.js API endpoint routing, CORS headers, RAG context assembly, LLM token handling, and BANT scoring calculation logic.")

    add_h3("7.2.2 Scope of White-Box Testing")
    add_bullet("API Middleware: Verifying JSON body-parser limits, CORS header injection, and error-handling middleware.")
    add_bullet("RAG Search Algorithm: Validating that product chunking routines accurately retrieve top-matching items from memory.")
    add_bullet("Prompt Template Synthesis: Ensuring system instructions, catalog context, and user history concatenate without truncation.")
    add_bullet("Session Management: Verifying that distinct browser sessions maintain isolated chat histories without cross-tenant memory leakage.")

    add_h3("7.2.3 White-Box Testing Methods Used")
    add_bullet("1. Statement Coverage: Executing unit tests to guarantee 100% of Node.js route handlers and controller functions were executed.")
    add_bullet("2. Branch Coverage: Validating all conditional branches (e.g., if LLM API succeeds -> return 200 with AI reply; if LLM API times out -> return graceful fallback response).")
    add_bullet("3. Data Flow Testing: Verifying that user input variables are properly sanitized, passed to the Gemini API, and returned to client without mutation.")
    add_bullet("4. Path Coverage: Tracing end-to-end execution paths from client HTTP POST request through Gemini SDK to HTTP JSON response.")

    add_h3("7.2.4 White-Box Testing Results")
    add_bullet("All Express route handlers executed without unhandled promise rejections or memory leaks.")
    add_bullet("Fallback mechanisms executed reliably when simulated network drops were introduced.")
    add_bullet("Tenant session data remained strictly isolated in memory.")

    add_h2("7.3 TEST CASES")
    add_h3("7.3.1 Test Case Descriptions")
    add_p("The following 10 formal test cases were executed to rigorously validate system functionality:")

    test_cases = [
        ("TC-01", "Merchant Admin Login with Valid Credentials", "Enter registered username and valid password on Admin Portal.", "System authenticates credentials, initializes merchant session, and redirects to Dashboard.", "Pass"),
        ("TC-02", "Merchant Admin Login with Invalid Credentials", "Enter valid username with incorrect password.", "System denies access, displays 'Invalid credentials' error message, and retains user on login screen.", "Pass"),
        ("TC-03", "AI Agent Product Inquiry (Apex Pro Headphones)", "Shopper types: 'Tell me about the Apex Pro Wireless Headphones.'", "Alex responds with battery life (40 hrs), ANC features, and original price ₹14,999 (Offer ₹12,749).", "Pass"),
        ("TC-04", "Objection Handling & 15% Discount Negotiation", "Shopper replies: 'That is way too expensive for my budget.'", "Alex acknowledges price, highlights build quality/warranty, and unlocks 15% discount code 'APEX15'.", "Pass"),
        ("TC-05", "Voice Input Capture via Web Speech API", "User clicks microphone icon and speaks: 'Show me smartwatches under 20000 rupees.'", "Speech transcribed in input box; Alex recommends Apex Ultra Smartwatch 2 priced at ₹19,999 (Offer ₹16,999).", "Pass"),
        ("TC-06", "Catalog RAG Grounding & Hallucination Prevention", "User asks: 'Do you sell Apple iPhone 15 Pro Max?'", "Alex consults catalog, confirms store specializes in Apex audio/wearables, and politely clarifies phone is not in stock.", "Pass"),
        ("TC-07", "Automated BANT Lead Scoring Calculation", "User provides budget (₹15,000), immediate buying timeline ('today'), and decision authority.", "System scores lead as 90/100, assigns 'Hot Lead' status, and logs lead to Admin Leads Table.", "Pass"),
        ("TC-08", "Multilingual Query Processing (Hindi/Hinglish)", "User types: 'Ye soundbar me bass kaisa hai aur warranty kitni hai?'", "Alex responds in polite conversational Hinglish explaining 7.1 surround sound bass and 1-year warranty.", "Pass"),
        ("TC-09", "Universal JavaScript Widget Embed Injection", "Load external test HTML page containing `<script src='sales-widget.js'>`.", "Widget renders floating sales avatar; clicking opens responsive chat window matching host dimensions.", "Pass"),
        ("TC-10", "Shopify Live Inventory Synchronization", "Query live inventory endpoint for Shopify store (`anything-q8y2pnzh.myshopify.com`).", "Endpoint returns valid JSON array of active products, stock statuses, and prices in Indian Rupees.", "Pass")
    ]

    tbl_tc = doc.add_table(rows=len(test_cases) + 1, cols=5)
    tbl_tc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_tc.columns[0].width = Inches(0.8)
    tbl_tc.columns[1].width = Inches(1.8)
    tbl_tc.columns[2].width = Inches(1.8)
    tbl_tc.columns[3].width = Inches(1.8)
    tbl_tc.columns[4].width = Inches(0.8)
    set_table_borders(tbl_tc, color="CBD5E1", sz="4")

    tcheaders = tbl_tc.rows[0].cells
    tcheaders[0].text = "Test ID"
    tcheaders[1].text = "Test Case Title"
    tcheaders[2].text = "Input / Action"
    tcheaders[3].text = "Expected Result"
    tcheaders[4].text = "Result"
    for c in tcheaders:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 70, 70, 60, 60)

    for i, (tcid, tctitle, tcinput, tcexp, tcres) in enumerate(test_cases):
        row = tbl_tc.rows[i+1].cells
        row[0].text = tcid
        row[1].text = tctitle
        row[2].text = tcinput
        row[3].text = tcexp
        row[4].text = tcres
        row[0].paragraphs[0].runs[0].font.bold = True
        row[4].paragraphs[0].runs[0].font.bold = True
        for c in row:
            set_cell_margins(c, 50, 50, 60, 60)

    p_tab3 = doc.add_paragraph()
    p_tab3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t3 = p_tab3.add_run("Table 7.1 Functional Black-Box & White-Box Test Cases\n")
    r_t3.font.italic = True
    r_t3.font.bold = True

    doc.add_page_break()

    # ==========================================
    # CHAPTER 8: SYSTEM DESIGN
    # ==========================================
    add_chapter_title_page(8, "System Design", [
        "Class Diagram",
        "Use-Case Diagram",
        "Sequence Diagram",
        "Activity Diagram",
        "Data Flow Diagram"
    ])

    base_dir = os.path.dirname(os.path.abspath(__file__))
    diag_dir = os.path.join(base_dir, "diagrams")

    add_h2("8.1 CLASS DIAGRAM")
    p_img1 = doc.add_paragraph()
    p_img1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_picture(os.path.join(diag_dir, "class_diagram.png"), width=Inches(6.5))

    p_f1 = doc.add_paragraph()
    p_f1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f1 = p_f1.add_run("Figure 8.1 Class Diagram\n")
    r_f1.font.italic = True
    r_f1.font.bold = True

    doc.add_page_break()

    add_h2("8.2 USE-CASE DIAGRAM")
    p_img2 = doc.add_paragraph()
    p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_picture(os.path.join(diag_dir, "use_case_diagram.png"), width=Inches(6.5))

    p_f2 = doc.add_paragraph()
    p_f2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f2 = p_f2.add_run("FIGURE 8.2 USE-CASE DIAGRAM\n")
    r_f2.font.italic = True
    r_f2.font.bold = True

    doc.add_page_break()

    add_h2("8.3 SEQUENCE DIAGRAM")
    p_img3 = doc.add_paragraph()
    p_img3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_picture(os.path.join(diag_dir, "sequence_diagram.png"), width=Inches(6.5))

    p_f3 = doc.add_paragraph()
    p_f3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f3 = p_f3.add_run("FIGURE 8.3 SEQUENCE DIAGRAM\n")
    r_f3.font.italic = True
    r_f3.font.bold = True

    doc.add_page_break()

    add_h2("8.4 ACTIVITY DIAGRAM")
    p_img4 = doc.add_paragraph()
    p_img4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_picture(os.path.join(diag_dir, "activity_diagram.png"), width=Inches(6.5))

    p_f4 = doc.add_paragraph()
    p_f4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f4 = p_f4.add_run("Figure 8.4 Activity Diagram\n")
    r_f4.font.italic = True
    r_f4.font.bold = True

    doc.add_page_break()

    add_h2("8.5 DATA FLOW DIAGRAM")
    p_img5 = doc.add_paragraph()
    p_img5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_picture(os.path.join(diag_dir, "data_flow_diagram.png"), width=Inches(6.5))

    p_f5 = doc.add_paragraph()
    p_f5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f5 = p_f5.add_run("Figure 8.5 Data Flow Diagram\n")
    r_f5.font.italic = True
    r_f5.font.bold = True

    doc.add_page_break()

    # ==========================================
    # CHAPTER 9: LIMITATIONS & FUTURE ENHANCEMENTS
    # ==========================================
    add_chapter_title_page(9, "Limitations & Future Enhancements", [
        "Limitations",
        "Future Enhancements"
    ])

    add_h2("9.1 LIMITATIONS")
    add_p("Despite achieving robust conversational closing capabilities, several engineering and infrastructural limitations remain:")
    add_h3("9.1.1 Dependency on Third-Party LLM APIs")
    add_p("The platform relies on the Google Gemini Flash API for natural language generation. Network throttling, cloud outage, or policy shifts by upstream providers can impact conversational response latency.")
    add_h3("9.1.2 Requirement of Stable Internet Connectivity")
    add_p("Because real-time LLM inference and speech synthesis require cloud communication, users with weak cellular connections (<256 Kbps) may experience audio lag.")
    add_h3("9.1.3 Browser Voice Support Disparities")
    add_p("While Chromium-based browsers (Chrome, Edge) support the Web Speech API natively, certain legacy desktop browsers require manual microphone permission grants.")
    add_h3("9.1.4 Catalog Size Constraints in Memory")
    add_p("Large catalogs exceeding 5,000 distinct SKUs require distributed vector databases rather than in-memory arrays to prevent memory bottlenecks.")
    add_h3("9.1.5 Lack of Real-Time Payment Terminal inside Chat")
    add_p("Shoppers are currently redirected to merchant checkout links rather than completing one-click UPI/card payments inside the chat bubble.")
    add_h3("9.1.6 Limited Offline Caching")
    add_p("Conversational history is lost if a visitor closes their browser without saving their lead profile.")
    add_h3("9.1.7 Fixed Discount Heuristics")
    add_p("The current negotiation engine issues a preset 15% discount rather than dynamically optimizing discount margins based on customer lifetime value.")

    add_h2("9.2 FUTURE ENHANCEMENTS")
    add_bullet("9.2.1 In-Chat Direct UPI & Card Payments: Integrating Razorpay and Stripe directly inside the chat window for 1-click frictionless checkout.")
    add_bullet("9.2.2 Multimodal Visual Search: Allowing shoppers to upload photos of outfits or electronics to find visual matches in the merchant catalog.")
    add_bullet("9.2.3 WhatsApp Business API Synchronization: Deploying Alex as an automated WhatsApp sales agent for direct customer follow-ups and abandoned cart recovery.")
    add_bullet("9.2.4 Distributed Vector DB (Milvus / Pinecone): Enabling instant semantic search across enterprise catalogs with 100,000+ items.")
    add_bullet("9.2.5 Dynamic Margin-Based Negotiation: Allowing the AI closer to calculate real-time gross margin and counter-offer tiered discounts.")
    add_bullet("9.2.6 AI Voice Avatar Streaming: Integrating realistic lip-synced video avatars to act as interactive virtual store consultants.")
    add_bullet("9.2.7 Automatic Dialect Recognition: Real-time adaptation between English, Tamil, Telugu, Marathi, and Gujarati.")
    add_bullet("9.2.8 Automated CRM Webhooks: Direct bi-directional synchronization with HubSpot, Salesforce, and Zoho CRM.")
    add_bullet("9.2.9 Offline PWA Support: Service worker caching to allow offline catalog browsing and draft lead creation.")
    add_bullet("9.2.10 Multi-Agent Collaboration: Deploying specialized agents (Alex for closing, Technical Specialist for complex specs, Support Agent for post-order tracking).")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 10: CONCLUSION
    # ==========================================
    add_chapter_title_page(10, "Conclusion", [
        "Conclusion"
    ])

    add_h2("10.1 CONCLUSION")
    add_p("The AI-Powered Autonomous Sales Agent SaaS Platform successfully demonstrates the transformative potential of combining generative artificial intelligence with conversational e-commerce. By transitioning from passive, static product displays and deterministic chatbots to an active, persuasive sales closer ('Alex'), the system directly addresses the root causes of e-commerce cart abandonment and lost revenue.")
    add_p("Through modules such as Dynamic RAG Catalog Ingestion, Web Speech API Voice Recognition, Automated BANT Lead Qualification, and Universal JavaScript Widget Embedding, the platform delivers enterprise-grade sales capabilities to modern merchants. Rigorous black-box and white-box testing confirmed that the system maintains factual pricing integrity in Indian Rupees (₹), negotiates urgency-driven discounts effectively, and deploys seamlessly across diverse web environments.")

    add_h3("Outcomes of the Project")
    add_bullet("Technical Outcome: Successful architecture and cloud deployment of a scalable Node.js/Express and Google Gemini LLM application with low latency (<1.2s), dynamic vector chunking, and isolated JavaScript widget injection.")
    add_bullet("Academic Outcome: Mastered advanced software engineering paradigms, Agile sprint lifecycles, UML modeling, BANT qualification heuristics, and formal verification methodologies.")
    add_bullet("Commercial & Social Outcome: Delivers a cost-effective, 24/7 sales workforce for small and medium enterprises, lowering customer acquisition costs and creating an accessible, voice-driven shopping experience for all demographics.")

    doc.add_page_break()

    # ==========================================
    # CHAPTER 11: APPENDICES
    # ==========================================
    add_chapter_title_page(11, "Appendices", [
        "Business Model & Pricing Strategy",
        "Product Deployment Detail",
        "API and Web Service Details"
    ])

    add_h2("11.1 BUSINESS MODEL & PRICING STRATEGY")
    add_p("The commercial model of the platform is designed as a tiered Software-as-a-Service (SaaS) subscription denominated in Indian Rupees (INR / ₹) with clear value propositions for varying business scales.")

    pricing_data = [
        ("Starter Tier", "₹2,499 / month", "Up to 1,000 chat sessions/month, 1 store domain, standard catalog RAG (PDF/JSON), email support."),
        ("Growth Tier", "₹5,999 / month", "Up to 5,000 chat sessions/month, 3 store domains, voice input, dynamic discount closer, BANT lead scoring, Shopify sync."),
        ("Enterprise Tier", "₹12,499 / month", "Unlimited sessions, custom sales persona training, multi-language voice, dedicated CRM webhooks, 99.9% uptime SLA.")
    ]
    tbl_pr = doc.add_table(rows=len(pricing_data) + 1, cols=3)
    tbl_pr.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_pr.columns[0].width = Inches(1.8)
    tbl_pr.columns[1].width = Inches(1.8)
    tbl_pr.columns[2].width = Inches(3.0)
    set_table_borders(tbl_pr, color="CBD5E1", sz="4")

    prheaders = tbl_pr.rows[0].cells
    prheaders[0].text = "TIER"
    prheaders[1].text = "PRICING (INR)"
    prheaders[2].text = "INCLUDED CAPABILITIES"
    for c in prheaders:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 70, 70, 80, 80)

    for i, (tname, tprice, tdesc) in enumerate(pricing_data):
        row = tbl_pr.rows[i+1].cells
        row[0].text = tname
        row[1].text = tprice
        row[2].text = tdesc
        row[0].paragraphs[0].runs[0].font.bold = True
        for c in row:
            set_cell_margins(c, 50, 50, 80, 80)

    p_tab4 = doc.add_paragraph()
    p_tab4.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t4 = p_tab4.add_run("Table 11.1 SaaS Commercial Pricing Model (INR / ₹)\n")
    r_t4.font.italic = True
    r_t4.font.bold = True

    add_h2("11.2 PRODUCT DEPLOYMENT DETAIL")
    add_p("The platform is deployed across modern cloud infrastructure ensuring high availability, continuous integration, and secure SSL/TLS communication.")

    deploy_data = [
        ("Production SaaS Platform", "https://ai-sales-agent-platform.vercel.app", "Primary cloud host running Node.js/Express application container."),
        ("Live Storefront Demo", "https://ai-sales-agent-platform.vercel.app/visitor-demo.html", "Interactive e-commerce storefront with integrated Alex sales closer."),
        ("Shopify Storefront", "https://anything-q8y2pnzh.myshopify.com", "Production Shopify store integrated with inventory sync."),
        ("GitHub Source Repository", "https://github.com/zala275/ai-sales-agent-platform", "Master Git version control repository containing full codebase.")
    ]
    tbl_dp = doc.add_table(rows=len(deploy_data) + 1, cols=3)
    tbl_dp.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_dp.columns[0].width = Inches(2.2)
    tbl_dp.columns[1].width = Inches(2.5)
    tbl_dp.columns[2].width = Inches(2.0)
    set_table_borders(tbl_dp, color="CBD5E1", sz="4")

    dpheaders = tbl_dp.rows[0].cells
    dpheaders[0].text = "SERVICE / ENVIRONMENT"
    dpheaders[1].text = "URL / ENDPOINT"
    dpheaders[2].text = "DESCRIPTION"
    for c in dpheaders:
        c.paragraphs[0].runs[0].font.bold = True
        set_cell_background(c, "E8EEF5")
        set_cell_margins(c, 70, 70, 80, 80)

    for i, (sname, surl, sdesc) in enumerate(deploy_data):
        row = tbl_dp.rows[i+1].cells
        row[0].text = sname
        row[1].text = surl
        row[2].text = sdesc
        row[0].paragraphs[0].runs[0].font.bold = True
        for c in row:
            set_cell_margins(c, 50, 50, 80, 80)

    p_tab5 = doc.add_paragraph()
    p_tab5.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t5 = p_tab5.add_run("Table 11.2 Cloud Deployment Endpoints & Repositories\n")
    r_t5.font.italic = True
    r_t5.font.bold = True

    add_h2("11.3 API AND WEB SERVICE DETAILS")
    add_bullet("1. Google Gemini Flash API: Primary conversational engine generating contextual answers based on injected prompt instructions.")
    add_bullet("2. W3C Web Speech API: Browser-native speech recognition enabling real-time audio capture and text transcription.")
    add_bullet("3. Shopify Storefront GraphQL API: Synchronizes catalog product titles, descriptions, prices (₹), and variant images.")
    add_bullet("4. Internal Express REST APIs:")
    add_bullet("   - `POST /api/chat`: Processes user query, searches catalog RAG, contacts LLM, and returns assistant reply with product cards.")
    add_bullet("   - `POST /api/catalog/upload`: Uploads and parses PDF/JSON catalogs into semantic search index.")
    add_bullet("   - `GET /api/leads`: Returns structured BANT lead records for merchant CRM export.")
    add_bullet("   - `GET /api/metrics`: Provides aggregated conversion and revenue analytics.")

    doc.add_page_break()

    # ==========================================
    # BIBLIOGRAPHY
    # ==========================================
    add_h1("BIBLIOGRAPHY")
    bib_entries = [
        "1. Sommerville, Ian. Software Engineering, 10th Edition, Pearson Education, 2016.",
        "2. Pressman, Roger S. Software Engineering: A Practitioner's Approach, McGraw Hill, 8th Edition, 2014.",
        "3. IEEE Standards Association. IEEE Std 829-2008 – Standard for Software and System Test Documentation.",
        "4. Bass, Len; Clements, Paul; and Kazman, Rick. Software Architecture in Practice, 3rd Edition, Addison Wesley, 2012.",
        "5. Myers, Glenford J. The Art of Software Testing, 3rd Edition, John Wiley & Sons, 2011.",
        "6. Martin, Robert C. Clean Code: A Handbook of Agile Software Craftsmanship, Prentice Hall, 2008.",
        "7. Fowler, Martin. UML Distilled: A Brief Guide to the Standard Object Modeling Language, 3rd Edition, Addison Wesley, 2004.",
        "8. Nielsen, Jakob. Usability Engineering, Academic Press, 1993.",
        "9. Cooper, Alan; Reimann, Robert; Cronin, Dave. About Face: The Essentials of Interaction Design, Wiley, 2007.",
        "10. Google AI for Developers: Gemini API Documentation and Guides, https://ai.google.dev",
        "11. W3C Web Speech API Specification: https://w3c.github.io/speech-api/",
        "12. Mozilla Developer Network (MDN) Web Docs: JavaScript, DOM, and Web APIs, https://developer.mozilla.org/",
        "13. Node.js Documentation and Architectural Runtime Guides: https://nodejs.org/docs/",
        "14. Express.js Fast, Unopinionated Minimalist Web Framework Documentation: https://expressjs.com/",
        "15. Shopify Developer Documentation: Storefront API & Admin REST References, https://shopify.dev/",
        "16. Vaswani, Ashish, et al. 'Attention Is All You Need.' Advances in Neural Information Processing Systems (NeurIPS), 2017.",
        "17. Lewis, Patrick, et al. 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.' NeurIPS, 2020.",
        "18. Cialdini, Robert B. Influence: The Psychology of Persuasion, Harper Business, 2006.",
        "19. Fogg, B.J. Persuasive Technology: Using Computers to Change What We Think and Do, Morgan Kaufmann, 2002.",
        "20. Agile Alliance. What is Agile Software Development? https://www.agilealliance.org/",
        "21. ISO/IEC 25010:2011 – Systems and Software Engineering – Systems and Software Quality Requirements and Evaluation (SQuaRE).",
        "22. Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John. Design Patterns: Elements of Reusable Object-Oriented Software, Addison-Wesley, 1994.",
        "23. Render Cloud Platform Documentation: Continuous Integration and Web Services, https://render.com/docs/",
        "24. Git Distributed Version Control System Manual: https://git-scm.com/doc",
        "25. World Wide Web Consortium (W3C). Web Content Accessibility Guidelines (WCAG) 2.1, https://www.w3.org/TR/WCAG21/"
    ]
    for b in bib_entries:
        p_b = doc.add_paragraph()
        p_b.paragraph_format.line_spacing = 1.2
        p_b.paragraph_format.space_after = Pt(4)
        p_b.add_run(b)

    # Save DOCX
    base_dir = os.path.dirname(os.path.abspath(__file__))
    out_docx_path = os.path.join(base_dir, "AI_Sales_Agent_Project_Report.docx")
    doc.save(out_docx_path)
    print(f"Successfully generated DOCX report at: {out_docx_path}")

    # Also save a copy on Desktop for easy access
    desktop_docx_path = r"C:\Users\Ghanshyam Zala\OneDrive\Desktop\AI_Sales_Agent_Project_Report.docx"
    try:
        doc.save(desktop_docx_path)
        print(f"Successfully saved copy on Desktop at: {desktop_docx_path}")
    except Exception as e:
        print(f"Could not save directly to Desktop: {e}")

    # Automatic PDF conversion
    try:
        import shutil
        from docx2pdf import convert
        out_pdf_path = os.path.join(base_dir, "AI_Sales_Agent_Project_Report.pdf")
        print("Converting Word document to PDF with diagrams and tables...")
        convert(out_docx_path, out_pdf_path)
        print(f"Successfully generated PDF report at: {out_pdf_path}")
        
        desktop_pdf_path = r"C:\Users\Ghanshyam Zala\OneDrive\Desktop\AI_Sales_Agent_Project_Report.pdf"
        shutil.copyfile(out_pdf_path, desktop_pdf_path)
        print(f"Successfully saved PDF on Desktop at: {desktop_pdf_path}")
        
        desktop_proj_pdf = r"C:\Users\Ghanshyam Zala\OneDrive\Desktop\AI-Sales-Agent-Project\AI_Sales_Agent_Project_Report.pdf"
        shutil.copyfile(out_pdf_path, desktop_proj_pdf)
    except Exception as e:
        print(f"PDF conversion note: {e}")

if __name__ == "__main__":
    create_report()
