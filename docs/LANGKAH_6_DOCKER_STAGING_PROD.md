# Langkah 6: Docker Staging & Production Hardening

## Overview

Langkah ini mengubah aplikasi dari lingkungan development menjadi **production-ready** dengan:
- Multi-stage Docker builds (backend & frontend)
- Nginx sebagai reverse proxy + static file server
- Docker Compose terpisah untuk staging dan production
- Security headers, Gzip compression, resource limits
- Health checks di semua service
- Non-root container users

---

## File Yang Dibuat / Diubah

| File | Keterangan |
|------|-----------|
| `backend/Dockerfile` | Multi-stage production build backend |
| `frontend/Dockerfile` | Multi-stage production build frontend (Nginx) |
| `docker/nginx/default.conf` | Nginx config (security headers + gzip) |
| `docker-compose.staging.yml` | Stack staging (port 8080) |
| `docker-compose.prod.yml` | Stack production (port 80) |
| `.env.production` | Template environment variables production |

---

## Arsitektur Production

```
Internet
   │
   ▼
┌──────────────┐
│  Nginx :80   │  ← Static files Vue SPA
│  (frontend)  │  ← Reverse proxy /api/
└──────┬───────┘
       │ proxy_pass
       ▼
┌──────────────┐
│  Express :4000│  ← REST API
│  (backend)   │
└──────┬───────┘
       │ prisma
       ▼
┌──────────────┐
│ PostgreSQL 16 │  ← Database (tidak di-expose ke host)
└──────────────┘
```

---

## Deploy ke Staging

### 1. Siapkan Environment Variables

Buat file `.env.staging` di root project:

```bash
cp .env.example .env.staging
nano .env.staging
```

Isi minimal:
```env
POSTGRES_USER=loker_user
POSTGRES_PASSWORD=password_staging_aman
POSTGRES_DB=loker_db_staging
JWT_SECRET=secret_staging_min_32_karakter
JWT_EXPIRES_IN=7d
```

### 2. Build & Jalankan Stack Staging

```bash
# Build semua image dari source code
docker compose -f docker-compose.staging.yml --env-file .env.staging up --build -d

# Lihat status semua container
docker compose -f docker-compose.staging.yml ps

# Lihat logs backend
docker compose -f docker-compose.staging.yml logs -f backend
```

### 3. Verifikasi Staging

```bash
# Health check API
curl http://localhost:8080/api/health

# Buka browser
open http://localhost:8080
```

### 4. Stop Staging

```bash
docker compose -f docker-compose.staging.yml down
```

---

## Deploy ke Production

### 1. Siapkan Environment Variables Production

```bash
cp .env.example .env.production
nano .env.production
```

**WAJIB ganti:**
- `POSTGRES_PASSWORD` → password kuat (min 20 karakter, kombinasi huruf/angka/simbol)
- `JWT_SECRET` → random string panjang:
  ```bash
  openssl rand -hex 64
  ```

### 2. Build & Jalankan Stack Production

```bash
# Build image production
docker compose -f docker-compose.prod.yml --env-file .env.production up --build -d

# Cek status
docker compose -f docker-compose.prod.yml ps

# Monitor logs
docker compose -f docker-compose.prod.yml logs -f
```

### 3. Verifikasi Production

```bash
# Health check (port 80)
curl http://localhost/api/health

# Buka browser
open http://localhost
```

### 4. Hentikan & Bersihkan

```bash
# Hentikan tanpa hapus volume data
docker compose -f docker-compose.prod.yml down

# Hentikan DAN hapus semua volume (HATI-HATI: data DB hilang!)
docker compose -f docker-compose.prod.yml down -v
```

---

## Fitur Multi-Stage Build

### Backend (`backend/Dockerfile`)

```
Stage 1 (builder): node:22-alpine
  ├── npm ci (semua deps termasuk devDeps)
  ├── npx prisma generate
  └── npm run build (TypeScript → dist/)
      └── npm prune --production

Stage 2 (runner): node:22-alpine
  ├── dumb-init (proper PID 1 signal handling)
  ├── USER node (non-root)
  └── COPY dist/, node_modules/, prisma/ dari builder
```

