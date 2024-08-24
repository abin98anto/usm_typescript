import { Request, Response } from "express";
import User from "../models/user_model";
import crypto from "crypto";
import { Pool } from "pg";
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usm_ts",
  password: "qwerty",
  port: 5432,
});

function render_signup(req: Request, res: Response) {
  return res.render("sign_up");
}

function render_user_login(req: Request, res: Response) {
  return res.render("user_login");
}

function render_user_dashboard(req: Request, res: Response) {
  return res.render("user_dashboard");
}

// function create_user(req: Request, res: Response) {
//   try {
//     const { username, email, password } = req.body;

//     const hashPassword = crypto
//       .createHash("sha256")
//       .update(password)
//       .digest("hex");

//     const user = User.create({
//       username,
//       email,
//       password: hashPassword,
//     });

//     res.redirect("/login");
//   } catch (error) {
//     console.log("Error in create_user", error);
//     return;
//   }
// }

async function check_email(req: Request, res: Response) {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const exists = result.rowCount !== null && result.rowCount > 0;
    res.json({ exists });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function create_user(req: Request, res: Response) {
  const { name, email, password } = req.body;

  try {
    const username = name;
    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    await pool.query(
      "INSERT INTO users (username, email, password, isAdmin) VALUES ($1, $2, $3, $4)",
      [username, email, hashPassword, false]
    );
    res.status(200).send();
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default {
  render_signup,
  render_user_login,
  render_user_dashboard,
  create_user,
  check_email,
};
