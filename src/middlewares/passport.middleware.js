const passport = require("passport");
const { userModel } = require("../models/users.model");
const { hashPassword, isValidPassword } = require("../hash");
const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github2").Strategy;

const passportJwt = require("passport-jwt");
const { SECRET_KEY } = require("../config/constants");
const { cookieExtractor } = require("../jwt");

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt; //where are we going to extract token info

//local strategy
passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          done(null, false);
        } else {
          if (!isValidPassword(user, password)) {
            done(null, false);
          } else {
            const role =
              username === "adminCoder@coder.com" &&
              password === "adminCod3r123"
                ? "admin"
                : "user";

            const sessionUser = {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              age: user.age,
              email: user.email,
              role,
            };
            done(null, sessionUser);
          }
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, username, password, done) => {
      const { first_name, last_name, age } = req.body;
      try {
        const user = await userModel.findOne({ email: username });
        if (user) {
          done(null, false);
        } else {
          const newUser = {
            first_name,
            last_name,
            age,
            email: username,
            password: hashPassword(password),
          };
          const userDB = await userModel.create(newUser);

          const role =
            username === "adminCoder@coder.com" && password === "adminCod3r123"
              ? "admin"
              : "user";

          const sessionUser = {
            _id: userDB._id,
            first_name: userDB.first_name,
            last_name: userDB.last_name,
            age: userDB.age,
            email: userDB.email,
            role,
          };
          done(null, sessionUser);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

//github strategy

passport.use(
  new GithubStrategy(
    {
      clientID: "Iv1.6b53e62288fdd888",
      clientSecret: "c41594f7bf776451055ceb068ab2210e29fa9fcb",
      callbackURL: "http://localhost:8080/api/sessions/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = profile._json;
        const user = await userModel.findOne({ emai: userData.email });
        if (!user) {
          const newUser = {
            first_name: userData.name.split(" ")[0],
            last_name: userData.name.split(" ")[1],
            age: userData.age || null,
            email: userData.email || null,
            password: null,
            githubLogin: userData.login || null,
          };

          const response = await userModel.create(newUser);
          done(null, response._doc);
        } else {
          done(null, user);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

//JWT strategy

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: SECRET_KEY,
    },
    async (jwt_payload, done) => {
      try {
        const user = await userModel.findOne({ email: jwt_payload.email });
        if (!user) {
          done(null, false, {messages: "User not found"});
        }
        if (!isValidPassword(user, password)) {
          done(null, false, {messages: "Invalid credentials"});
        }
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

module.exports = passport;
