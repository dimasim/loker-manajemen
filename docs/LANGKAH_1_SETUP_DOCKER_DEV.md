# Panduan Langkah 1: Setup Struktur Folder Monorepo & Docker Dev Environment (Best Practice)

Dokumen ini memuat panduan teknis langkah demi langkah untuk membangun fondasi arsitektur monorepo dan lingkungan Docker Development untuk aplikasi **Personal Job Application Tracker**.

---

## 1. Standar Struktur Folder Monorepo

Struktur direktori dirancang mengikuti konvensi industri (*clean separation of concerns*), di mana frontend, backend, dan orkestrasi container terisolasi rapi dalam satu repositori:

```text
loker-manajemen/
├── backend/                        # Service API (Node.js 22 LTS + Express + Prisma)
│   ├── prisma/                     # Skema database & migrasi SQL
│   │   └── schema.prisma
│   ├── src/                        # Kode sumber backend TypeScript
│   │   ├── config/                 # Konfigurasi environment & database
│   │   ├── controllers/            # Pengendali endpoint HTTP
│   │   ├── middlewares/            # Auth, RBAC & error handler
│   │   ├── routes/                 # Definisi routing API
│   │   ├── services/               # Logika bisnis & transaksi data
│   │   └── server.ts               # Entry point Express
│   ├── .dockerignore
│   ├── Dockerfile.dev              # Dockerfile untuk live-reload dev
│   ├── Dockerfile                  # Multi-stage production Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                       # Client SPA (Vue 3.5 + Vite + Tailwind CSS)
│   ├── public/                     # Aset statis publik
│   ├── src/                        # Kode sumber Vue
│   │   ├── assets/                 # CSS & icons
│   │   ├── components/             # Reusable UI components
│   │   ├── layouts/                # App layout (navbar, sidebar)
│   │   ├── router/                 # Vue Router & navigation guards
│   │   ├── stores/                 # Pinia state stores
│   │   ├── views/                  # Halaman (Dashboard, Login, Kanban)
│   │   ├── App.vue
│   │   └── main.ts
│   ├── .dockerignore
│   ├── Dockerfile.dev              # Dockerfile Vite dev server
│   ├── Dockerfile                  # Multi-stage build Nginx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker/                         # Konfigurasi pendukung Docker
│   ├── nginx/                      # Konfigurasi Nginx proxy (staging & prod)
│   │   └── default.conf
│   └── postgres/                   # Script inisialisasi database (opsional)
│       └── init.sql
│
├── docs/                           # Dokumentasi & panduan langkah proyek
│   ├── SPESIFIKASI_PROYEK.md
│   └── LANGKAH_1_SETUP_DOCKER_DEV.md
│
├── .env.example                    # Template variabel lingkungan
├── .env.development               # Variabel lingkungan development lokal
├── .gitignore                      # Mengabaikan file sensitif & cache
├── docker-compose.dev.yml          # Orkestrasi Docker untuk Development
├── docker-compose.staging.yml      # Orkestrasi Docker untuk Staging
├── docker-compose.prod.yml         # Orkestrasi Docker untuk Production
└── README.md
```

---

## 2. Rincian Konfigurasi File Utama

### 2.1 File `.gitignore` (Root)
Mencegah file credential, binary, log, dan dependensi terunggah ke version control:
```gitignore
# Dependensi
node_modules/
.pnpm-store/

# Lingkungan & Rahasia
.env
.env.development
.env.staging
.env.production
!.env.example

# Build Artifacts
dist/
build/
*.tsbuildinfo

# Database & Volume lokal
*.sqlite
*.sqlite-journal
pg_data/

# OS & Editor
.DS_Store
Thumbs.db
.vscode/
.idea/
*.log
npm-debug.log*
yarn-debug.log*
```

---

### 2.2 Template Variabel Lingkungan (`.env.example`)
Semua service membaca konfigurasi dari file `.env`:
```env
# ============================================
# LINGKUNGAN / ENVIRONMENT
# ============================================
NODE_ENV=development

# ============================================
# DATABASE (PostgreSQL 16)
# ============================================
DB_USER=postgres
DB_PASSWORD=postgres_dev_password
DB_NAME=loker_tracker_dev
DB_PORT=5432
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:${DB_PORT}/${DB_NAME}?schema=public

# ============================================
# BACKEND API (Express.js)
# ============================================
BACKEND_PORT=4000
JWT_SECRET=super_secret_jwt_key_dev_minimum_32_characters_long
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=super_secret_refresh_key_dev_minimum_32_chars
REFRESH_TOKEN_EXPIRES_IN=7d

# ============================================
# FRONTEND CLIENT (Vue 3 / Vite)
# ============================================
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:4000/api
```

---

