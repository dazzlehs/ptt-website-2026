# Angie (Elementor v4.2.4) Prompt Pack — Pettubtim Drinking Water Website

A ready-to-paste prompt set for **Angie**, the AI agent in Elementor 4.2.4, to build a
WordPress site that matches the `ptt-website-2026` design (one-page, 4 languages, Elementor Pro widgets).

**How to use:** send §0 (Master Brief) once, then send §1–§12 one section at a time.
Angie is far more accurate when instructed block by block — do not paste everything at once.

> **Note on copy:** all *instructions* are English. The *site copy itself stays in Thai*, because
> Thai is the site's primary language (English/Chinese/Japanese come later via Polylang in §12).
> Thai strings are quoted verbatim from `index.html` — paste them as-is.

**Before you start**
- Theme: Hello Elementor / Hello Biz + Elementor Pro (needs Form, Google Maps and Lightbox widgets)
- Translation plugin: Polylang (or WPML) with th / en / zh / ja, **th as the default language**
- Upload every image from `assets/` into the Media Library first, keeping the original filenames
- Fonts: install the Google Fonts Prompt, Anuphan, Noto Sans SC, Noto Sans JP
- Paste `docs/angie-global.css` into Site Settings → Custom CSS before you start (see §0.5)

---

## §0 · MASTER BRIEF (send this first)

```
You are building a single-page WordPress landing site for
"Pettubtim" drinking water, produced by 4415 Inter Group Co., Ltd.
They manufacture bottled and 18.9L-gallon drinking water and deliver to industrial
factories across Chachoengsao, Chonburi and Samut Prakan provinces in Thailand.

Audience: factory procurement teams, offices, government agencies.
Goal of the site: get the visitor to request a quote — every section must funnel to the #quote form.
The site copy is in Thai. Keep all Thai text exactly as I give it to you.

=== DESIGN SYSTEM (use these values everywhere, do not substitute) ===
Global Colors:
  Primary / Accent   #1AB1E7   (water blue — buttons, numbers, highlights)
  Accent Deep        #0E93C7
  Accent Light       #7FD9F7   (text on dark backgrounds, heading gradients)
  Ink / Navy Deep    #050E18   (darkest background)
  Navy               #071E2E   (main dark background)
  Navy Soft          #0C3A54   (gradient end)
  Text Dark          #0A1B28   (text on light backgrounds)
  Text Muted Dark    #41586A
  Text on Navy       #AECBDC / #8FAEC2 (body copy on dark)
  Surface            #FAFDFF   (main light background)
  Surface Alt        #F0F7FB   (alternating light background)
  Border Light       #E2ECF3 / #D7E2EB

Global Fonts:
  Headings (H1–H3) = 'Prompt', sans-serif, weight 700, letter-spacing -0.015em, line-height 1.06–1.2
  Body / nav / buttons = 'Anuphan', sans-serif, weight 400–600, line-height 1.75
  Chinese = 'Noto Sans SC' · Japanese = 'Noto Sans JP' (set as the fallback stack for those languages)
  H1: clamp(40px, 5.6vw, 76px) · H2: clamp(32px, 3.6vw, 52px) · body: clamp(16px, 1.5vw, 19px)

Overall style:
- Modern, clean, airy — "water + globally certified factory", not a retail shop look
- Every button is a pill: border-radius 999px, padding 17px 32px. Primary button = #1AB1E7
  background with #06202F text, shadow 0 16px 40px -12px rgba(26,177,231,.65), hover brightness(1.12)
- Cards on light backgrounds: white fill, 1px #E2ECF3 border, radius 16–24px, very soft shadow
- Cards on dark backgrounds: glassmorphism — rgba(255,255,255,.055) + backdrop-blur(8px)
  + rgba(255,255,255,.15) border + radius 24–30px
- Alternate section backgrounds: light (#FAFDFF) → dark gradient (#071E2E → #0C3A54) → light → #F0F7FB → light
- Section padding: desktop 120–130px 32px · mobile 64px 20px
- Every section fades up on scroll (translateY 26px → 0, 0.8s, cubic-bezier(.16,.84,.44,1)). Keep it subtle.
- Must be genuinely responsive: no horizontal scroll on desktop, tablet or mobile

=== PAGE STRUCTURE (in this order) ===
1. Sticky floating navbar (pill shaped)
2. Hero (full viewport, dark)
3. Marquee strip of certification claims
4. About
5. Products / pack sizes (dark)
6. Process — 6 production steps
7. Standards & certificates (with lightbox)
8. Clients — 21 logos
9. Quote — request form (Elementor Pro Form widget)
10. Contact + Google Maps
11. Footer

=== MULTILINGUAL ===
Build the Thai page first. I will supply the EN / 中文 / 日本語 copy afterwards, section by section.
Structure it so Polylang can translate it: every text block must be its own widget —
never stack multiple languages inside one block.

Do not build anything yet. Confirm you have the design system, then wait for my next section.
```

