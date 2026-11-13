# Panduan Langkah 2: Backend Modular OOP & Sistem Auth RBAC

Dokumen ini memuat arsitektur dan panduan teknis **Backend Modular Berbasis Object-Oriented Programming (OOP)** dengan prinsip *Clean Architecture* dan *Dependency Injection* pada **Personal Job Application Tracker**.

---

## 1. Arsitektur Modular OOP (Domain-Driven Modules)

Berbeda dengan arsitektur MVC datar (*flat MVC*), arsitektur modular mengelompokkan kode berdasarkan **domain fitur / modul**. Setiap modul bersifat independen (*self-contained*), mudah diuji (*testable*), dan mengikuti prinsip **SOLID**:

```text
backend/src/
├── core/                                   # Cross-Cutting Concerns / Shared Kernel
│   ├── database/
│   │   └── prisma.client.ts                # Singleton Database Client
│   ├── errors/
│   │   └── app.error.ts                    # Hierarchy Exception Classes (AppError, UnauthorizedError, dll)
│   ├── middlewares/
│   │   ├── auth.middleware.ts              # Auth & RBAC Guard
│   │   ├── validate.middleware.ts          # Zod Request DTO Validator
│   │   └── error.middleware.ts             # Global Error & 404 Handler
│   └── types/
│       ├── express.d.ts                    # Express Request Augmentation
│       └── common.types.ts                 # Shared Types (AuthenticatedUser, JwtTokenPayload)
│
├── modules/
│   ├── auth/                               # Modul Autentikasi & Akun Pelamar
│   │   ├── auth.interface.ts               # Interface Kontrak (IUserRepository, IAuthService)
│   │   ├── auth.schema.ts                  # Zod Validation DTO (RegisterDTO, LoginDTO)
│   │   ├── auth.repository.ts              # Data Access Layer (Prisma Queries)
│   │   ├── auth.service.ts                 # Business Logic Layer (Password Hashing, JWT)
│   │   ├── auth.controller.ts              # HTTP Presentation Layer (Request/Response Mapping)
│   │   └── auth.routes.ts                  # Dependency Injection & Express Router Wiring
│   │
│   ├── jobs/                               # Modul Lowongan Kerja (Langkah 3)
│   │   ├── job.interface.ts
│   │   ├── job.schema.ts
│   │   ├── job.repository.ts
│   │   ├── job.service.ts
│   │   ├── job.controller.ts
│   │   └── job.routes.ts
│   │
│   └── platforms/                          # Modul Master Sumber Platform
│       └── ...
│
├── app.ts                                  # Express Application Class
└── server.ts                               # Server Bootstrap & Graceful Shutdown
```

---

## 2. Penerapan Prinsip OOP & Clean Code

### 2.1 Dependency Injection (Constructor-based)
Setiap layer menerima dependensinya melalui konstruktor (*Dependency Inversion Principle*):
1. **`AuthRepository`** mengimplementasikan `IUserRepository` untuk interaksi data dengan database.
2. **`AuthService`** menerima `IUserRepository` melalui konstruktor untuk menjalankan logika bisnis (hashing password, verifikasi kredensial, generate token).
3. **`AuthController`** menerima `IAuthService` melalui konstruktor untuk memetakan request HTTP ke response JSON.
4. **`AuthRoutes`** menginisiasi rantai dependensi dan mendaftarkannya ke router Express.

### 2.2 Hirarki Penanganan Error (`AppError`)
Seluruh error bisnis menggunakan turunan class `AppError` yang terstruktur:
- `BadRequestError` (HTTP 400)
- `UnauthorizedError` (HTTP 401)
- `ForbiddenError` (HTTP 403)
- `NotFoundError` (HTTP 404)
- `ConflictError` (HTTP 409)

---

## 3. Rincian Endpoint API Modul Auth

| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Publik | Registrasi akun pelamar baru |
| **POST** | `/api/auth/login` | Publik | Login & mendapatkan JWT Bearer token |
| **GET** | `/api/auth/me` | Terproteksi (`AuthMiddleware.authenticate`) | Mengambil data akun yang sedang aktif |

---

## 4. Cara Menjalankan Migrasi & Menyalakan Sistem

Jika belum dijalankan, Anda dapat mengeksekusinya dengan langkah berikut:

```bash
# 1. Nyalakan seluruh container Docker dev
docker compose -f docker-compose.dev.yml up --build -d

# 2. Jalankan migrasi Prisma untuk membuat tabel di PostgreSQL
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev --name init_db

# 3. Jalankan seeding data awal platform loker
docker compose -f docker-compose.dev.yml exec backend npm run prisma:seed
```

---

## 5. Pengujian API via cURL

```bash
# Register Akun Baru
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Dimas Pelamar","email":"dimas@loker.com","password":"password123"}'

# Login Akun
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dimas@loker.com","password":"password123"}'

# Cek Profil Akun
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <TOKEN_DARI_LOGIN>"
```
