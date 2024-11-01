import { Router } from 'express';
import { verifyJWT } from '../middlewares/verifyJwt.middlewares.js';

import { loginUser, registerUser } from '../controllers/User.controllers.js';

const router = Router();

router.route('/registerUser').post(
    registerUser)
router.route('/loginUser').post(loginUser);

export default router;