import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user_model";
import { Pool } from "pg";

const JWT_SECRET = "secret-key";
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usm_ts",
  password: "qwerty",
  port: 5432,
});

// Render admin login page.
function render_admin_login(req: Request, res: Response) {
  try {
    res.render("admin_login.ejs");
  } catch (error) {
    res.status(500).send(`error rendering admin login page: ${error}`);
  }
}

// Render admin dashboard.
function render_admin_dashboard(req: Request, res: Response) {
  try {
    res.render("admin_dashboard");
  } catch (error) {
    res.status(500).send(`error rendering admin dashboard : ${error}`);
  }
}

// Verify admin login.
async function verify_admin_login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, hashPassword]
    );

    const user = result.rows[0];

    if (user && user.isadmin) {
      const token = jwt.sign(
        { user_id: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("admin-token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });

      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in admin:", error);
    return res.status(500).send(`Error logging in admin: ${error}`);
  }
}

export default {
  render_admin_login,
  render_admin_dashboard,
  verify_admin_login,
};
