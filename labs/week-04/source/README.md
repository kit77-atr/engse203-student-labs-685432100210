# ENGSE203 LAB 4 — Student Evidence README

## ผู้จัดทำ

- ชื่อ–นามสกุล: กิตติภพ สว่างเจริญทรัพย์
- รหัสนักศึกษา: 68543210021-0
- Section: SEC-2

## URLs

- Repository: https://github.com/kit77-atr/engse203-student-labs-685432100210
- Pull Request: https://github.com/kit77-atr/engse203-student-labs-685432100210/pull/5
- GitHub Pages: https://kit77-atr.github.io/engse203-student-labs-685432100210/

## Component Tree

```text
App (State Owner: requests, statusFilter)
├── AppHeader (Props: title, subtitle)
├── SummaryPanel (Props: summary)
├── RequestForm (State Owner: formData, errors, feedback; Callback: onAddRequest)
├── FilterBar (Props: value; Callback: onFilterChange)
└── RequestList (Props: requests; Callback: onDeleteRequest)
    └── RequestCard (Props: request; Callback: onDeleteRequest)
```

## Setup และ Run

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## State / Props / Callback Explanation

App เป็น state owner ของ requests และ statusFilter

- requests: รายการคำร้องทั้งหมด
- statusFilter: ตัวกรองสถานะ
- App คำนวณ summary และ filteredRequests จาก state
- App ส่ง summary ลงไปให้ SummaryPanel ผ่าน props
- App ส่ง onAddRequest ให้ RequestForm เพื่อรับข้อมูลคำร้องใหม่
- App ส่ง value และ onFilterChange ให้ FilterBar เพื่อควบคุมตัวกรอง
- App ส่ง requests และ onDeleteRequest ให้ RequestList
- RequestList ส่งข้อมูล request และ callback การลบต่อให้ RequestCard

RequestForm มี local state ของตัวเอง ได้แก่ formData, errors และ feedback
โดย formData เป็น controlled form และอัปเดตผ่าน handleChange
เมื่อ submit สำเร็จ RequestForm เรียก onAddRequest callback กลับไปที่ App

การไหลของข้อมูลเป็นแบบ State → Props ลงไปยัง child components
และ Callback → ส่งเหตุการณ์กลับขึ้นไปยัง App

## Test Evidence

