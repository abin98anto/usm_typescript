import express, { Express, Request, Response } from "express";
import path from "path";

const app = express();

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views", "users"),
  path.join(__dirname, "views", "admin"),
  path.join(__dirname, "views", "partials"),
]);

// user side.
app.get("/", (req, res) => res.render("sign_up"));
app.get("/login", (req, res) => res.render("user_login"));
app.get("/dashboard", (req, res) => res.render("user_dashboard"));

app.listen(3000, () => console.log("server started : http://localhost:3000/"));
