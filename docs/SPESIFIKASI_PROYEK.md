# Spesifikasi Fungsional & Teknis: Personal Job Application Tracker

Dokumen ini adalah acuan resmi arsitektur dan fungsionalitas aplikasi pelacak lowongan kerja pribadi (khusus pelamar kerja).

---

## 1. Kebutuhan Fungsional Utama (Core Requirements)

### 1.1 Manajemen Lowongan Kerja (CRUD)
- **Input Data Loker:**
  - Tautan link lowongan kerja asli (`job_url` - misal: link LinkedIn, Glints, Jobstreet, web karir).
  - Nama Perusahaan (`company_name`).
  - Posisi / Jabatan yang dilamar (`position`).
  - Platform asal (`platform` - LinkedIn, Glints, Jobstreet, Kalibrr, Website Perusahaan, dll).
  - Tipe kerja (`work_type` - Remote, Hybrid, On-Site).
  - Lokasi kantor (`location`).
  - Ekspektasi gaji / penawaran (`expected_salary`).
  - Versi CV/Resume yang digunakan (`resume_used`).
  - Kontak recruiter/HR (`hr_contact`).
  - Catatan bebas (`notes` - misal: kisi-kisi atau poin penting deskripsi pekerjaan).

### 1.2 Status Alur Lamaran (Workflow Status)
1. `WISHLIST`: Nemu loker menarik, disimpan dulu / belum sempat kirim.
2. `APPLIED`: Lamaran/email/form sudah terkirim ke perusahaan.
3. `TEST`: Mendapat panggilan tes teknis / koding / psikotes.
4. `INTERVIEW_HR`: Jadwal atau riwayat wawancara dengan HR.
5. `INTERVIEW_USER`: Jadwal atau riwayat wawancara dengan tim/user/lead.
6. `OFFERING`: Tahap penawaran gaji dan surat offering.
7. `ACCEPTED`: Penawaran diterima / deal mulai bekerja.
8. `REJECTED`: Ditolak / belum rezeki / ghosting.
9. `WITHDRAWN`: Mengundurkan diri / batal melamar.

### 1.3 Jadwal Wawancara & Tes
- Catat tanggal dan jam tes / wawancara.
- Simpan tautan panggilan video (`meeting_link` - Google Meet, Zoom, MS Teams).
- Catat nama interviewer dan pertanyaan/pembahasan yang ditanyakan saat sesi interview.

### 1.4 Keamanan & Privasi (RBAC & Data Isolation)
- **Data 100% Privat:** Setiap pelamar hanya dapat membaca dan memodifikasi data loker miliknya sendiri (`WHERE user_id = req.user.id`).
- **Autentikasi:** Register & Login berbasis JWT Token (Access Token & Refresh Token).
- **Role:**
  - `USER`: Pelamar (mengelola loker pribadi).
  - `ADMIN`: Mengelola platform asal loker & manajemen akun pengguna.

---

## 2. Tech Stack (LTS & Best Practice)

- **Backend:** Node.js 22 LTS, Express.js 4.21, TypeScript, Prisma ORM, Zod validator.
- **Database:** PostgreSQL 16.
- **Frontend:** Vue.js 3.5 (Composition API `<script setup>`), Vite, Pinia, Vue Router, Tailwind CSS, Lucide icons.
- **Deployment:** Docker & Docker Compose terpisah (`dev`, `staging`, `prod`).

---

## 3. Skema Data (Prisma ORM)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum RoleType {
  ADMIN
  USER
}

enum WorkType {
  REMOTE
  HYBRID
  ON_SITE
}

