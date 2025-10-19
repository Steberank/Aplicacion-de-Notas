import './Etiqueta.css';
import BotonCircular from './BotonCircular';
import logoX from '../assets/logo-X.png';

const Etiqueta = ({ id, texto, color = '#808080', onClick, tieneBoton = true }) => {
  return (
    <div className="etiqueta-componente" style={{ backgroundColor: color }}>
      <div className="etiqueta-texto">{texto}</div>
      {tieneBoton && (
        <div className="etiqueta-borrar">
          <BotonCircular 
            logo={logoX}
            textoHover="Borrar Etiqueta"
            colorFondo="transparent"
            onClick={onClick}
            tamanio={15}
          />
        </div>
      )}
    </div>
  );
};

export default Etiqueta;

