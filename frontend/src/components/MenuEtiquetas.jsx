import { useState, useEffect } from 'react';
import './MenuEtiquetas.css';
import Etiqueta from './Etiqueta';
import BotonTexto from './BotonTexto';
import { obtenerTodasLasEtiquetas, crearEtiqueta, eliminarEtiqueta } from '../services/etiquetasService';

const MenuEtiquetas = ({ onCerrar, onEtiquetasActualizadas }) => {
  const [etiquetas, setEtiquetas] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [nuevoColor, setNuevoColor] = useState('#E0E0E0');
  const [cargando, setCargando] = useState(true);

  const coloresDisponibles = [
    '#E0E0E0',
    '#FFCDD2',
    '#F8BBD9',
    '#E1BEE7',
    '#C5CAE9',
    '#BBDEFB',
    '#B3E5FC',
    '#B2DFDB',
    '#C8E6C9',
    '#DCEDC8',
    '#F0F4C3',
    '#FFF9C4',
    '#FFECB3',
    '#FFE0B2',
    '#D7CCC8',
    '#F5F5F5'
  ];

  useEffect(() => {
    cargarEtiquetas();
  }, []);

  const cargarEtiquetas = async () => {
    try {
      setCargando(true);
      const etiquetasData = await obtenerTodasLasEtiquetas();
      setEtiquetas(etiquetasData);
    } catch (error) {
      console.error('Error al cargar etiquetas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearEtiqueta = async () => {
    if (!nuevoTexto.trim()) return;

    try {
      const nuevaEtiqueta = await crearEtiqueta({
        texto: nuevoTexto.trim(),
        color: nuevoColor
      });
      
      setEtiquetas(prev => [...prev, nuevaEtiqueta]);
      setNuevoTexto('');
      setNuevoColor('#E0E0E0');
      
      onEtiquetasActualizadas?.();
    } catch (error) {
      console.error('Error al crear etiqueta:', error);
      alert('Error al crear la etiqueta. Verifica que no exista una etiqueta con el mismo nombre.');
    }
  };

  const handleEliminarEtiqueta = async (etiquetaId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta etiqueta? Se eliminará de todas las notas.')) {
      return;
    }

    try {
      await eliminarEtiqueta(etiquetaId);
      setEtiquetas(prev => prev.filter(etiqueta => etiqueta.id !== etiquetaId));
      
      onEtiquetasActualizadas?.();
    } catch (error) {
      console.error('Error al eliminar etiqueta:', error);
      alert('Error al eliminar la etiqueta');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCrearEtiqueta();
    }
  };

  return (
    <div className="menu-etiquetas-overlay">
      <div className="menu-etiquetas-popup">
        <div className="menu-etiquetas-header">
          <h2>Gestionar Etiquetas</h2>
          <button className="cerrar-menu" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className="menu-etiquetas-content">
          <div className="crear-etiqueta-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre de la etiqueta"
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-etiqueta"
              />
            </div>
            
            <div className="form-group">
              <label>Color:</label>
              <div className="colores-grid">
                {coloresDisponibles.map(color => (
                  <button
                    key={color}
                    className={`color-option ${nuevoColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNuevoColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="form-actions">
              <BotonTexto
                texto="Agregar"
                colorFondo="#4CAF50"
                onClick={handleCrearEtiqueta}
              />
            </div>
          </div>

          <div className="etiquetas-lista">
            <h3>Etiquetas existentes ({etiquetas.length})</h3>
            
            {cargando ? (
              <div className="cargando">Cargando etiquetas...</div>
            ) : etiquetas.length > 0 ? (
              <div className="etiquetas-grid">
                {etiquetas.map(etiqueta => (
                  <div key={etiqueta.id} className="etiqueta-item">
                    <Etiqueta
                      id={etiqueta.id}
                      texto={etiqueta.texto}
                      color={etiqueta.color}
                      tieneBoton={true}
                      onClick={() => handleEliminarEtiqueta(etiqueta.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="sin-etiquetas">
                <p>No hay etiquetas creadas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEtiquetas;
