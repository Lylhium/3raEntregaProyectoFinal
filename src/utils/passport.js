import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github";
import {
  authenticateUser,
  getUserByEmail,
  findOrCreateUser,
} from "../controllers/user.controller.js";
//import mongoose from "mongoose";

// Configuración de la estrategia de autenticación local
passport.use(
  new LocalStrategy(
    "userAuthentication",
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await authenticateUser(email, password);
        if (!user) {
          return done(null, false, { message: "Credenciales inválidas" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//github authentication
passport.use(
  new GitHubStrategy(
    {
      clientID: "669021d7483928f0cbc4",
      clientSecret: "b9c55cc02b7114859d48ec1b031f603016fe43c8",
      callbackURL: "/auth/github/callback",
    },
    async (_, __, profile, done) => {
      try {
        const wrappedDone = (error, user) => {
          if (error) {
            return done(error);
          }
          return done(null, user);
        };

        await findOrCreateUser(profile, wrappedDone);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  const serializedUser = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    age: user.age,
  };
  done(null, serializedUser);
});

passport.deserializeUser(async (serializedUser, done) => {
  try {
    console.log("Usuario serializado:", serializedUser);

    const user = await getUserByEmail(serializedUser.email);
    console.log("Usuario:", user);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
