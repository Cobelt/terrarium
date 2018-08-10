const router = require('express').Router();
import AuthenticationCtrl from '../../controllers/Authentication';

router.post('/login', AuthenticationCtrl.login);
router.get('/logout', AuthenticationCtrl.logout);

router.get('/login/:username/:password', AuthenticationCtrl.simulateConnectionForm, AuthenticationCtrl.login);

export default router;