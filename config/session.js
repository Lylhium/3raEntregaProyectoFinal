import session from "express-session";
import MongoStore from "connect-mongo";
const sessionMiddleware = session({
  secret: "clave123",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.mongodb,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});
export default sessionMiddleware;
