import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/user.controller.js';
import { sanitize, validateUser } from '../middlewares/validate.middleware.js';
import { limiter } from '../middlewares/security.middleware.js';

const router = Router();

router.get('/',      getAll);
router.post('/',     limiter, sanitize, validateUser, create);
router.patch('/:id', limiter, sanitize, update);
router.delete('/:id',limiter, remove);

export default router;