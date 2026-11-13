# Panduan Langkah 5: Frontend UI Fungsional Pelamar (Kanban Board, Input Loker & Wawancara)

Dokumen ini memuat panduan antarmuka dan pengalaman pengguna (*user experience*) **Personal Job Application Tracker** yang dibangun di Langkah 5.

---

## 1. Fitur Utama yang Telah Diimplementasikan

### 1.1 Tampilan Kanban Board Interaktif (`JobKanbanView.vue`)
- Terdiri dari 8 kolom status alur lamaran kerja:
  1. 📌 **Wishlist** (Loker ditemukan / disimpan dulu)
  2. 📤 **Terkirim (Applied)** (Lamaran sudah dikirim)
  3. 📝 **Tes Koding / Psikotes** (Tahap penilaian teknis)
  4. 🗣️ **Wawancara HR** (Interview tahap awal)
  5. 👥 **Wawancara User** (Interview tim / user lead)
  6. 🎉 **Offering** (Tahap penawaran gaji)
  7. 🚀 **Diterima (Accepted)** (Deal & mulai bekerja)
  8. ❌ **Ditolak (Rejected)** (Belum rezeki / ghosting)
- **Drag-and-Drop Native:** Kartu lowongan dapat ditarik (*drag*) dan dijatuhkan (*drop*) antar kolom untuk mengubah status secara seketika (*optimistic UI update*).

### 1.2 Modal Tambah Loker Cepat (`CreateJobModal.vue`)
- Tombol **`+ Tambah Loker`** membuka modal input:
  - **Link Lowongan:** Paste link loker asli dari LinkedIn, Glints, Jobstreet, web karir, dll.
  - **Nama Perusahaan & Posisi:** Input identitas pekerjaan.
  - **Platform Asal:** Dropdown pilihan platform terintegrasi dengan database.
  - **Tipe Kerja:** *Remote*, *Hybrid*, atau *On-Site*.
  - **Gaji:** Ekspektasi atau tawaran gaji (format Rupiah IDR).
  - **Status Awal & Catatan:** Catatan bebas untuk requirement atau tech stack.

### 1.3 Modal Detail Loker & Catat Interview (`JobDetailModal.vue`)
- Klik kartu loker mana saja untuk membuka detail lengkap:
  - **Tombol Satu Klik:** `Buka Link Loker Asli ↗` membuka halaman postingan pekerjaan di tab baru browser.
  - **Quick Status Selector:** Mengganti status secara cepat via dropdown.
  - **Manajemen Jadwal Interview:**
    - Tambah jadwal wawancara baru (waktu/tanggal, nama interviewer).
    - Simpan link panggilan video (Google Meet, Zoom, MS Teams).
    - Tombol `Buka Video Call` untuk langsung bergabung ke sesi interview.
    - Catatan pertanyaan yang ditanyakan saat interview.
  - **Hapus Loker:** Tombol hapus loker dengan konfirmasi aman.

### 1.4 Mode Tabel Dinamis (`JobTableView.vue`)
- Toggle switch di toolbar atas untuk beralih dari mode **Kanban** ke mode **Tabel**.
- Memudahkan sortir tanggal apply, pencarian teks instan (perusahaan, posisi, lokasi), dan filter tipe kerja (*Remote/WFO*).

---

## 2. Struktur Komponen Frontend Langkah 5

```text
frontend/src/modules/jobs/
├── types/
│   └── job.types.ts                # TypeScript Interfaces (JobApplication, Interview, Status)
├── services/
│   └── job.api.ts                  # Axios API caller untuk /jobs, /interviews, /platforms
├── stores/
│   └── job.store.ts                # Pinia Store: state, computed filter, optimistic update
└── components/
    ├── JobCard.vue                 # Kartu loker di papan Kanban
    ├── JobKanbanView.vue           # Papan Kanban 8 kolom dengan drag-and-drop
    ├── JobTableView.vue            # Tampilan data table alternatif
    ├── CreateJobModal.vue          # Formulir modal input loker cepat
    └── JobDetailModal.vue          # Detail loker & catatan jadwal interview
```
