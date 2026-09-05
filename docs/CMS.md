# แก้เนื้อหาเว็บผ่าน /admin

เว็บนี้ใช้ [Sveltia CMS](https://github.com/sveltia/sveltia-cms) ซึ่ง **ไม่มี server ของตัวเอง**
มันเป็นหน้าเว็บที่รันในเบราว์เซอร์แล้ว commit ไฟล์ `content/*.json` เข้า GitHub โดยตรง
จากนั้น Cloudflare เห็น commit ใหม่ → build → เว็บอัปเดต

```
/admin  ──commit──>  GitHub (master)  ──webhook──>  Cloudflare build  ──>  เว็บจริง
```

ไม่มีฐานข้อมูล ไม่มีปลั๊กอินให้อัปเดต ไม่มีหน้า login ให้โดนเจาะ — สิทธิ์แก้เว็บ
คือสิทธิ์ push เข้า repo นี้เท่านั้น

## ตั้งค่าครั้งแรก

เลือกวิธี sign in อย่างใดอย่างหนึ่ง

### วิธีที่ 1 — Personal Access Token (ตั้งค่า 2 นาที เหมาะถ้าคุณแก้เองคนเดียว)

1. เปิด https://github.com/settings/tokens → **Generate new token (classic)**
2. ติ๊ก scope `repo` อย่างเดียว ตั้งอายุตามต้องการ
3. เปิด `https://<โดเมนเว็บ>/admin` → กด **Sign In Using Access Token** → วาง token

token เก็บอยู่ในเบราว์เซอร์เครื่องนั้น ไม่ได้ถูกส่งไปที่ไหนนอกจาก GitHub API

### วิธีที่ 2 — ปุ่ม "Sign In with GitHub" (เหมาะถ้าให้พนักงานหลายคนแก้)

ต้อง deploy OAuth worker ของ Sveltia เองหนึ่งตัว

1. deploy https://github.com/sveltia/sveltia-cms-auth ขึ้น Cloudflare Workers
2. สร้าง GitHub OAuth App (Settings → Developer settings → OAuth Apps)
   ตั้ง callback URL เป็น `https://<worker>.workers.dev/callback`
3. ใส่ `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` เป็น secret ของ worker
4. ใน `admin/config.yml` เอา comment ออกแล้วใส่ URL ของ worker

```yaml
backend:
  name: github
  repo: dazzlehs/ptt-website-2026
  branch: master
  base_url: https://<worker>.workers.dev
```

หลังจากนั้นใครก็ตามที่มีสิทธิ์ push เข้า repo นี้จะ sign in ได้เลย ไม่ต้องแจก token

## แก้เนื้อหาแบบไม่ต้อง deploy (ทดลองในเครื่อง)

```bash
npm install
npx @sveltia/cms-proxy-server     # terminal ที่ 1
npm run build && npm run serve    # terminal ที่ 2
```

เปิด http://localhost:8420/admin แล้วกด **Work with Local Repository**
การแก้จะเขียนลงไฟล์ `content/*.json` ในเครื่องตรง ๆ ยังไม่ push ที่ไหน

## หน้าตาของเนื้อหา

เมนูซ้ายมือแบ่งตามส่วนของหน้าเว็บ

| หัวข้อใน CMS | ไฟล์ | แก้อะไรได้ |
|---|---|---|
| เมนูด้านบน / เมนูมือถือ | `content/header.json`, `content/menu.json` | ชื่อเมนู |
| หน้าแรก / Hero | `content/home.json` | พาดหัว, คำโปรย, ปุ่ม, ตัวเลขสถิติ |
| แถบข้อความวิ่ง | `content/marquee.json` | ข้อความที่วิ่งใต้ hero |
| เกี่ยวกับเรา | `content/about.json` | เนื้อหาบริษัท |
| สินค้า | `content/products.json` | ถัง 18.9L + **รายการขนาดบรรจุ** (เพิ่ม/ลบขนาดได้) |
| กระบวนการผลิต | `content/process.json` | **6 ขั้นตอน** (เพิ่ม/ลบ/สลับลำดับ/เปลี่ยนรูปได้ เลขขั้นตอนรันให้เอง) |
| มาตรฐาน & ใบรับรอง | `content/standards.json` | **รายการใบรับรอง** (เพิ่มใบใหม่พร้อมรูปได้) |
| ลูกค้าของเรา | `content/clients.json` | **โลโก้ลูกค้า 21 ราย** (เพิ่ม/ลบ/สลับลำดับ, เลือกขนาดโลโก้บนการ์ด) |
| ฟอร์มขอใบเสนอราคา | `content/quote.json` | ป้ายกำกับช่องกรอก, ข้อความสำเร็จ/ผิดพลาด |
| ติดต่อเรา | `content/contact.json` | ที่อยู่, เวลาทำการ, เบอร์โทร, อีเมล |
| ส่วนท้ายเว็บ | `content/footer.json` | ข้อความท้ายเว็บ |

ทุกข้อความมี 4 ช่อง: ไทย / English / 中文 / 日本語 — **ต้องกรอกครบทั้ง 4**
ถ้าเว้นว่าง build จะ fail และเว็บจะไม่อัปเดต (ของเดิมยังอยู่ ไม่พัง)

## ข้อควรระวัง

- บางช่องมีแท็ก HTML ปนอยู่ เช่น `<br>` หรือ `<strong>` ระบบจะขึ้นคำเตือนไว้ให้
  **แก้เฉพาะตัวอักษร อย่าลบแท็ก** ถ้าลบแล้วหน้าตาจะเพี้ยน
- อัปโหลดรูปใหม่จะไปอยู่ใน `assets/` ตั้งชื่อไฟล์เป็นภาษาอังกฤษ ไม่มีเว้นวรรค
- โลโก้ลูกค้าควรเป็น PNG/SVG พื้นหลังโปร่ง ตัดขอบขาวออกให้ชิดตัวโลโก้
  ถ้าโลโก้ดูใหญ่/เล็กเกินไปบนการ์ด ปรับที่ช่อง "ขนาดโลโก้บนการ์ด"
- หลังกด Publish ต้องรอ Cloudflare build ประมาณ 1–2 นาที เว็บจริงถึงจะเปลี่ยน

## ถ้าอยากเพิ่มข้อความใหม่ที่ยังไม่มีใน CMS

1. เพิ่ม key ใหม่ใน `content/<section>.json` พร้อมครบ 4 ภาษา
2. ใส่ token `{{t:<section>.<key>}}` ลงใน `src/index.html` ตรงที่ต้องการ
3. เพิ่ม field เดียวกันใน `admin/config.yml` เพื่อให้แก้ผ่าน CMS ได้
