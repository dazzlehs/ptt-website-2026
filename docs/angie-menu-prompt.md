# Prompt สำหรับ Angie (Elementor AI Agent) — สร้างเมนู One-Page แบบเดียวกับ webapp

เอกสารนี้เก็บ prompt ที่ใช้สั่ง **Angie** ของ Elementor ให้สร้าง header/เมนูลอย (floating pill nav)
ให้เหมือนกับเว็บแอปในโปรเจกต์นี้ (`index.html` + `css/style.css`) โดยเป็นเมนูของเว็บแบบ
one page ที่กดแล้วเลื่อน (smooth scroll) ไปยัง section ต่าง ๆ

## วิธีใช้
1. เปิดหน้า Elementor ของหน้า Home (หรือ Header template ถ้าใช้ Elementor Pro Theme Builder)
2. เปิด Angie แล้ววาง **prompt ด้านล่างทั้งบล็อก** (ใช้ภาษาไทยหรืออังกฤษก็ได้ เลือกอันใดอันหนึ่ง)
3. ก่อนสั่ง ให้แน่ใจว่าทุก section ในหน้ามี CSS ID ตรงตามตาราง (Angie จะลิงก์ไปยัง ID เหล่านี้)

## แผนผัง section / anchor ที่ต้องมี (ตรงกับ webapp เดิม)

| CSS ID (Elementor > Advanced > CSS ID) | Section | เมนูที่ชี้มา |
|---|---|---|
| `home` | Hero | โลโก้ |
| `about` | เกี่ยวกับเรา | เกี่ยวกับเรา / About |
| `products` | สินค้า / ขนาดบรรจุ | สินค้า / Products |
| `process` | กระบวนการผลิต | การผลิต / Process |
| `standards` | มาตรฐาน & ใบรับรอง | มาตรฐาน / Standards |
| `clients` | ลูกค้าของเรา | ลูกค้าของเรา (เฉพาะเมนูมือถือ) |
| `quote` | ฟอร์มขอใบเสนอราคา | ปุ่ม CTA "ขอใบเสนอราคา" |
| `contact` | ติดต่อเรา | ติดต่อ / Contact |

---

## PROMPT (ภาษาไทย) — คัดลอกทั้งบล็อกนี้ไปวางใน Angie