### 2.3 File `backend/Dockerfile.dev`
Menggunakan Node.js 22 LTS Alpine yang ringan, dengan volume caching untuk live reload:
```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependensi sistem dasar untuk build native module (jika diperlukan)
RUN apk add --no-cache libc6-compat

# Salin package manifest untuk caching layer Docker
COPY package*.json ./
COPY prisma ./prisma/

# Install seluruh dependensi dev
RUN npm install

# Salin sisa kode sumber
COPY . .

# Generate Prisma Client
RUN npx prisma generate || true

EXPOSE 4000

# Jalankan server dengan hot-reload (tsx watch / nodemon)
CMD ["npm", "run", "dev"]
```

---

### 2.4 File `frontend/Dockerfile.dev`
Menggunakan Vite dengan flag `--host 0.0.0.0` agar port dev server dapat diakses dari luar container:
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite membutuhkan host 0.0.0.0 agar port forwarding Docker berfungsi
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

---

### 2.5 File `docker-compose.dev.yml` (Best Practice Dev Orchestration)
Konfigurasi dev mencakup:
1. **Healthcheck** pada PostgreSQL agar backend menunggu sampai database benar-benar siap menerima koneksi.
2. **Bind-mount volumes** agar perubahan kode di komputer lokal langsung memicu live-reload (HMR) tanpa perlu rebuild image.
3. **Named Volume** untuk `node_modules` di dalam container agar tidak tertimpa oleh folder lokal.
4. **Named Volume** untuk `postgres_dev_data` agar data loker tidak hilang saat container dimatikan.

```yaml
services:
  # 1. Service Database PostgreSQL
  postgres:
    image: postgres:16-alpine
    container_name: loker_postgres_dev
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres_dev_password}
      POSTGRES_DB: ${DB_NAME:-loker_tracker_dev}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres} -d ${DB_NAME:-loker_tracker_dev}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - loker_dev_net

  # 2. Service Backend Express.js
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: loker_backend_dev
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: ${BACKEND_PORT:-4000}
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres_dev_password}@postgres:5432/${DB_NAME:-loker_tracker_dev}?schema=public
      JWT_SECRET: ${JWT_SECRET:-super_secret_jwt_key_dev_minimum_32_characters_long}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-1d}
    ports:
      - "${BACKEND_PORT:-4000}:4000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - loker_dev_net

  # 3. Service Frontend Vue 3 (Vite)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: loker_frontend_dev
    restart: unless-stopped
    environment:
      VITE_API_BASE_URL: http://localhost:4000/api
    ports:
      - "${FRONTEND_PORT:-5173}:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - loker_dev_net

volumes:
  postgres_dev_data:
    driver: local

networks:
  loker_dev_net:
    driver: bridge
```

---

## 3. Langkah Eksekusi (Implementation Steps)

Untuk mewujudkan arsitektur di atas, ikuti tahapan berikut:

1. **Pembuatan Direktori:**
   - Buat direktori `backend/src`, `frontend/src`, `docker/nginx`.
2. **Inisialisasi Backend Skeleton:**
   - Buat file `backend/package.json` dengan dependensi inti (`express`, `cors`, `dotenv`, `zod`, `@prisma/client`, dan dev dependensi `tsx`, `typescript`, `@types/express`).
   - Buat file `backend/tsconfig.json`.
   - Buat file `backend/src/server.ts` dengan endpoint uji kesehatan `GET /api/health`.
   - Buat file `backend/Dockerfile.dev` dan `backend/.dockerignore`.
3. **Inisialisasi Frontend Skeleton:**
   - Buat file `frontend/package.json` dengan dependensi inti (`vue`, `vue-router`, `pinia`, `axios`, dan dev dependensi `vite`, `@vitejs/plugin-vue`, `typescript`).
   - Buat file `frontend/vite.config.ts`, `frontend/index.html`, dan `frontend/src/main.ts` sederhana.
   - Buat file `frontend/Dockerfile.dev` dan `frontend/.dockerignore`.
4. **Penyusunan File Konfigurasi Lingkungan:**
   - Buat `.env.example` dan salin ke `.env.development`.
   - Buat `docker-compose.dev.yml` di root proyek.

---

## 4. Kriteria Keberhasilan & Pengujian Langkah 1

Langkah 1 dinyatakan sukses apabila:
1. Perintah berikut berhasil berjalan tanpa error:
   ```bash
   docker compose -f docker-compose.dev.yml up --build -d
   ```
2. Seluruh 3 container berjalan dengan status **Healthy / Running**:
   - `loker_postgres_dev` (Port 5432)
   - `loker_backend_dev` (Port 4000)
   - `loker_frontend_dev` (Port 5173)
3. Endpoint backend `http://localhost:4000/api/health` mengembalikan respon JSON `{"status": "ok"}`.
4. Tampilan frontend di `http://localhost:5173` berhasil diakses dari browser.
5. Perubahan pada kode sumber di lokal langsung memicu *live reload* otomatis di dalam container.

