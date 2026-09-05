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

1. `npm install`
2. `npm run build` (ต้องตั้ง build command นี้ในหน้า Cloudflare Workers Builds)
3. เสิร์ฟโฟลเดอร์ `dist/` ตาม `wrangler.jsonc`

ถ้า `content/*.json` มีข้อความภาษาใดภาษาหนึ่งหาย build จะ **fail พร้อมบอกว่า key ไหน**
แทนที่จะ deploy หน้าที่พัง

## หมายเหตุ

- ฟอร์มขอใบเสนอราคาส่งไป Formspree (`https://formspree.io/f/xojgdqeq`) ซึ่ง forward ไป
  info@pettubtim.com — เว็บนี้ไม่มี backend ของตัวเอง
- ข้อความไทยของคำอธิบายขั้นตอนผลิตและใต้ใบรับรองสีเข้มกว่าภาษาอื่นมาแต่เดิม
  ตอนนี้เขียนเป็นกฎ CSS แล้ว (`.process-desc [data-l="th"]`, `.cert-note [data-l="th"]`)
  ลบทิ้งได้ถ้าอยากให้ทุกภาษาสีเดียวกัน
- ใบรับรองใบแรกมี `margin:-6px 0` ค้างมาจาก markup เดิม เก็บไว้เป็น
  `.cert-card:first-child .cert-img` ลบบรรทัดนั้นได้ถ้าอยากให้ทั้ง 3 ใบเท่ากัน