```text
ช่วยสร้าง Header เมนูแบบลอย (floating pill navigation) สำหรับเว็บไซต์ one page ของ
"น้ำดื่มเพชรทับทิม (บริษัท 4415 อินเตอร์ กรุ๊ป จำกัด)" ตามสเปกด้านล่างนี้ทุกข้อ

[รูปแบบโดยรวม]
- เป็น header ที่ fixed อยู่ด้านบนตลอดเวลา (sticky/floating) เว้นจากขอบบน 16px
  จัดกึ่งกลางหน้าจอ มี padding ซ้ายขวา 16px และ z-index สูงกว่าทุก section
- ตัวเมนูเป็นแคปซูล (pill) ก้อนเดียว: กว้างสูงสุด 1100px, width 100%,
  border-radius 999px, พื้นหลังกระจกโปร่ง rgba(6,22,34,0.74)
  พร้อม backdrop-filter: blur(18px) saturate(160%)
  ขอบ 1px rgba(255,255,255,0.13)
  เงา 0 24px 60px -24px rgba(0,0,0,0.65)
  padding 9px 10px 9px 18px
- จัดวางภายในเป็นแนวนอน: โลโก้ซ้าย | เมนูกลาง | ตัวเลือกภาษา + ปุ่ม CTA + ปุ่มแฮมเบอร์เกอร์ ขวา
- ฟอนต์: หัวข้อ/ปุ่มใช้ 'Prompt', เนื้อหา/เมนูใช้ 'Anuphan' (Google Fonts)
- สีหลัก (accent) #1AB1E7, accent เข้ม #0E93C7, พื้นหลังเข้ม #071E2E / #06202F

[โลโก้]
- อยู่ซ้ายสุด สูง 30px กว้าง auto เป็นโลโก้สีขาว
- คลิกแล้วเลื่อนกลับไปที่ section id "home" (ลิงก์ #home)

[รายการเมนูหลัก (เดสก์ท็อป)] — ทุกอันเป็น anchor link ในหน้าเดียวกัน
1. เกี่ยวกับเรา  -> #about
2. สินค้า      -> #products
3. การผลิต     -> #process
4. มาตรฐาน     -> #standards
5. ติดต่อ      -> #contact
- ระหว่างแต่ละเมนูให้มีเส้นคั่นแนวตั้ง กว้าง 1px สูง 16px สี rgba(255,255,255,0.22)
- ตัวอักษรเมนู: Anuphan, น้ำหนัก 500, ขนาด 16px, สี rgba(255,255,255,0.75)
  เมื่อ hover เปลี่ยนเป็นสีขาว #FFFFFF (transition นุ่ม ๆ ~0.2s)
- ระยะห่างระหว่างเมนู (gap) 22px

[ปุ่ม CTA]
- ข้อความ "ขอใบเสนอราคา" ลิงก์ไปที่ #quote
- พื้นหลัง #1AB1E7, ตัวอักษรสีขาว, border-radius 999px, padding 11px 20px,
  ฟอนต์ Anuphan น้ำหนัก 600 ขนาด 13.5px, hover ให้สว่างขึ้นเล็กน้อย (brightness 1.1)

[ตัวเลือกภาษา] (ถ้าเว็บมีระบบหลายภาษาแล้วให้ผูกกับระบบนั้น มิฉะนั้นทำเป็น dropdown ธรรมดา)
- ปุ่มโปร่งใส ขอบ 1px rgba(255,255,255,0.25), border-radius 999px, padding 8px 12px
  มีไอคอนลูกโลก + ข้อความภาษาปัจจุบัน + ลูกศรลง
- เมนูย่อยแบบ dropdown: ไทย / English / 中文 / 日本語
  พื้นหลัง rgba(6,22,34,0.97), blur, border-radius 15px, กว้างอย่างน้อย 158px
  มีเครื่องหมายถูกสี #1AB1E7 หน้าภาษาที่เลือกอยู่

[พฤติกรรมการเลื่อน — สำคัญที่สุด]
- ทุกเมนูต้องเป็น anchor link ภายในหน้าเดียวกัน (one page) ไม่ใช่ลิงก์ไปหน้าอื่น
- เมื่อคลิกต้อง smooth scroll เลื่อนไปยัง section ที่มี CSS ID ตรงกัน
  (home, about, products, process, standards, clients, quote, contact)
- ต้องมี scroll offset ประมาณ 90–100px เพื่อไม่ให้หัวข้อของ section ถูก header บัง
- เมนูของ section ที่กำลังอยู่ในจอ ให้แสดงสถานะ active (ตัวอักษรสีขาวเต็ม)
- header ต้องลอยอยู่ตลอดขณะเลื่อน ไม่หายไป

[เมนูมือถือ / แท็บเล็ต]
- ที่ความกว้างจอ 1020px ลงมา: ซ่อนรายการเมนูเดสก์ท็อปและปุ่ม CTA
  แล้วแสดงปุ่มแฮมเบอร์เกอร์ทรงกลม ขนาด 38x38px
  ขอบ 1px rgba(255,255,255,0.25), border-radius 999px, ไอคอน 3 ขีดสีขาว
- กดแล้วเปิดแผงเมนูแบบ dropdown: fixed ห่างจากด้านบน 78px, ซ้าย/ขวา 16px,
  พื้นหลัง rgba(6,22,34,0.96) + blur, ขอบ 1px rgba(255,255,255,0.12),
  border-radius 22px, padding 16px 22px, เงานุ่ม
- รายการในเมนูมือถือ (เรียงตามนี้ ตัวอักษรสีขาว Anuphan 500 ขนาด 16px
  padding 13px 4px มีเส้นคั่นล่าง 1px rgba(255,255,255,0.08) ทุกอันยกเว้นอันสุดท้าย):
  1. เกี่ยวกับเรา          -> #about
  2. สินค้า / ขนาดบรรจุ    -> #products
  3. กระบวนการผลิต        -> #process
  4. มาตรฐาน              -> #standards
  5. ลูกค้าของเรา          -> #clients
  6. ติดต่อเรา             -> #contact
- ปิดท้ายด้วยปุ่ม CTA เต็มความกว้าง "ขอใบเสนอราคา" -> #quote
  พื้นหลัง #1AB1E7 ตัวอักษร #06202F border-radius 999px padding 14px จัดกึ่งกลาง
- เมื่อกดเมนูข้อใดข้อหนึ่งแล้ว ให้ปิดแผงเมนูอัตโนมัติก่อนเลื่อนไปยัง section
- กดนอกแผงเมนู หรือกดปุ่มแฮมเบอร์เกอร์ซ้ำ ให้ปิดแผงเมนูเช่นกัน

[Accessibility]
- ปุ่มแฮมเบอร์เกอร์ต้องมี aria-label="menu" และ aria-expanded ที่ถูกต้อง
- ปุ่มเปลี่ยนภาษาต้องมี aria-label="Change language / เปลี่ยนภาษา"
- ทุกลิงก์ต้องโฟกัสด้วยคีย์บอร์ดได้ และมี focus outline ที่มองเห็นชัด

[ข้อกำหนดเพิ่มเติม]
- ห้ามสร้าง section ใหม่ ให้สร้างเฉพาะ header/เมนูเท่านั้น
- ใช้ section เดิมที่มี CSS ID อยู่แล้วเป็นปลายทางของลิงก์
- ต้อง responsive สวยงามทั้ง desktop / tablet / mobile
- ตรวจสอบว่าเมนูอ่านออกชัดเจนเมื่อวางทับ hero พื้นหลังสีเข้ม
```

