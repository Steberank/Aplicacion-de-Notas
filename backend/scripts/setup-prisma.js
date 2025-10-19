import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Configurando Prisma...');

try {
  console.log('📦 Generando cliente de Prisma...');
  execSync('npx prisma generate', { 
    cwd: __dirname + '/..',
    stdio: 'inherit' 
  });

  console.log('🗄️ Ejecutando migraciones...');
  execSync('npx prisma db push', { 
    cwd: __dirname + '/..',
    stdio: 'inherit' 
  });

  console.log('✅ Prisma configurado correctamente');
} catch (error) {
  console.error('❌ Error configurando Prisma:', error.message);
  process.exit(1);
}
