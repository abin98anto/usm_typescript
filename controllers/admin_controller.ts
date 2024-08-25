import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import cloudinary from "cloudinary";

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
async function render_admin_dashboard(req: Request, res: Response) {
  try {
    const result = await pool.query(
      "SELECT id, username, email, isAdmin, imageUrl, createdOn FROM users"
    );

    const users = result.rows;

    res.render("admin_dashboard", { users });
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

      res.cookie("admin_token", token, {
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

// Admin Logout functionality.
function admin_logout(req: Request, res: Response) {
  try {
    res.clearCookie("admin_token");
    res.redirect("/admin/");
  } catch (error) {
    return res.status(500).send(`Error logging out user: ${error}`);
  }
}

// Get single user data
async function get_user_data(req: Request, res: Response) {
  try {
    console.log("hhh");
    const userId = req.query.id;

    const result = await pool.query(
      "SELECT id, username, email, isadmin, imageurl FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send(`Error fetching user data: ${error}`);
  }
}

// Update user data.
async function update_user(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const { username, email, isadmin, imageurl } = req.body;

    await pool.query(
      "UPDATE users SET username = $1, email = $2, isadmin = $3, imageurl = $4 WHERE id = $5",
      [username, email, isadmin, imageurl, userId]
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send(`Error updating user data: ${error}`);
  }
}

export default {
  render_admin_login,
  render_admin_dashboard,
  verify_admin_login,
  admin_logout,
  get_user_data,
  update_user,
};
