# น้ำดื่มตราเพชรทับทิม — เว็บไซต์

เว็บ static ภาษาเดียวหน้าเดียว รองรับ 4 ภาษา (ไทย / English / 中文 / 日本語)
deploy บน Cloudflare Workers

## โครงสร้าง

```
src/index.html      โครงหน้าเว็บ (layout) — ไม่มีข้อความจริงอยู่ในนี้
content/*.json      ข้อความทุกภาษา + รายการโลโก้ลูกค้า / ขั้นตอนผลิต / ใบรับรอง / ขนาดบรรจุ
css/style.css       สไตล์ทั้งหมด
js/main.js          สลับภาษา, เมนู, ฟอร์ม, lightbox
assets/             รูปภาพ
admin/              หน้า /admin สำหรับแก้เนื้อหา (Sveltia CMS)
build.mjs           ประกอบ src + content -> dist/
dist/               ผลลัพธ์ที่ deploy จริง (ไม่ commit)
```

`src/index.html` ไม่มีข้อความจริง มีแต่ token `{{t:home.02}}` ซึ่ง `build.mjs`
แทนที่ด้วย `<span data-l="th">…</span><span data-l="en">…</span>…` ตอน build
ทำให้ทุกภาษาอยู่ใน HTML ที่ส่งออกไปจริง — Google เห็นข้อความไทยครบ ไม่เสีย SEO

## รันเครื่องตัวเอง

```bash
npm install
npm run build       # สร้าง dist/
npm run serve       # เปิด http://localhost:8420
```

แก้ `src/index.html`, `css/style.css` หรือ `content/*.json` แล้ว `npm run build` ใหม่

## แก้เนื้อหาโดยไม่ต้องแตะโค้ด

เปิด `/admin` บนเว็บที่ deploy แล้ว ดูวิธีตั้งค่าและใช้งานที่ [docs/CMS.md](docs/CMS.md)

## Deploy

Cloudflare Workers ผูกกับ GitHub อยู่แล้ว — push ขึ้น `master` แล้วมันจะ

1. `npm clean-install`
2. `npx wrangler versions upload` ซึ่งจะรัน `build.command` ใน `wrangler.jsonc`
   (คือ `npm run build`) ให้เองก่อน upload
3. เสิร์ฟโฟลเดอร์ `dist/` ตาม `assets.directory`

ไม่ต้องตั้ง build command ในหน้า Cloudflare dashboard — `wrangler.jsonc` จัดการให้แล้ว

ถ้า `content/*.json` มีข้อความภาษาใดภาษาหนึ่งหาย build จะ **fail พร้อมบอกว่า key ไหน**
แทนที่จะ deploy หน้าที่พัง

## SEO / Google Ads

- `build.mjs` สร้าง `robots.txt` และ `sitemap.xml` ลง `dist/` ทุกครั้งที่ build
  โดเมนหลักตั้งไว้ที่ค่าคงที่ `SITE_URL` ใน `build.mjs` (ตอนนี้ `https://pettubtim.com`)
  ถ้าย้ายโดเมนให้แก้ที่เดียวตรงนั้น แล้วแก้ค่า `canonical` / `og:*` ใน `src/index.html` ให้ตรงกัน
- `wrangler.jsonc` ตั้ง `not_found_handling: "single-page-application"` — ทุก path
  ที่ไม่มีไฟล์จริงจะเสิร์ฟ `index.html` (HTTP 200) แทน 404 กันปัญหา Google Ads ตีกลับ
  ว่า "ปลายทางใช้งานไม่ได้ 404" เวลา Final URL มี tracking path หรือ path แปลกปลอมติดมา
- `src/index.html` มี `<link rel=canonical>`, Open Graph/Twitter และ JSON-LD
  (Organization + LocalBusiness) สำหรับ rich result และ local SEO — แก้ที่อยู่/เบอร์/เวลาทำการ
  ในบล็อก `application/ld+json` ให้ตรงกับ `content/contact.json` ถ้ามีการเปลี่ยน

- **หน้าพื้นที่ (local SEO)** — `content/areas.json` + `src/area.html` สร้างหน้า
  `/area/<slug>/` ภาษาไทยหนึ่งหน้าต่อหนึ่ง keyword (น้ำดื่มฉะเชิงเทรา/แปดริ้ว, ชลบุรี, อมตะ, เวลโกรว์,
  เกตเวย์, บางพลี, เอเชีย, ทีเอฟดี) พร้อม title/description/H1/FAQ ของตัวเอง, JSON-LD
  (Service + BreadcrumbList + FAQPage) และถูกใส่ใน `sitemap.xml` อัตโนมัติ หน้าแรกลิงก์ไปทุกหน้า
  ในส่วน "พื้นที่ให้บริการ" (`#areas`) และมีส่วนคำถามที่พบบ่อย (`#faq`, `content/faq.json`) พร้อม FAQPage JSON-LD เพิ่ม/แก้พื้นที่ได้ใน /admin — ขั้นตอนนอกเว็บดูที่
  [docs/SEO.md](docs/SEO.md)

## หมายเหตุ

- ฟอร์มขอใบเสนอราคาส่งไป Formspree (`https://formspree.io/f/xojgdqeq`) ซึ่ง forward ไป
  info@pettubtim.com — เว็บนี้ไม่มี backend ของตัวเอง
- ข้อความไทยของคำอธิบายขั้นตอนผลิตและใต้ใบรับรองสีเข้มกว่าภาษาอื่นมาแต่เดิม
  ตอนนี้เขียนเป็นกฎ CSS แล้ว (`.process-desc [data-l="th"]`, `.cert-note [data-l="th"]`)
  ลบทิ้งได้ถ้าอยากให้ทุกภาษาสีเดียวกัน
- ใบรับรองใบแรกมี `margin:-6px 0` ค้างมาจาก markup เดิม เก็บไว้เป็น
  `.cert-card:first-child .cert-img` ลบบรรทัดนั้นได้ถ้าอยากให้ทั้ง 3 ใบเท่ากัน