---

## §0.5 · GLOBAL CSS (do this right after §0 — once, reused site-wide)

Before prompting any section, open **Elementor → Site Settings → Custom CSS**
and paste the whole of [`angie-global.css`](./angie-global.css) in by hand — faster and more
accurate than having Angie retype it.

That file gives you three reusable layers:
1. **CSS custom properties** — `--accent`, `--navy`, `--radius-pill`, `--shadow-btn`, …
   Change a brand colour once at `:root` and the whole site follows.
2. **Utility classes** — type the class name into a widget's Advanced → CSS Classes field
   instead of restyling every widget by hand.
3. **Keyframes + responsive rules + reduced-motion** — written once, applied everywhere.

Then send Angie this prompt:

```
I have installed a global stylesheet under Site Settings → Custom CSS.
From now on, **do not re-type raw values** (hex colours, radii, shadows, fonts) in any section.
Apply the class names below in each widget's Advanced → CSS Classes field instead:

  .ptt-section                every section (controls mobile padding)
  .ptt-btn .ptt-btn--primary  primary button (blue fill)
  .ptt-btn .ptt-btn--ghost    secondary button (transparent, white border)
  .ptt-btn--sm                small button in the navbar
  .ptt-card                   cards on light backgrounds (about, certificates, contact, form)
  .ptt-glass                  glass cards on dark backgrounds (hero, products)
  .ptt-eyebrow                the small label above each H2
  .ptt-eyebrow--on-dark       eyebrow on a dark background
  .ptt-gradient-text          the gradient H1 line
  .ptt-num / .ptt-num--xl     large numerals (hero stats, 18.9, pack sizes)
  .ptt-stats                  the three-stat row in the hero
  .ptt-logo-tile              client logo tile
  .ptt-reveal                 anything that should fade up on scroll
  .ptt-ripple / .ptt-dot      hero ripple rings / pulsing badge dot
  .ptt-marquee / .ptt-marquee__track   the scrolling strip
  .ptt-form                   the quote Form widget

When you need a colour, reference the variable — var(--accent), not #1AB1E7.
If you need a style that has no class yet, tell me and I will add it to the global CSS.
Do not create duplicate custom CSS at widget level.
```

**Note:** `.ptt-reveal` needs a small IntersectionObserver to add the `.in-view` class
(put it in Elementor → Custom Code, or the footer):
```js
new IntersectionObserver((es,o)=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in-view');o.unobserve(e.target)}
}),{threshold:.15}).observe // bind to every .ptt-reveal
```
If you would rather avoid JS, use Elementor's Motion Effects → Entrance Animation and skip `.ptt-reveal`.

---

## §1 · NAVBAR (Header template)

```
Create a sticky Header template for the whole site:
- Floating pill: position fixed, top 16px, max-width 1100px, horizontally centred
- Fill rgba(6,22,34,.74) + backdrop-blur(18px) saturate(160%), 1px rgba(255,255,255,.13) border,
  radius 999px, padding 9px 10px 9px 18px, shadow 0 24px 60px -24px rgba(0,0,0,.65)
- Left: logo_white.png at 30px height, links to #home
- Centre: anchor menu — เกี่ยวกับเรา(#about) · สินค้า(#products) · การผลิต(#process) ·
  มาตรฐาน(#standards) · ติดต่อ(#contact)
  Anuphan 500 16px, colour rgba(255,255,255,.75), hover #fff
  Separate each item with a 1x16px vertical rule in rgba(255,255,255,.22)
- Right: language switcher (globe icon + current language + dropdown ไทย / English / 中文 / 日本語,
  wired to Polylang), then a CTA button "ขอใบเสนอราคา" — pill, #1AB1E7 fill, white 600 13.5px, links to #quote
- Below 1020px: hide the menu and the CTA, show a 38px circular hamburger button instead.
  It opens a full-width panel (rgba(6,22,34,.96), radius 22px) with the menu items stacked
  vertically and divided by faint rules, ending in a full-width "ขอใบเสนอราคา" button.
```

