import express from "express";
const router = express.Router();

import User from '../../controllers/User';

/**
 * Sign in
 * Crée un utilisateur sans mot de passe.
 */
router.get('/new/:username/:password', User.simulateCreationForm, User.create);
router.get('/list', User.mapAll, User.send);
router.get('/:userId', User.get, User.send);

router.post('/', User.create);

export default router;