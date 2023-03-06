import express, { Request, RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { RunResult } from "sqlite3";
import db from "../../dbConnect/database";
import md5 from "md5";

export const router = express.Router()

const signupHandler: RequestHandler = (req: Request, res) => {
  const newUserArr: (string | number)[] = []
  const errors: string[] = [];

  req.body.email ? newUserArr.push(req.body.email) : errors.push("No email provided");
  req.body.password ? newUserArr.push(md5(req.body.password)) : errors.push("No password provided");
  req.body.role ? newUserArr.push(req.body.role) : errors.push("No role provided");
  req.body.storeId ? newUserArr.push(req.body.storeId) : errors.push("No storeId provided");

  if (errors.length) return res.status(400).json({ "error": errors.join(", ") });

  const sql = `
    INSERT INTO user_data (email, password, role, store_id) 
    VALUES (?,?,?,?);
  `    
  return db.run(sql, newUserArr, function (this: RunResult, err: (Error | null)) {
    if (err) return res.status(400).json({ "error": err.message })

    return res.json({
      "message": "success",
      "data": {
        userId: this.lastID,
        email: newUserArr[0],
        password: newUserArr[1],
        role: newUserArr[2],
        storeId: newUserArr[3]
      },
    })
  })
}

const loginHandler: RequestHandler = async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err: (Error | null), user: {_id: number, email: string, password:string}, info: {message: string}) => {
      try {
        if (err || !user) return next(err || new Error('An error occurred.' + info.message));
        
        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);

            const token = jwt.sign({ user }, 'TOP_SECRET');

            return res.json({ token });
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
}

router
  .post('/signup', signupHandler)
  .post('/login', loginHandler);