**Keuntungan:**
- Image final tidak mengandung TypeScript, tsx, atau devDependencies
- Ukuran image jauh lebih kecil (~200MB vs ~500MB)
- Non-root user meningkatkan keamanan

### Frontend (`frontend/Dockerfile`)

```
Stage 1 (builder): node:22-alpine
  ├── npm ci
  └── npm run build (Vite → dist/)

Stage 2 (runner): nginx:alpine-slim
  └── COPY dist/ → /usr/share/nginx/html
```

**Keuntungan:**
- Node.js tidak ada di image final
- Hanya Nginx + static files
- Ukuran image ~30MB

---

## Nginx Configuration

File: `docker/nginx/default.conf`

**Fitur yang dikonfigurasi:**

| Fitur | Detail |
|-------|--------|
| **Gzip** | Level 6, threshold 1KB, semua text/JS/CSS/SVG |
| **SPA Support** | `try_files $uri $uri/ /index.html` |
| **API Proxy** | `/api/` → `http://backend:4000/api/` |
| **Cache Assets** | JS/CSS/image cache 1 tahun (`immutable`) |
| **X-Frame-Options** | `SAMEORIGIN` (cegah clickjacking) |
| **X-Content-Type** | `nosniff` (cegah MIME sniffing) |
| **X-XSS-Protection** | `1; mode=block` |
| **Referrer-Policy** | `strict-origin-when-cross-origin` |
| **Server Tokens** | `off` (sembunyikan versi Nginx) |

---

## Perbedaan Staging vs Production

| Aspek | Staging | Production |
|-------|---------|-----------|
| Port | `8080` | `80` |
| Restart | `unless-stopped` | `always` |
| Memory limit backend | Tidak ada | 512MB |
| Memory limit frontend | Tidak ada | 128MB |
| CPU limit backend | Tidak ada | 0.75 core |
| DB migrate | `migrate deploy` + `seed` | `migrate deploy` saja |
| DB port ke host | Tidak di-expose | Tidak di-expose |
| Log max size | Tidak ada | 20MB / 5 file |

---

## Perbedaan Development vs Production

| Aspek | Development | Production |
|-------|------------|-----------|
| Backend source | Bind mount + `tsx watch` | Compiled `dist/server.js` |
| Frontend source | Bind mount + Vite HMR | Nginx static files |
| `/api` routing | Vite dev server proxy | Nginx reverse proxy |
| Hot reload | ✅ | ❌ (tidak diperlukan) |
| Source maps | ✅ | ❌ |
| Non-root user | ❌ | ✅ |
| Gzip | ❌ | ✅ |
| Resource limits | ❌ | ✅ |

---

## Troubleshooting

### Backend gagal connect ke DB

```bash
# Cek log backend
docker compose -f docker-compose.staging.yml logs backend

# Cek apakah migration sudah jalan
docker compose -f docker-compose.staging.yml logs migrate

# Jalankan migration manual
docker compose -f docker-compose.staging.yml run --rm migrate \
  sh -c "npx prisma migrate deploy"
```

### Image build error

```bash
# Build ulang tanpa cache
docker compose -f docker-compose.staging.yml build --no-cache

# Lihat detail error
docker compose -f docker-compose.staging.yml build --progress=plain
```

### Reset database staging (hati-hati!)

```bash
docker compose -f docker-compose.staging.yml down -v
docker compose -f docker-compose.staging.yml up --build -d
```

---

## Checklist Sebelum Deploy Production

- [ ] `POSTGRES_PASSWORD` sudah diganti (bukan default)
- [ ] `JWT_SECRET` sudah diganti dengan nilai acak panjang
- [ ] File `.env.production` tidak di-commit ke git
- [ ] SSL/TLS dikonfigurasi (HTTPS) — butuh Nginx + Certbot di luar Docker
- [ ] Backup database dikonfigurasi
- [ ] Monitoring/alerting dikonfigurasi (opsional: Uptime Robot, etc.)

