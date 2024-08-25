import { Request, Response } from "express";
import crypto from "crypto";
import { Pool } from "pg";
import User from "../models/user_model";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret-key";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usm_ts",
  password: "qwerty",
  port: 5432,
});

// Render sign up page / landing page.
function render_signup(req: Request, res: Response) {
  try {
    return res.render("sign_up");
  } catch (error) {
    console.log("Error loading the signup page", error);
  }
}

// Render login page.
function render_user_login(req: Request, res: Response) {
  try {
    // res.setHeader(
    //   "Cache-Control",
    //   "no-store, no-cache, must-revalidate, proxy-revalidate"
    // );
    // res.setHeader("Pragma", "no-cache");
    // res.setHeader("Expires", "0");
    return res.render("user_login");
  } catch (error) {
    console.log("Error rendering login page", error);
  }
}

// Render user dashboard page.
async function render_user_dashboard(req: Request, res: Response) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number };
    const userId = decoded.user_id;
    console.log(decoded);
    console.log(userId);
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    // console.log(result);

    if (result.rowCount === 0) {
      return res.status(404).send("User not found.");
    }

    const user = result.rows[0];
    const { password, ...userWithoutPassword } = user;
    console.log(user);
    return res.render("user_dashboard", { user: userWithoutPassword });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).send("Internal server error");
  }
}

// To check if email exists in our database.
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

// Create New User.
async function create_user(req: Request, res: Response) {
  const { name, email, password, profileImage } = req.body;

  try {
    const username = name;

    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Insert the new user into the database with the image URL from Cloudinary
    await pool.query(
      "INSERT INTO users (username, email, password, isAdmin, imageUrl) VALUES ($1, $2, $3, $4, $5)",
      [username, email, hashPassword, false, profileImage]
    );

    res.status(200).send();
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Login Funtionality.
async function verify_login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, hashPassword]
    );

    const exists = result.rowCount !== null && result.rowCount > 0;

    if (exists) {
      const user = result.rows[0];

      // Generate JWT Token
      const token = jwt.sign(
        { user_id: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(token);
      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Use true in production with HTTPS
        maxAge: 3600000, // 1 hour
      });

      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Logout Functionality.
function user_logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.redirect("/login");
}

export default {
  render_signup,
  render_user_login,
  render_user_dashboard,
  create_user,
  check_email,
  verify_login,
  user_logout,
};
