import express from "express";
import passport from "passport";
import { IUserSQL, IUserTS } from "../interfaces/interfaces";
import jwt from "jsonwebtoken";

export const router = express.Router()

// * login
router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err: Error, user: IUserSQL & IUserTS, info: any) => {
        try {
          if (err || !user) return next(err || new Error('An error occurred.'));

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { 
                userId: user.userId || user.user_id, 
                email: user.email 
              };
              const token = jwt.sign(
                { user: body }, 
                'TOP_SECRET'
              );

              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

// * signup
// router.post(
//   '/signup',
//   passport.authenticate('signup', { session: false }),
//   async (req, res) => {
//     res.json({
//       message: 'Signup successful',
//       user: req.user
//     });
//   }
// );