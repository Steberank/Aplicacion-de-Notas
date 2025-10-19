import './BotonCrearNota.css';

const BotonCrearNota = ({ onClick }) => {
  return (
    <button className="boton-crear-nota" onClick={onClick}>
      Crear una nota...
    </button>
  );
};

export default BotonCrearNota;

