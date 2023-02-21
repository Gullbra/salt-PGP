import md5 from "md5";
import passport from "passport";
import { Strategy as localStrategy} from "passport-local"
import { ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";

import db from "./database";

// * JWT sign Token
passport.use(
  new JwtStrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// * Login
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        db.get(`SELECT * WHERE email = ?`, [email], (err, result) => {
          if (err) throw err
          if (!result.password) return done(null, false, { message: 'User not found' })

          console.log("password compare:", password, md5(result.password), result)
          if(password !== md5(result.password)) return done(null, false, { message: 'Wrong Password' })

          return done(null, result, { message: 'Logged in Successfully' })
        })
      }
      catch (error) { return done(error); }
    }
  )
);

// * Sign up:
// passport.use(
//   'signup',
//   new localStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password'
//     },
//     async (email, password, done) => {
//       try {
//         const user = await UserModel.create({ email, password });

//         return done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );