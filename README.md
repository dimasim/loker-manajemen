# Personal Job Application Tracker (Pelacak Lowongan Kerja Pelamar)

Aplikasi web personal untuk membantu **pencari kerja (pelamar)** mencatat, memantau, dan mengelola seluruh lowongan kerja yang didaftari. 

Cocok untuk proyek portofolio/gabut dengan arsitektur enterprise-grade: **Vue 3**, **Express.js**, **PostgreSQL**, **RBAC**, dan **Docker Multi-Environment (Dev, Staging, Prod)**.

## Fitur Utama Pelamar:
- **Catat Lowongan:** Simpan nama perusahaan, posisi, tautan (link) loker asli, rentang gaji, platform (LinkedIn, Jobstreet, Glints, dll).
- **Status Alur Lamaran:**
  - `WISHLIST` (Loker ditemukan, belum dikirim)
  - `APPLIED` (Lamaran sudah terkirim)
  - `TEST` (Tes teknis / koding / psikotes)
  - `INTERVIEW_HR` (Wawancara dengan HR)
  - `INTERVIEW_USER` (Wawancara dengan tim/user)
  - `OFFERING` (Mendapat tawaran kerja)
  - `ACCEPTED` / `REJECTED` / `WITHDRAWN`
- **Jadwal Wawancara:** Catat tanggal/jam interview, link Google Meet/Zoom, dan kisi-kisi atau pertanyaan yang ditanyakan.
- **Privasi & Akun:** Data 100% privat per akun (hanya pemilik akun yang bisa melihat catatan lokernya).
- **Tampilan Kanban & Tabel:** Papan visual drag-and-drop dan tabel dengan pencarian cepat.

## Tech Stack (Latest LTS):
- **Backend**: Node.js 22 LTS, Express.js 4.21, TypeScript, Prisma ORM
- **Database**: PostgreSQL 16
- **Frontend**: Vue.js 3.5, Vite, Pinia, Vue Router, Tailwind CSS
- **Container**: Docker & Docker Compose (`dev`, `staging`, `prod`)