---

## §2 · HERO

```
Build the Hero section:
- min-height 100vh, padding 150px 32px 110px, white text
- Background linear-gradient(180deg,#050E18 0%,#071E2E 45%,#0C3A54 100%)
  overlaid with radial glows: rgba(26,177,231,.22) top-right and rgba(26,177,231,.10) bottom-left
- Water ripple effect: three transparent circles with rgba(127,217,247,.4/.3/.22) borders,
  scaling from .55 to 1.7 while fading out over 7s, looping forever, staggered 2.3s apart,
  positioned behind the product image

Two-column layout (1.08fr / .92fr, gap 70px) — collapses to one column on mobile

Left column:
- Pill badge: pulsing #1AB1E7 dot + the text "ISO 22000:2018 · HACCP · GHPs"
  fill rgba(26,177,231,.10), border rgba(127,217,247,.35), text #7FD9F7 at 13px
- H1: "น้ำดื่มเพชรทับทิม / สะอาด ปลอดภัย / ผ่านมาตรฐานสากล"
  Render the "สะอาด ปลอดภัย ผ่านมาตรฐานสากล" lines as gradient text:
  linear-gradient(92deg,#1AB1E7 10%,#8FE4FF 90%)
- Paragraph (#AECBDC, max-width 530px):
  "น้ำดื่มเพชรทับทิม โดยบริษัท 4415 อินเตอร์ กรุ๊ป จำกัด ผลิตกว่า 20 ล้านลิตรต่อปี
   กรองละเอียดด้วยระบบ RO ฆ่าเชื้อด้วย UV และ Ozone ส่งตรงถึงบ้าน สำนักงาน
   โรงงานอุตสาหกรรม ในเขตพื้นที่จังหวัดฉะเชิงเทรา ชลบุรี และสมุทรปราการ"
- Two buttons: "ขอใบเสนอราคาฟรี" (#1AB1E7 fill → #quote) and
  "ดูสินค้าทั้งหมด" (ghost button, rgba(255,255,255,.28) border → #products)
- Stat row of three, separated from the buttons by a top rule in rgba(255,255,255,.12):
  30+ ปีประสบการณ์ | 20M+ ลิตรต่อปี | 500+ ลูกค้าที่ใช้บริการ
  Numbers in Prompt 700 34px white, with the "+" sign in #1AB1E7
  Labels at 13.5px in #8FAEC2
  On mobile: force all three onto a single row (never wrap), shrink the numbers to 24px

Right column:
- Glass frame (fill rgba(255,255,255,.055) + blur 8px, border rgba(255,255,255,.15),
  radius 30px, padding 14px, shadow 0 50px 100px -40px rgba(0,0,0,.7))
  containing hero.png filling the frame, object-fit cover, aspect ratio 501:623, max-width 501px
```

---

## §3 · MARQUEE

```
Below the hero, add a continuously scrolling horizontal marquee with a seamless loop:
- Background #050E18, 1px rgba(127,217,247,.14) top and bottom borders, padding 20px 0
- Items separated by a ◆ glyph in #1AB1E7, with the whole set duplicated twice so the loop is seamless:
  ISO 22000:2018 ◆ ฆ่าเชื้อด้วย UV และ Ozone ◆ HACCP CODEX ◆ ลูกค้าใช้บริการมากกว่า 500 ราย
  ◆ GHPs CODEX ◆ พร้อมให้บริการลูกค้าโรงงานทุกขนาด ◆ RO 0.0001 MICRON ◆ ผลิตมากกว่า 20+ ล้านลิตรต่อปี
- Anuphan 500, ~14–15px, muted white, drifting right to left, slow, never stopping
```

---

## §4 · ABOUT

