import './BotonCircular.css';

const BotonCircular = ({ logo, textoHover, colorFondo, onClick, tamanio = 40 }) => {
  const iconoTamanio = tamanio * 0.6; // El icono es 60% del tamaño del botón

  return (
    <div className="boton-circular-container">
      <button 
        className="boton-circular" 
        style={{ 
          backgroundColor: colorFondo,
          width: `${tamanio}px`,
          height: `${tamanio}px`
        }}
        onClick={onClick}
      >
        <img 
          src={logo} 
          alt={textoHover} 
          className="boton-icono"
          style={{
            width: `${iconoTamanio}px`,
            height: `${iconoTamanio}px`
          }}
        />
      </button>
      <span className="boton-tooltip">{textoHover}</span>
    </div>
  );
};

export default BotonCircular;

