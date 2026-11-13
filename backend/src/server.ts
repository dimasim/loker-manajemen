import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { DatabaseClient } from './core/database/prisma.client';

const PORT = Number(process.env.PORT) || 4000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [Backend] Server berjalan di http://localhost:${PORT}`);
  console.log(`🏛️ [Backend] Arsitektur: Modular OOP dengan Clean Dependency Injection`);
  console.log(`🩺 [Backend] Healthcheck : http://localhost:${PORT}/api/health`);
  console.log(`🔐 [Backend] Auth Module : http://localhost:${PORT}/api/auth`);
});

// Graceful Shutdown
const handleGracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Menerima sinyal ${signal}. Memulai proses graceful shutdown...`);
  server.close(async () => {
    console.log('🔒 HTTP Server ditutup.');
    await DatabaseClient.disconnect();
    console.log('📦 Koneksi database PostgreSQL ditutup.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