---

## PROMPT (English) — ใช้แทนได้ถ้า Angie ตอบภาษาอังกฤษดีกว่า

```text
Build a floating pill-shaped sticky header/navigation for a one-page website
("Pettubtim Drinking Water by 4415 Inter Group Co., Ltd.") with these exact specs:

LAYOUT
- Fixed header, 16px from the top, horizontally centered, 16px side padding, high z-index.
- Single pill container: max-width 1100px, width 100%, border-radius 999px,
  background rgba(6,22,34,0.74), backdrop-filter blur(18px) saturate(160%),
  1px border rgba(255,255,255,0.13), shadow 0 24px 60px -24px rgba(0,0,0,0.65),
  padding 9px 10px 9px 18px.
- Row layout: logo left | nav links center | language switcher + CTA + hamburger right.
- Fonts: 'Prompt' for headings/buttons, 'Anuphan' for body/nav. Accent #1AB1E7.

LOGO
- White logo, 30px tall, links to #home.

DESKTOP NAV LINKS (all same-page anchors)
  About / เกี่ยวกับเรา -> #about
  Products / สินค้า -> #products
  Process / การผลิต -> #process
  Standards / มาตรฐาน -> #standards
  Contact / ติดต่อ -> #contact
- 1px x 16px vertical dividers rgba(255,255,255,0.22) between items, 22px gap.
- Link style: Anuphan 500 16px, color rgba(255,255,255,0.75), hover #FFFFFF.

CTA BUTTON
- "ขอใบเสนอราคา / Get a quote" -> #quote. Background #1AB1E7, white text,
  radius 999px, padding 11px 20px, Anuphan 600 13.5px, hover brightness 1.1.

LANGUAGE SWITCHER
- Transparent pill button with globe icon + current language + chevron,
  1px border rgba(255,255,255,0.25), padding 8px 12px.
- Dropdown: ไทย / English / 中文 / 日本語, background rgba(6,22,34,0.97) with blur,
  radius 15px, min-width 158px, #1AB1E7 check mark on the active language.

SCROLL BEHAVIOUR (most important)
- Every menu item is an in-page anchor, never a link to another page.
- Clicking smooth-scrolls to the section with the matching CSS ID:
  home, about, products, process, standards, clients, quote, contact.
- Apply a scroll offset of ~90-100px so the fixed header never covers section headings.
- Highlight the link of the section currently in view (full white).
- The header stays visible the whole time while scrolling.

MOBILE / TABLET (<= 1020px)
- Hide desktop links and the CTA; show a round 38x38px hamburger button,
  1px border rgba(255,255,255,0.25), radius 999px, white 3-line icon.
- It opens a dropdown panel: fixed, top 78px, left/right 16px,
  background rgba(6,22,34,0.96) + blur, 1px border rgba(255,255,255,0.12),
  radius 22px, padding 16px 22px, soft shadow.
- Items (white, Anuphan 500 16px, padding 13px 4px, 1px bottom divider
  rgba(255,255,255,0.08) except the last):
  About -> #about, Products -> #products, Process -> #process,
  Standards -> #standards, Clients -> #clients, Contact -> #contact
- Ends with a full-width CTA "ขอใบเสนอราคา" -> #quote,
  background #1AB1E7, text #06202F, radius 999px, padding 14px, centered.
- Tapping any item closes the panel before scrolling; tapping outside or the
  hamburger again also closes it.

ACCESSIBILITY
- Hamburger: aria-label="menu" with correct aria-expanded.
- Language button: aria-label="Change language / เปลี่ยนภาษา".
- All links keyboard focusable with a visible focus ring.

CONSTRAINTS
- Create only the header/navigation. Do not create or modify page sections.
- Link to the existing sections by their CSS IDs.
- Must be fully responsive and legible over the dark hero background.
```

---

## เช็กลิสต์หลัง Angie สร้างเสร็จ
- [ ] ทุก section มี CSS ID ครบตามตารางด้านบน (ไม่มี `#` นำหน้าในช่อง CSS ID)
- [ ] คลิกทุกเมนูแล้วเลื่อนไปถูก section และหัวข้อไม่ถูก header บัง
- [ ] ปุ่ม "ขอใบเสนอราคา" ทั้งบนเดสก์ท็อปและมือถือ ไปที่ `#quote`
- [ ] ที่จอ ≤1020px เมนูเดสก์ท็อปถูกซ่อน และแฮมเบอร์เกอร์ทำงาน
- [ ] กดเมนูในมือถือแล้วแผงปิดเองก่อนเลื่อน
- [ ] header ลอยอยู่ตลอด ไม่บังเนื้อหาสำคัญ และอ่านชัดบนพื้น hero สีเข้ม
- [ ] ตัวเลือกภาษาเปลี่ยนภาษาได้ครบ 4 ภาษา (ถ้าใช้ระบบหลายภาษา)
