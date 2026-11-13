# Panduan Langkah 3: Backend REST API Fungsional (CRUD Loker & Wawancara)

Dokumen ini memuat dokumentasi lengkap endpoint REST API fungsional untuk **Manajemen Lowongan Kerja (Jobs)**, **Jadwal Wawancara (Interviews)**, dan **Platform Sumber**, yang dibangun menggunakan arsitektur **Modular OOP**.

---

## 1. Daftar Endpoint API Lengkap

Semua endpoint berikut (kecuali healthcheck) berada di balik `AuthMiddleware.authenticate`, mewajibkan header:
```http
Authorization: Bearer <TOKEN_JWT>
```

### 1.1 Modul Lowongan Kerja (`/api/jobs`)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/jobs` | Mengambil seluruh lowongan kerja milik akun pelamar (dengan opsi filter & search) |
| **GET** | `/api/jobs/stats` | Statistik agregat jumlah loker per status (*Wishlist, Applied, Interview, dll*) |
| **GET** | `/api/jobs/:id` | Detail lengkap satu loker beserta daftar jadwal interview terkait |
| **POST** | `/api/jobs` | Menambah catatan lowongan kerja baru |
| **PUT** | `/api/jobs/:id` | Memperbarui informasi data lowongan kerja |
| **PATCH**| `/api/jobs/:id/status` | Update cepat status alur lamaran (*drag-and-drop Kanban*) |
| **DELETE**| `/api/jobs/:id` | Menghapus catatan lowongan kerja (cascade ke interview) |

### 1.2 Modul Jadwal Wawancara (`/api/interviews`)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/interviews/job/:jobId` | Daftar seluruh jadwal interview untuk satu lowongan kerja |
| **POST** | `/api/interviews` | Menambah jadwal tes koding / wawancara HR / user baru |
| **PUT** | `/api/interviews/:id` | Memperbarui jadwal, link meeting, atau menandai selesai (`isDone: true`) |
| **DELETE**| `/api/interviews/:id` | Menghapus catatan jadwal interview |

### 1.3 Modul Platform Sumber (`/api/platforms`)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/platforms` | Mengambil master daftar platform (*LinkedIn, Glints, Jobstreet, dll*) |

---

## 2. Format Request & Contoh Payload

### 2.1 Tambah Lowongan Baru (`POST /api/jobs`)
```json
{
  "companyName": "Tech Nusantara Corp",
  "position": "Senior Fullstack Engineer",
  "jobUrl": "https://linkedin.com/jobs/view/123456",
  "platformId": 1,
  "location": "Jakarta (Remote)",
  "workType": "REMOTE",
  "expectedSalary": 18000000,
  "status": "WISHLIST",
  "notes": "Persiapkan portofolio Vue 3 dan Docker"
}
```

### 2.2 Update Status Cepat (`PATCH /api/jobs/:id/status`)
```json
{
  "status": "APPLIED"
}
```
*Catatan: Jika status diubah menjadi `APPLIED` dan tanggal apply belum diisi, sistem otomatis menyematkan tanggal hari ini (`appliedDate: now()`).*

### 2.3 Tambah Jadwal Interview (`POST /api/interviews`)
```json
{
  "applicationId": "03c798c4-94c9-4250-a869-6e782fd51ab0",
  "stage": "HR_INTERVIEW",
  "scheduledAt": "2026-11-20T07:00:00.000Z",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "interviewer": "Sarah (HR Lead)",
  "notes": "Wawancara perkenalan dan culture fit"
}
```

---

## 3. Fitur Filter & Pencarian (`GET /api/jobs`)

Endpoint `GET /api/jobs` mendukung query parameter fleksibel:
- `?status=APPLIED`: Filter berdasarkan status lamaran.
- `?workType=REMOTE`: Filter berdasarkan tipe kerja (*REMOTE, HYBRID, ON_SITE*).
- `?platformId=1`: Filter berdasarkan platform (misal: LinkedIn).
- `?search=Nusantara`: Pencarian bebas (*case-insensitive*) pada nama perusahaan, posisi, atau lokasi.

---

## 4. Keamanan & Isolasi Data Akun (Best Practice)

Setiap query di level `JobRepository` dan `InterviewRepository` memvalidasi `userId = req.user.id`. Akun pelamar lain tidak akan pernah bisa membaca, mengedit, atau menghapus data milik akun Anda meskipun mengetahui UUID-nya.

