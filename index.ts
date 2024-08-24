import express, { Express, Request, Response } from "express";
import path from "path";
import sequelize from "./config/database";
import { Pool } from "pg";
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usm_ts",
  password: "qwerty",
  port: 5432,
});
import UserRoute from "./routes/user_routes";

const app = express();

app.use(express.json());

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
