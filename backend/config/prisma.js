import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const testPrismaConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a Prisma exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando con Prisma:', error.message);
    return false;
  }
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export default prisma;
