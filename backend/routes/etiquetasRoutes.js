import express from 'express';
import etiquetasController from '../controllers/etiquetasController.js';

const router = express.Router();

router.get('/', etiquetasController.obtenerTodasLasEtiquetas);

router.post('/', etiquetasController.crearEtiqueta);

router.delete('/:id', etiquetasController.eliminarEtiqueta);

export default router;