```
Create section id="about", background #FAFDFF, padding 130px 32px, scroll-margin-top 90px
- Small eyebrow in #1AB1E7: "เกี่ยวกับเรา"
- H2: "กว่า 30 ปี ที่โรงงานชั้นนำ ไว้วางใจน้ำดื่มของเรา" (colour #0A1B28)
- Two columns:
  Left — paragraph:
    "บริษัท 4415 อินเตอร์ กรุ๊ป จำกัด ก่อตั้งเมื่อเดือนมิถุนายน พ.ศ. 2536
     โรงงานตั้งอยู่ที่ ต.เทพราช อ.บ้านโพธิ์ จ.ฉะเชิงเทรา ผู้ผลิตและจำหน่ายน้ำดื่มตรา
     "เพชรทับทิม" ปัจจุบันผลิตกว่า 20 ล้านลิตรต่อปี ส่งให้บ้านพัก สำนักงาน
     หน่วยงานราชการ และโรงงานอุตสาหกรรม"
    followed by a blockquote accented in the primary colour:
    " ใส่ใจงานบริการ · มาตรฐานเป็นที่ยอมรับ · ปรับปรุงอย่างต่อเนื่อง "
  Right — two stacked cards (white fill, #E2ECF3 border, radius 20px, thin-line icon):
    "ประสบการณ์กว่า 30 ปี — ก่อตั้งตั้งแต่ปี พ.ศ. 2536"
    "ผลิต 20+ ล้านลิตร/ปี — ครอบคลุมฉะเชิงเทรา ชลบุรี สมุทรปราการ"
```

---

## §5 · PRODUCTS

```
Create section id="products", background linear-gradient(180deg,#071E2E,#0C3A54), white text, padding 120px 32px
- Eyebrow: "สินค้า" (in #7FD9F7)
- H2: "น้ำดื่มบรรจุถัง 18.9 ลิตร"
- Sub-paragraph: "พร้อมขนาดบรรจุอื่นครบทุกความต้องการ และรับผลิตติดแบรนด์ของคุณ (OEM)"

Hero product card (full-width glass card, two columns):
- Left: the product-gallon.png image
- Right: a "สินค้าหลักของเรา" tag, then a large "18.9" (Prompt 700, ~72px, white)
  followed by the unit "ลิตร" in #1AB1E7
  Kicker: "บรรจุในถังโพลีคาร์บอเนต ใช้งานได้ทั้งแบบเทและคว่ำตู้กดน้ำ"
  Paragraph: "ขนาดที่โรงงานอุตสาหกรรมเลือกใช้มากที่สุด คุ้มค่าที่สุดต่อลิตร
              พร้อมระบบจัดส่ง-เปลี่ยนถังถึงที่โดยรถขนส่งของเราเอง"
  Three checklist items (check icon in #1AB1E7):
   • ถังโพลีคาร์บอเนตใส แข็งแรง ทนทาน นำกลับมาใช้ซ้ำได้
   • ฝากดใช้ครั้งเดียว ปิดผนึกทุกถัง มั่นใจความสะอาด
   • ราคาพิเศษสำหรับลูกค้าโรงงาน ไม่ต้องมัดจำถังเมื่อมีทะเบียนบริษัท
  Button: "ขอใบเสนอราคาถัง 18.9L" → #quote

Below it: four pack-size cards (4-column grid, 2 columns on mobile), each a small glass card
showing the number + unit (Prompt 700, unit in #1AB1E7), then the name, then the packaging line:
  220 ml — น้ำดื่มแบบถ้วย — ถ้วย PP 48 ถ้วย/แพ็ค
  350 ml — ขวดขนาดพกพา — ขวด PET 12 ขวด/แพ็ค
  600 ml — ขวดมาตรฐาน — ขวด PET 12 ขวด/แพ็ค
  1500 ml — ขวดครอบครัว — ขวด PET 6 ขวด/แพ็ค
On mobile: merge the name and packaging lines onto one line separated by "·" so the cards get shorter
```

---

## §6 · PROCESS

