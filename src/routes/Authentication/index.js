const router = require('express').Router();
import AuthenticationCtrl from '../../controllers/Authentication';

router.post('/login', AuthenticationCtrl.login);
router.get('/logout', AuthenticationCtrl.logout);

export default router;