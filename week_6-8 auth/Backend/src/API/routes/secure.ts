import express, { RequestHandler } from 'express';
import passport from 'passport';

export const router = express.Router();

const profileHandler: RequestHandler = (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.secret_token
  })
}

router.get('/users/profile', passport.authenticate('jwt', { session: false }), profileHandler);