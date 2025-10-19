import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notasRoutes from './routes/notasRoutes.js';
import etiquetasRoutes from './routes/etiquetasRoutes.js';
import { testPrismaConnection } from './config/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.json({ message: 'API de Notas funcionando correctamente' });
});

app.use('/api/notas', notasRoutes);
app.use('/api/etiquetas', etiquetasRoutes);
const iniciarServidor = async () => {
  try {
    await testPrismaConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();