enum ApplicationStatus {
  WISHLIST
  APPLIED
  TEST
  INTERVIEW_HR
  INTERVIEW_USER
  OFFERING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum InterviewStage {
  HR_INTERVIEW
  TECH_TEST
  USER_INTERVIEW
  FINAL_INTERVIEW
  OTHER
}

model User {
  id           String           @id @default(uuid()) @db.Uuid
  role         RoleType         @default(USER)
  fullName     String           @map("full_name") @db.VarChar(150)
  email        String           @unique @db.VarChar(255)
  passwordHash String           @map("password_hash") @db.VarChar(255)
  isActive     Boolean          @default(true) @map("is_active")
  createdAt    DateTime         @default(now()) @map("created_at")
  updatedAt    DateTime         @updatedAt @map("updated_at")

  applications JobApplication[]

  @@map("users")
}

model JobPlatform {
  id           Int              @id @default(autoincrement())
  name         String           @unique @db.VarChar(100)
  url          String?          @db.VarChar(255)
  applications JobApplication[]

  @@map("job_platforms")
}

model JobApplication {
  id             String            @id @default(uuid()) @db.Uuid
  userId         String            @map("user_id") @db.Uuid
  platformId     Int?              @map("platform_id")
  companyName    String            @map("company_name") @db.VarChar(150)
  position       String            @db.VarChar(150)
  jobUrl         String?           @map("job_url") @db.Text
  location       String?           @db.VarChar(100)
  workType       WorkType          @default(REMOTE) @map("work_type")
  expectedSalary Decimal?          @map("expected_salary") @db.Decimal(12, 2)
  status         ApplicationStatus @default(WISHLIST)
  appliedDate    DateTime?         @map("applied_date") @db.Date
  deadline       DateTime?         @db.Date
  resumeUsed     String?           @map("resume_used") @db.VarChar(150)
  hrContact      String?           @map("hr_contact") @db.VarChar(150)
  notes          String?           @db.Text
  createdAt      DateTime          @default(now()) @map("created_at")
  updatedAt      DateTime          @updatedAt @map("updated_at")

  user           User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  platform       JobPlatform?      @relation(fields: [platformId], references: [id], onDelete: SetNull)
  interviews     Interview[]

  @@index([userId])
  @@index([userId, status])
  @@map("job_applications")
}

model Interview {
  id            String         @id @default(uuid()) @db.Uuid
  applicationId String         @map("application_id") @db.Uuid
  stage         InterviewStage @default(HR_INTERVIEW)
  scheduledAt   DateTime       @map("scheduled_at")
  meetingLink   String?        @map("meeting_link") @db.Text
  interviewer   String?        @db.VarChar(150)
  notes         String?        @db.Text
  isDone        Boolean        @default(false) @map("is_done")
  createdAt     DateTime       @default(now()) @map("created_at")

  application   JobApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@index([applicationId])
  @@map("interviews")
}
```

---

## 4. Rencana Pengerjaan Bertahap (Langkah 1 - 6)

Pengerjaan proyek diorganisasikan ke dalam 6 tahapan terstruktur dengan fokus fungsional:

### 🔹 Langkah 1: Setup Struktur Monorepo & Docker Dev Environment
- **Tujuan:** Membangun fondasi monorepo dan container development dengan live-reload.
- **Ruang Lingkup:**
  - Pembuatan direktori `backend/`, `frontend/`, `docker/`, dan `docs/`.
  - Konfigurasi `docker-compose.dev.yml` (PostgreSQL 16, Express Node 22, Vue 3 Vite).
  - Setup `.env.example`, `.env.development`, dan `.gitignore`.
  - Setup healthcheck database PostgreSQL.
- **Deliverable:** 3 container (`postgres`, `backend`, `frontend`) berjalan bersamaan, live-reload aktif, dan endpoint `GET /api/health` merespons `{"status": "ok"}`.
- **Dokumen Acuan:** `docs/LANGKAH_1_SETUP_DOCKER_DEV.md`.

---

### 🔹 Langkah 2: Backend Core, Database & Auth RBAC
- **Tujuan:** Menyediakan layanan autentikasi aman dengan isolasi data akun.
- **Ruang Lingkup:**
  - Inisialisasi Express.js + TypeScript + Prisma ORM di folder `backend/`.
  - Eksekusi migrasi skema database (User, JobPlatform, JobApplication, Interview).
  - Implementasi endpoint Autentikasi:
    - `POST /api/auth/register` (hashing password dengan bcrypt/argon2).
    - `POST /api/auth/login` (generate JWT Access Token & Refresh Token).
    - `GET /api/auth/me` (verifikasi profil pengguna aktif).
  - Middleware otorisasi `requireAuth` dan `requireRole(['ADMIN'])`.
  - Middleware isolasi data: memastikan pelamar hanya bisa mengakses record miliknya sendiri (`WHERE user_id = req.user.id`).
- **Deliverable:** Database ter-migrasi penuh, user bisa mendaftar dan login, token JWT tervalidasi.

---

### 🔹 Langkah 3: Backend REST API Fungsional (Loker & Wawancara)
- **Tujuan:** Menyediakan seluruh API bisnis untuk mencatat dan melacak lamaran kerja.
- **Ruang Lingkup:**
  - **CRUD Lowongan Kerja:**
    - `GET /api/jobs`: Mengambil daftar loker milik akun pelamar (dengan filter status, platform, search PT/posisi).
    - `POST /api/jobs`: Menambah loker baru (link lowongan, nama PT, posisi, gaji, tipe kerja, catatan).
    - `GET /api/jobs/:id`: Mengambil detail satu loker beserta riwayat interview.
    - `PUT /api/jobs/:id`: Update informasi lowongan.
    - `PATCH /api/jobs/:id/status`: Update cepat status tahapan (*Wishlist, Applied, Test, Interview HR/User, Offering, Accepted, Rejected*).
    - `DELETE /api/jobs/:id`: Hapus loker.
  - **Jadwal & Catatan Wawancara:**
    - `POST /api/jobs/:id/interviews`: Tambah jadwal tes/wawancara, link meeting (Google Meet/Zoom), interviewer.
    - `PUT /api/interviews/:id`: Update catatan hasil interview atau status selesai.
    - `DELETE /api/interviews/:id`: Hapus jadwal interview.
  - **Master Platform Sumber:**
    - `GET /api/platforms`: Daftar platform loker (LinkedIn, Glints, Jobstreet, dll).
- **Deliverable:** Seluruh endpoint fungsional pelamar tuntas dan teruji via Postman/cURL.

---

### 🔹 Langkah 4: Frontend Setup & Auth Flow (Vue 3)
- **Tujuan:** Membangun antarmuka awal dan sistem autentikasi di sisi klien.
- **Ruang Lingkup:**
  - Inisialisasi Vue 3.5 + Vite + TypeScript di folder `frontend/`.
  - Integrasi Tailwind CSS dan Lucide Icons (`lucide-vue-next`).
  - Setup Pinia store (`authStore`) untuk manajemen sesi, token, dan user profile.
  - Setup Vue Router dengan **Navigation Guards**:
    - Route publik: `/login`, `/register`.
    - Route terproteksi: `/dashboard`, `/jobs`, `/kanban`.
  - Implementasi Axios Interceptors untuk inject token `Bearer` otomatis dan intercept error `401 Unauthorized`.
  - Halaman UI Login & Registrasi yang responsif.
- **Deliverable:** Pengguna dapat mendaftar, login, dan diarahkan ke dashboard pelamar secara mulus.

---

### 🔹 Langkah 5: Frontend UI Fungsional Pelamar (Core Experience)
- **Tujuan:** Membangun pengalaman pengguna lengkap untuk pencatatan dan pemantauan lamaran kerja harian.
- **Ruang Lingkup:**
  - **Form Input Loker Cepat:** Modal/drawer untuk paste link loker, nama PT, posisi, estimasi gaji, dan status awal.
  - **Tampilan Kanban Board:**
    - Kolom status: *Wishlist*, *Terkirim (Applied)*, *Tes*, *Interview HR*, *Interview User*, *Offering*, *Accepted/Rejected*.
    - Kartu loker interaktif menampilkan nama PT, posisi, badge tipe kerja (Remote/WFO), tanggal apply, dan tombol link loker.
    - Interaktivitas drag-and-drop / tombol pindah status instan.
  - **Tampilan Tabel & Filter:**
    - Mode tabel lengkap dengan fitur sortir tanggal dan pencarian instan nama PT/posisi.
  - **Modal Detail Loker:**
    - Tautan satu klik membuka link postingan asli di tab baru.
    - Formulir penambahan jadwal interview (tanggal, jam, link Google Meet/Zoom).
    - Kotak catatan untuk kisi-kisi atau hasil wawancara.
- **Deliverable:** Seluruh alur fungsional pelamar selesai, interaktif, dan siap digunakan sehari-hari.

---

### 🔹 Langkah 6: Docker Staging & Production Hardening
- **Tujuan:** Menyiapkan konfigurasi deployment yang aman, efisien, dan siap hosting/VPS.
- **Ruang Lingkup:**
  - **Frontend Multi-stage Build (`frontend/Dockerfile`):**
    - Stage 1: Build aset statis Vue via Vite.
    - Stage 2: Serve via Nginx Alpine dengan kompresi Gzip dan fallback SPA routing.
  - **Backend Multi-stage Runner (`backend/Dockerfile`):**
    - Stage 1: TypeScript compilation & pruning `node_modules`.
    - Stage 2: Minimalist Node 22 Alpine runner dengan akun non-root (`USER node`).
  - **Nginx Reverse Proxy Gateway (`docker/nginx/default.conf`):**
    - Routing lalu lintas `/api/*` ke backend container.
    - Routing `/` ke frontend static web server.
    - Penambahan HTTP Security Headers (X-Frame-Options, X-Content-Type-Options, CSP dasar).
  - Penyusunan `docker-compose.staging.yml` dan `docker-compose.prod.yml`.
- **Deliverable:** Aplikasi siap dirilis ke server/VPS produksi dengan perintah tunggal `docker compose -f docker-compose.prod.yml up -d`.


