import './BotonTexto.css';

const BotonTexto = ({ texto, colorFondo, onClick }) => {
  return (
    <button 
      className="boton-texto" 
      style={{ backgroundColor: colorFondo }}
      onClick={onClick}
    >
      {texto}
    </button>
  );
};

export default BotonTexto;

