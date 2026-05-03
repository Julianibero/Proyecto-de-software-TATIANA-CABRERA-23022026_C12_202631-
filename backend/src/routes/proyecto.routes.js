const express = require('express');
const router = express.Router();
const { crearProyecto, obtenerProyectos, obtenerProyecto, actualizarProyecto, eliminarProyecto } = require('../controllers/proyecto.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Listar todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 */
router.get('/', obtenerProyectos);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Ver detalle de un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del proyecto
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', obtenerProyecto);

/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Crear proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tecnologias:
 *                 type: array
 *                 items:
 *                   type: string
 *               imagen:
 *                 type: string
 *               enlace:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       401:
 *         description: Token requerido
 */
router.post('/', verificarToken, crearProyecto);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   put:
 *     summary: Actualizar proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', verificarToken, actualizarProyecto);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   delete:
 *     summary: Eliminar proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', verificarToken, eliminarProyecto);

module.exports = router;