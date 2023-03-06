import md5 from "md5";
import passport from "passport";
import { Strategy as localStrategy} from "passport-local"
import { ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import db from "../../dbConnect/database";


passport.use(
  new JwtStrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      console.log('hey')
      try {
        console.log('token:', token)
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        db.get(`SELECT * FROM user_data WHERE email = ?`, [email], (err, result) => {
          if (err) throw err
          if (!result.password) return done(null, false, { message: 'User not found' })

          if(md5(password) !== result.password) return done(null, false, { message: 'Wrong Password' })

          return done(null, result, { message: 'Logged in Successfully' })
        })
      }
      catch (error) {
        return done(error); 
      }
    }
  )
);