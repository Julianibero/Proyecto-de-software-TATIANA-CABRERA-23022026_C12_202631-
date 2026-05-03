const Proyecto = require('../models/proyecto.model');

const crearProyecto = async (req, res) => {
  try {
    const { titulo, descripcion, tecnologias, imagen, enlace } = req.body;

    const proyecto = new Proyecto({
      titulo,
      descripcion,
      tecnologias,
      imagen,
      enlace,
      autor: req.usuario.id
    });

    await proyecto.save();
    res.status(201).json({ mensaje: 'Proyecto creado exitosamente', proyecto });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ estado: 'activo' }).populate('autor', 'nombre email');
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const obtenerProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id).populate('autor', 'nombre email');
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const actualizarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findOneAndUpdate(
      { _id: req.params.id, autor: req.usuario.id },
      req.body,
      { new: true }
    );
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }
    res.json({ mensaje: 'Proyecto actualizado', proyecto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findOneAndUpdate(
      { _id: req.params.id, autor: req.usuario.id },
      { estado: 'inactivo' },
      { new: true }
    );
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }
    res.json({ mensaje: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

module.exports = { crearProyecto, obtenerProyectos, obtenerProyecto, actualizarProyecto, eliminarProyecto };