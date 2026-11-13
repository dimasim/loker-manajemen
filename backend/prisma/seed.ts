import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultPlatforms = [
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Glints', url: 'https://glints.com' },
  { name: 'Jobstreet', url: 'https://jobstreet.co.id' },
  { name: 'Kalibrr', url: 'https://kalibrr.com' },
  { name: 'Indeed', url: 'https://id.indeed.com' },
  { name: 'Dealls', url: 'https://dealls.com' },
  { name: 'Tech in Asia Jobs', url: 'https://techinasia.com/jobs' },
  { name: 'Website Perusahaan / Direct Career', url: '' },
  { name: 'Lainnya (Twitter / Info Teman / WA)', url: '' },
];

async function main() {
  console.log('🌱 Memulai proses seeding data default...');

  for (const platform of defaultPlatforms) {
    await prisma.jobPlatform.upsert({
      where: { name: platform.name },
      update: {},
      create: {
        name: platform.name,
        url: platform.url,
      },
    });
  }

  console.log('✅ Seeding platform lowongan kerja default berhasil diselesaikan!');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

