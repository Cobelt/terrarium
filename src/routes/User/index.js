import express from "express";
const router = express.Router();

import User from '../../controllers/User';

/**
 * Sign in
 * Crée un utilisateur sans mot de passe.
 */
router.get('/list', User.getAll);

router.get('/:userId/personal', User.getPersonalInfos, User.send);
router.get('/:userId/generic', User.getLoginInfos, User.send);
router.get('/:userId', User.get, User.send);

router.get('/', (req, res) => res.redirect('/user/list'));
router.post('/', User.create, User.send);

export default router;