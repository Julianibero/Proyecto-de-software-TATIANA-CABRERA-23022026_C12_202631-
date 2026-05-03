const express = require('express');
const router = express.Router();
const { crearProyecto, obtenerProyectos, obtenerProyecto, actualizarProyecto, eliminarProyecto } = require('../controllers/proyecto.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', obtenerProyectos);
router.get('/:id', obtenerProyecto);
router.post('/', verificarToken, crearProyecto);
router.put('/:id', verificarToken, actualizarProyecto);
router.delete('/:id', verificarToken, eliminarProyecto);

module.exports = router;