| Test ID | Scenario | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|
| **TC-01** | Initial render | Render คำร้องเริ่มต้น 3 รายการ และ Summary แสดง (Total: 3, Pending: 1, In-Progress: 1, Completed: 1) โดยไม่มี error ใน console | แสดงคำร้อง 3 รายการ และสรุปจำนวนถูกต้อง ตรงตาม initialRequests | **PASS** | `evidence/desktop.png` |
| **TC-02** | Controlled input | ทุก input field (ชื่อ, ประเภท, สถานที่, รายละเอียด, priority) เปลี่ยนตาม React state (`formData`) | แบบฟอร์มตอบสนองทันทีตาม state ทุก field | **PASS** | `evidence/desktop.png` |
| **TC-03** | Invalid submit | เมื่อส่งแบบฟอร์มที่ไม่ผ่านกฎ validation จะไม่เพิ่มรายการ แสดงข้อความ error ใกล้ field และตั้ง `aria-invalid="true"` | ไม่เพิ่มรายการ แสดง error สีแดงใกล้ field และ input มีขอบสีแดงพร้อม aria-invalid | **PASS** | `evidence/validation-error.png` |
| **TC-04** | Valid submit | เมื่อกรอกข้อมูลถูกต้องและเพิ่มคำร้อง คำร้องใหม่จะอยู่ในสถานะ pending, summary เพิ่มขึ้น 1, และ reset แบบฟอร์มพร้อมแสดง feedback `role="status"` | เพิ่ม REQ-004 สถานะ pending สำเร็จ Summary total/pending เพิ่มขึ้น รูปแบบฟอร์มถูก reset | **PASS** | `evidence/success-result.png` |
| **TC-05** | Filter status | เมื่อเลือก filter แต่ละสถานะ (pending, in-progress, completed) จะแสดงเฉพาะคำร้องในสถานะที่เลือก | แสดงผลเฉพาะคำร้องในสถานะที่เลือกตรงตามปุ่ม active | **PASS** | `evidence/desktop.png` |
| **TC-06** | Return all | เมื่อเลือกปุ่ม filter "ทั้งหมด" จะแสดงคำร้องทุกสถานะ | แสดงคำร้องทั้งหมดกลับคืนมา | **PASS** | `evidence/desktop.png` |
| **TC-07** | Empty state | เมื่อเลือกสถานะที่ไม่มีรายการ หรือลบรายการจนหมด จะแสดงข้อความ empty state (`requests.length === 0`) | แสดงกล่อง empty state "ไม่พบรายการคำร้องที่ตรงตามเงื่อนไข" | **PASS** | `evidence/validation-error.png` |
| **TC-08** | Delete | เมื่อกดปุ่มลบคำร้อง คำร้องที่มี ID นั้นจะถูกลบออกด้วย immutable `.filter()`, Summary อัปเดต | คำร้องถูกลบตาม ID สรุปอัปเดตทันที รายการอื่นคงเดิม | **PASS** | `evidence/success-result.png` |
| **TC-09** | 375px responsive | UI ปรับขนาดรองรับหน้าจอสัมผัสขนาดเล็ก 375px โดยไม่มี horizontal scrollbar | Layout ปรับเป็นแนวตั้ง สวยงาม สมบูรณ์ ไม่ล้นจอ | **PASS** | `evidence/mobile-375.png` |
| **TC-10** | Keyboard accessibility | บังคับทิศทางด้วย Tab/Enter/Space บนปุ่มและแบบฟอร์มได้ถูกต้อง | Focus ring แสดงชัดเจน ปุ่มและแบบฟอร์มใช้งานด้วยคีย์บอร์ดได้ครบถ้วน | **PASS** | `evidence/desktop.png` |
| **TC-11** | Build & Check | `npm run check` และ `npm run build` ผ่าน 100% | Vite build สำเร็จโดยไม่มี error | **PASS** | Console output |
| **TC-12** | Pages Incognito | หน้ารวม Pages Hub และ Weekly Result โหลดครบถ้วนบน Incognito | โหลดสินทรัพย์ CSS/JS ถูกต้อง ไม่พบ HTTP 404 | **PASS** | Pages Hub URL |

## Screenshots

### 1. Desktop Interface Overview (`desktop.png`)
![Desktop UI](evidence/desktop.png)

### 2. Form Validation Error State (`validation-error.png`)
![Validation Error State](evidence/validation-error.png)

### 3. Valid Submission & Summary Update (`success-result.png`)
![Success Submission State](evidence/success-result.png)

### 4. Mobile 375px Responsive View (`mobile-375.png`)
![Mobile 375px View](evidence/mobile-375.png)

## Week 03 → Week 04 Reflection

ใน Week 03 การอัปเดต UI ต้องเข้าถึง DOM โดยตรง เช่น document.querySelector หรือ .innerHTML ซึ่งมีความซ้ำซ้อนและเสี่ยงต่อการหลุดของข้อมูล ใน Week 04 เมื่อเปลี่ยนเป็น State-driven UI ของ React การเปลี่ยนแปลงข้อมูล (State) จะส่งผลให้ React คำนวณ Virtual DOM และ re-render UI ที่เกี่ยวข้องให้อัตโนมัติ โดยเน้น One-Way Data Flow และ Immutable State ทำให้โค้ดมีความเป็นระเบียบ อ่านง่าย ปลอดภัย และทดสอบได้ง่ายยิ่งขึ้น

## AI / External Resource Disclosure

ใช้ ChatGPT เป็นเครื่องมือช่วยในการทำความเข้าใจและตรวจสอบโค้ด React ของ Lab 4 โดยใช้คำถามเกี่ยวกับการจัดการ State, Props, Callback และการจัดโครงสร้าง Component รวมถึงช่วยตรวจสอบและปรับปรุงเนื้อหาใน Student Evidence README

ส่วนที่นำมาปรับใช้ ได้แก่ แนวทางการอธิบาย State owner, การไหลของ Props และ Callback ระหว่าง Component และการจัดทำ Component Tree โดยนำมาปรับให้สอดคล้องกับโค้ดจริงของโปรเจกต์

ตรวจสอบความถูกต้องโดยเปรียบเทียบคำแนะนำกับโค้ดในไฟล์ App.jsx และ Components ต่าง ๆ รวมถึงรันคำสั่ง npm run check, npm run build และทดสอบการทำงานของเว็บด้วยตนเอง

