import {Router} from 'express';
import {verifyJWT} from '../middlewares/verifyJwt.middlewares.js';

import {loginUser,registerUser,logoutUser,forgotPassword,resetPassword} from '../controllers/User.controllers.js';

const router=Router();

router.route('/registerUser').post(
    registerUser)
router.route('/loginUser').post(loginUser);
router.route('/logoutUser').post(logoutUser);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword').post(resetPassword)

export default router;