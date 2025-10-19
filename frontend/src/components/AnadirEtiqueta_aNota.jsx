import { useEffect, useRef } from 'react';
import './AnadirEtiqueta_aNota.css';
import Etiqueta from './Etiqueta';

const AnadirEtiqueta_aNota = ({ 
  notaId, 
  etiquetasDisponibles, 
  etiquetasActuales, 
  onCerrar, 
  onEtiquetaAnadida 
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onCerrar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCerrar]);
  const etiquetasDisponiblesParaAnadir = etiquetasDisponibles.filter(etiquetaDisponible => 
    !etiquetasActuales.some(etiquetaActual => etiquetaActual.id === etiquetaDisponible.id)
  );

  const handleClickEtiqueta = async (etiqueta) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notas/${notaId}/etiquetas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ etiquetaId: etiqueta.id }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir etiqueta');
      }

      onEtiquetaAnadida(etiqueta);
      onCerrar();
    } catch (error) {
      console.error('Error al añadir etiqueta:', error);
    }
  };

  return (
    <div className="anadir-etiqueta-overlay">
      <div ref={popupRef} className="anadir-etiqueta-popup">
        <div className="anadir-etiqueta-header">
          <h3>Añadir Etiqueta</h3>
          <button className="cerrar-popup" onClick={onCerrar}>
            ✕
          </button>
        </div>
        
        <div className="anadir-etiqueta-content">
          {etiquetasDisponiblesParaAnadir.length > 0 ? (
            <div className="etiquetas-grid">
              {etiquetasDisponiblesParaAnadir.map(etiqueta => (
                <div
                  key={etiqueta.id}
                  className="etiqueta-item"
                  onClick={() => handleClickEtiqueta(etiqueta)}
                >
                  <Etiqueta
                    id={etiqueta.id}
                    texto={etiqueta.texto}
                    color={etiqueta.color}
                    tieneBoton={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="sin-etiquetas">
              <p>No hay etiquetas disponibles para añadir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnadirEtiqueta_aNota;
