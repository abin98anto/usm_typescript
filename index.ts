import express, { Express, Request, Response } from "express";
import path from "path";
import sequelize from "./config/database";
import { Pool } from "pg";
import cloudinary from "cloudinary";
import session from "express-session";
import cookieParser from "cookie-parser";
import nocache from "nocache";

cloudinary.v2.config({
  cloud_name: "dqjjysikb",
  api_key: "693894612636766",
  api_secret: "yJTpRqj1xwIC1KrJ6c1twQdq2qU",
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usm_ts",
  password: "qwerty",
  port: 5432,
});
import UserRoute from "./routes/user_routes";

const app = express();

app.use(nocache());
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views", "users"),
  path.join(__dirname, "views", "admin"),
  path.join(__dirname, "views", "partials"),
]);

// user side.
app.use("/", UserRoute);

sequelize
  .sync({ force: false })
  .then(() => console.log("database and tables created!"));

app.listen(3000, () => console.log("server started : http://localhost:3000/"));
