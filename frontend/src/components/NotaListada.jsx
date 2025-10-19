import './NotaListada.css';
import Etiqueta from './Etiqueta';

const NotaListada = ({ id, color, titulo, contenido, etiquetas, onClick }) => {
  return (
    <div className="nota-listada" style={{ backgroundColor: color }} onClick={onClick}>
      <div className="nota-listada-titulo">{titulo}</div>
      
      <div className="nota-listada-contenido">{contenido}</div>
      
      <div className="nota-listada-etiquetas">
        {etiquetas && etiquetas.length > 0 && etiquetas.map((etiqueta) => (
          <Etiqueta 
            key={etiqueta.id}
            id={etiqueta.id}
            texto={etiqueta.texto}
            color={etiqueta.color}
            tieneBoton={false}
          />
        ))}
      </div>
      
      <div className="nota-listada-info">
        <span className="info-texto">Click para editar</span>
      </div>
    </div>
  );
};

export default NotaListada;

