import express from "express";
const router = express.Router();
import AuthenticationCtrl from '../controllers/Authentication';
import SchemaCtrl from '../controllers/Schema';

import UserRoutes from './User';
import AuthRoutes from './Authentication';

router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);

// add here every schemas to fetch and finish with send
router.get('/schemas', SchemaCtrl.initialize, SchemaCtrl.getAll, SchemaCtrl.send);

router.get('/session', AuthenticationCtrl.getSessionInfos);
router.get('/', AuthenticationCtrl.getSessionInfos);

export default router;