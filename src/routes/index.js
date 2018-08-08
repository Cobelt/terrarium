import express from "express";
const router = express.Router();
import AuthenticationCtrl from '../controllers/Authentication';

import UserRoutes from './User';
import AuthRoutes from './Authentication';

router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);

router.get('/session', AuthenticationCtrl.getSessionInfos);

export default router;