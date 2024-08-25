import { Request, Response } from "express";
import crypto from "crypto";
import { Pool } from "pg";
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
    return res.status(500).send(`Error rendering signup page : ${error}`);
  }
}

// Render login page.
function render_user_login(req: Request, res: Response) {
  try {
    return res.render("user_login");
  } catch (error) {
    return res.status(500).send(`Error login page : ${error}`);
  }
}

// Render user dashboard page.
async function render_user_dashboard(req: Request, res: Response) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number };
    const userId = decoded.user_id;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).send("User not found.");
    }

    const user = result.rows[0];
    const { password, ...userWithoutPassword } = user;
    res.render("user_dashboard", { user: userWithoutPassword });
  } catch (error) {
    return res.status(500).send(`Error fetching user data: ${error}`);
  }
}

// To check if email exists in our database.
async function check_email(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const exists = result.rowCount !== null && result.rowCount > 0;
    res.json({ exists });
  } catch (error) {
    return res.status(500).send(`Error checking if the email exits : ${error}`);
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

    await pool.query(
      "INSERT INTO users (username, email, password, isAdmin, imageUrl) VALUES ($1, $2, $3, $4, $5)",
      [username, email, hashPassword, false, profileImage]
    );

    res.status(200).send();
  } catch (error) {
    return res.status(500).send(`Error creating a new user : ${error}`);
  }
}

// Login Funtionality.
async function verify_login(req: Request, res: Response) {
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

    const exists = result.rowCount !== null && result.rowCount > 0;

    if (exists) {
      const user = result.rows[0];

      const token = jwt.sign(
        { user_id: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });

      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).send(`Error logging in user : ${error}`);
  }
}

// Logout Functionality.
function user_logout(req: Request, res: Response) {
  try {
    res.clearCookie("token");
    res.redirect("/login");
  } catch (error) {
    return res.status(500).send(`Error logging out user: ${error}`);
  }
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