```
Create section id="process", background #FAFDFF, padding 130px 32px
- Eyebrow: "กระบวนการผลิต" · H2: "6 ขั้นตอน สู่น้ำดื่มที่สะอาดปลอดภัย"
- Six cards in a 3-column grid (2 on tablet, 1 on mobile)
  Each card: process-1..6.jpg on top (16px top radius, 4:3 aspect, object-fit cover),
  with the step number 01–06 overlaid (Prompt 700, #1AB1E7, large, slightly transparent),
  then a title (Prompt 600 20px) and a description (Anuphan 400 15px, #41586A):

01 เลือกแหล่งน้ำดิบ — เราเลือกใช้น้ำประปาจากการประปาส่วนภูมิภาคมาเป็นน้ำดิบของเรา 100%
   น้ำประปานั้นมีการกรองและฆ่าเชื้อมาในขั้นต้นแล้ว เมื่อนำมาผลิตน้ำดื่มจะทำให้น้ำมีรสชาติดี ไม่กระด้าง
02 กรองขั้นต้น — น้ำประปาที่เข้ามาในระบบจะไหลผ่านสารกรองทั้ง 3 ชนิด ได้แก่ AFM, Carbon และ Resin
   เพื่อกำจัดสี ความขุ่น ความกระด้าง และสารแขวนลอยต่างๆ หลังกรองแล้วน้ำจะใส ไร้กลิ่น
03 กรอง RO 0.0001 ไมครอน — น้ำจะไหลเข้าสู่เครื่องกรองรีเวิร์สออสโมซิส (RO) เยื่อเมมเบรนละเอียด
   0.0001 ไมครอน กรองสารละลายเจือปน แร่ธาตุ โลหะหนัก สารเคมี คลอรีน เชื้อโรค ไวรัส และแบคทีเรีย
04 ฆ่าเชื้อด้วยแสง UV — น้ำไหลผ่านหลอดแก้วที่มีแสงอัลตราไวโอเลต ทำลายเซลล์แบคทีเรียและไวรัสได้ถึง
   99.99% เพื่อการันตีว่าไม่มีเชื้อโรคหลงเหลืออยู่ในน้ำก่อนถูกบรรจุ
05 ฆ่าเชื้อด้วยโอโซน — เติมน้ำโอโซน สารฆ่าเชื้อที่แรงและเร็วกว่าคลอรีนถึง 3,125 เท่า
   กำจัดกลิ่นและสารเคมีตกค้าง และสลายตัวไปเองโดยไม่ทิ้งพิษตกค้างในน้ำ
06 ล้าง & บรรจุอัตโนมัติ — ภาชนะบรรจุถูกล้างด้วยน้ำสะอาดก่อนบรรจุ กระบวนการบรรจุทำงานด้วย
   เครื่องจักรอัตโนมัติ 100% เพื่อลดการปนเปื้อนให้มากที่สุด

On mobile (≤640px): hide the descriptions by default, showing only the number and title with a
chevron-down icon. Tapping expands the description (accordion) and rotates the chevron 180°.
```

---

## §7 · STANDARDS

```
Create section id="standards", background #F0F7FB, padding 120px 32px
- Eyebrow: "มาตรฐาน & ใบรับรอง" · H2: "คุณภาพที่พิสูจน์ได้ด้วยใบรับรอง"
- Supporting line: "เอกสารรับรองฉบับจริง — คลิกที่รูปเพื่อขยายดูรายละเอียด"
- Three cards in a row (1 column on mobile), white fill, #E2ECF3 border, radius 20px:
  cert-iso.jpg   → ISO 22000:2018 — มาตรฐานระบบการจัดการความปลอดภัยของอาหารระดับสากล
  cert-haccp.jpg → HACCP Codex — ระบบวิเคราะห์และควบคุมจุดวิกฤตด้านความปลอดภัยอาหาร
  cert-ghps.jpg  → GHPs Codex — หลักปฏิบัติด้านสุขลักษณะที่ดีในการผลิตอาหาร
- Certificate images ~320px tall, object-fit cover (reduce to 220px on mobile)
- Enable the Elementor Lightbox so clicking an image opens it full-screen over
  an rgba(4,14,24,.88) blurred backdrop
```

---

## §8 · CLIENTS

```
Create section id="clients", background #FAFDFF, padding 110px 32px 60px
- Eyebrow: "ลูกค้าของเรา" · H2: "บริษัทชั้นนำที่ไว้วางใจเรา"
- Logo grid: lock to 7 columns on desktop and tablet (7x3), 3 columns on mobile, gap 14px
- Each cell is a white card 96px tall, 1px #E2ECF3 border, radius 16px, padding 16px,
  with the logo centred and object-fit contain
- Place these 21 logos in this order:
  PTT, Isuzu, Energy Absolute, Gulf, Idemitsu, Yazaki, Honda,
  Kubota, JTEKT, Nutrix, Autoliv, NGK, Unicharm, iSi Automotive,
  GPX, CTW, GS Battery, Unison, MINE Mobility, SYE, STEM
  (files are named client-<name>.png/.svg/.jpg in the Media Library)
```

