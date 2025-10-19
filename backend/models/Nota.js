// Modelo de Nota
// Define la estructura de una nota en la aplicación

class Nota {
  constructor({
    id,
    titulo = '',
    contenido = '',
    color = '#FFE4B5',
    estaArchivado = false,
    estaFijado = false,
    etiquetas = [],
    creadoEn = new Date(),
    editadoEn = new Date()
  }) {
    this.id = id;
    this.titulo = titulo;
    this.contenido = contenido;
    this.color = color;
    this.estaArchivado = estaArchivado;
    this.estaFijado = estaFijado;
    this.etiquetas = etiquetas; // Array de objetos {id, texto, color}
    this.creadoEn = creadoEn;
    this.editadoEn = editadoEn;
  }

  // Método para validar la nota
  validar() {
    if (!this.id) {
      throw new Error('La nota debe tener un ID');
    }
    return true;
  }

  // Método para convertir a JSON
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      contenido: this.contenido,
      color: this.color,
      estaArchivado: this.estaArchivado,
      estaFijado: this.estaFijado,
      etiquetas: this.etiquetas,
      creadoEn: this.creadoEn,
      editadoEn: this.editadoEn
    };
  }
}

export default Nota;

