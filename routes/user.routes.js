import { Router } from 'express';
import { verifyJWT } from '../middlewares/verifyJwt.middlewares.js';
import { loginUser } from '../controllers/User.controllers.js';

const router = Router();

router.route('/loginUser').post(verifyJWT, loginUser);

export default router;