---

## §9 · QUOTE FORM (Elementor Pro Form widget)

```
Create section id="quote", background #FAFDFF, two columns:

Left column:
- Eyebrow "ขอใบเสนอราคา"
- H2 "รับใบเสนอราคา ภายใน 24 ชั่วโมง" (emphasise "ภายใน 24 ชั่วโมง" in #1AB1E7)
- Paragraph "กรอกข้อมูลด้านขวา ทีมงานจะติดต่อกลับพร้อมราคาที่เหมาะกับปริมาณการใช้งานของคุณ"
- Clickable contact list with icons: 038-595-888 (tel:) · 085-275-5500 (tel:) ·
  info@pettubtim.com (mailto:) · LINE @pettubtim (https://lin.ee/Z9FLuA5)

Right column — an Elementor Pro **Form widget** inside a white card, radius 24px, soft shadow:
  Fields:
   1. ชื่อบริษัท / โรงงาน *   (text, required)
   2. ชื่อผู้ติดต่อ *          (text, required)
   3. เบอร์โทรศัพท์ *         (tel, required)
   4. อีเมล                    (email)
   5. สินค้าที่สนใจ            (select: ถ้วย 220 ml / ขวด 350 ml / ขวด 600 ml /
                                ขวด 1500 ml / ถัง 18.9 L / OEM ติดแบรนด์)
   6. ปริมาณต่อเดือน (โดยประมาณ) (text)
   7. ที่อยู่จัดส่ง             (textarea)
  Field styling: 1.5px #D7E2EB border, radius 12px, padding 13px 14px, Anuphan 15px,
                 focus state = 2px #1AB1E7 outline
  Submit button: "ส่งคำขอใบเสนอราคา", full width, pill, #1AB1E7 fill
  Actions After Submit: Email (to info@pettubtim.com) + Collect Submissions
  Success message: "ส่งคำขอเรียบร้อยแล้ว! ขอบคุณครับ ทีมงานเพชรทับทิมจะติดต่อกลับพร้อมใบเสนอราคาโดยเร็วที่สุด"
  Error message: "ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อเราที่ info@pettubtim.com"
  Small grey note under the form: "ข้อมูลของคุณจะถูกเก็บเป็นความลับ ใช้เพื่อการติดต่อกลับเท่านั้น"
  Enable reCAPTCHA v3 or a honeypot for spam protection
```

---

## §10 · CONTACT + FOOTER

```
Create section id="contact", background #FAFDFF, padding 40px 32px 120px — two columns

Left — a contact card (white fill, #E2ECF3 border, radius 24px) headed
"ติดต่อเรา / เราพร้อมให้บริการท่าน", with thin-line icons in #1AB1E7:
  ที่อยู่ — บริษัท 4415 อินเตอร์ กรุ๊ป จำกัด / 134/3-4 ม.2 ต.เทพราช อ.บ้านโพธิ์ / จ.ฉะเชิงเทรา 24140
  เวลาทำการ — วันจันทร์ - วันเสาร์ เวลา 07:30 - 16:30 น.
  โทรศัพท์ — 038-595-888 · 085-275-5500 (tel: links)
  อีเมล / LINE — info@pettubtim.com · LINE Official: @pettubtim (links to https://lin.ee/Z9FLuA5)
Ends with a "ขอใบเสนอราคา" button → #quote

Right — an Elementor **Google Maps widget** pinned to "บริษัท 4415 อินเตอร์ กรุ๊ป จำกัด"
(Thep Rat, Ban Pho, Chachoengsao), zoom 17, matching the height of the left card, radius 24px.
Below the map, a link "เปิดใน Google Maps →" pointing to https://maps.app.goo.gl/ZESrZKrAYPZutMFe7

Create a Footer template, background #050E18, white text, padding 64px 32px 24px:
- Column 1: logo_white.png + "น้ำดื่มตราเพชรทับทิม" +
  "เติมความสะอาดใสให้ชีวิต — ผู้ผลิตน้ำดื่มคุณภาพ รับรอง ISO 22000:2018 · HACCP · GHPs"
- Column 2: heading "ติดต่อ" — โทรศัพท์ 038-595-888 · 085-275-5500 /
  info@pettubtim.com / LINE: @pettubtim
- Column 3: the lineoa_qr.jpg QR code (~120px, radius 12px, white background)
  plus a "เพิ่มเพื่อน LINE" link/button → https://lin.ee/Z9FLuA5
- Bottom bar above a rgba(255,255,255,.1) rule:
  "© 2569 บริษัท 4415 อินเตอร์ กรุ๊ป จำกัด · สงวนลิขสิทธิ์"
```

---

## §11 · SEO + FINISHING (send last)

```
Configure SEO and finish the build:
- Title: "น้ำดื่มเพชรทับทิม | บริษัท 4415 อินเตอร์ กรุ๊ป จำกัด"
- Meta description: "น้ำดื่มตราเพชรทับทิม ผลิตโดยบริษัท 4415 อินเตอร์ กรุ๊ป จำกัด
  น้ำดื่มสะอาดรับรองมาตรฐาน ISO 22000:2018, HACCP และ GHPs ผลิตกว่า 20 ล้านลิตรต่อปี
  บริการส่งน้ำดื่มปริมาณมากถึงโรงงานในฉะเชิงเทรา ชลบุรี สมุทรปราการ ขอใบเสนอราคาฟรี โทร 038-595-888"
- Keywords / topics to rank for: น้ำดื่มโรงงาน, รับผลิตน้ำดื่ม, น้ำดื่มปริมาณมาก, น้ำดื่มถัง 18.9 ลิตร,
  น้ำดื่มตราเพชรทับทิม, ส่งน้ำดื่มโรงงาน ฉะเชิงเทรา, น้ำดื่ม ISO 22000 HACCP GHPs
- OG title: "น้ำดื่มตราเพชรทับทิม — น้ำดื่มมาตรฐานโรงงานอุตสาหกรรม"
- OG description: "ผู้ผลิตน้ำดื่มคุณภาพ รับรอง ISO 22000:2018, HACCP และ GHPs บริการส่งถึงโรงงาน ขอใบเสนอราคาได้ทันที"
- theme-color: #071E2E · favicon: favicon.png · lang="th"
- Add Schema.org LocalBusiness/Organization markup: company name, address, phone numbers,
  opening hours (Mon–Sat 07:30–16:30)
- Every image needs a Thai alt text and lazy loading, except the hero image
- Verify all three breakpoints: no horizontal scroll, tap targets at least 44px,
  and long unbroken Thai strings must still wrap inside grid columns (set min-width: 0 on grid children)
- Respect prefers-reduced-motion: disable the ripple, marquee and fade-up animations for users who set it
```

---

## §12 · TRANSLATIONS (after the Thai page is done)

Once the Thai page is complete, duplicate it in Polylang into en / zh / ja,
then send Angie this prompt on each language version:

```
Translate every piece of copy on this page into <English / Chinese (Simplified) / Japanese>,
keeping the layout, colours, fonts, sizes and images exactly as they are.
- Do NOT translate: the brand name "Pettubtim", standard names (ISO 22000:2018, HACCP, GHPs, RO),
  phone numbers, email addresses, the LINE ID, or client logo names
- Render the company name as "4415 Inter Group Co., Ltd."
- Switch the body font to Noto Sans SC (Chinese) or Noto Sans JP (Japanese)
- Target hero copy:
  EN: "Pettubtim drinking water, clean and safe, certified to global standards"
  ZH: "Pettubtim 饮用水，洁净 · 安全，符合国际标准"
  JA: "Pettubtim の飲料水、清潔・安全、国際基準に適合"
- Check that the longer strings (English especially) do not overflow buttons or cards
```

---

## Practical notes

- Angie is still weak at custom CSS animation. If the hero ripple or the marquee comes out wrong,
  add the CSS yourself under Elementor → Custom CSS on that section.
  Reference keyframes live in this project's `css/style.css`: `ripple`, `marqueeX`, `fadeUp`,
  `pulseDot`, `floatY`.
- For the gradient H1 line, use Elementor Heading → background-clip, or drop in the CSS:
  `background:linear-gradient(92deg,#1AB1E7 10%,#8FE4FF 90%);-webkit-background-clip:text;color:transparent`
- If Angie oversteps, re-prompt in one short sentence, e.g.
  "Only change the products section — leave every other section untouched."
