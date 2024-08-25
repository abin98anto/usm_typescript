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
  return res.render("sign_up");
}

// Render login page.
function render_user_login(req: Request, res: Response) {
  return res.render("user_login");
}

// Render user dashboard page.
// async function render_user_dashboard(req: Request, res: Response) {
//   // const userId = req.session.user_id;

//   // if (!userId) {
//   //   return res.redirect("/login"); // Redirect to login if no user is logged in
//   // }

//   try {
//     // Fetch user data from the database
//     // const user = await User.findByPk(userId);

//     // if (!user) {
//     //   return res.status(404).send("User not found.");
//     // }

//     // // Exclude the password field
//     // const { password, ...userWithoutPassword } = user.toJSON();

//     // Render the dashboard view with user data
//     return res.render("user_dashboard");
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return res.status(500).send("Internal server error");
//   }
// }

// async function render_user_dashboard(req: Request, res: Response) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.redirect("/login");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // Verify the JWT token
//     const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number };
//     const userId = decoded.user_id;

//     // Fetch user data from the database
//     const result = await pool.query("SELECT * FROM users WHERE id = $1", [
//       userId,
//     ]);

//     if (result.rowCount === 0) {
//       return res.status(404).send("User not found.");
//     }

//     const user = result.rows[0];

//     // Exclude the password field
//     const { password, ...userWithoutPassword } = user;

//     // Render the dashboard view with user data
//     return res.render("user_dashboard", { user: userWithoutPassword });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return res.status(500).send("Internal server error");
//   }
// }

// async function render_user_dashboard(req: Request, res: Response) {
//   // const authHeader = req.headers.authorization;
//   // console.log(authHeader);
//   // if (!authHeader || !authHeader.startsWith("Bearer ")) {
//   //   return res.redirect("/login");
//   // }

//   const token = localStorage.getItem("token");
//   console.log(token);
//   if (!token) {
//     res.redirect("/login");
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number };
//     const userId = decoded.user_id;

//     const result = await pool.query("SELECT * FROM users WHERE id = $1", [
//       userId,
//     ]);

//     if (result.rowCount === 0) {
//       return res.status(404).send("User not found.");
//     }

//     const user = result.rows[0];
//     const { password, ...userWithoutPassword } = user;

//     return res.render("user_dashboard", { user: userWithoutPassword });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return res.status(500).send("Internal server error");
//   }
// }

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
// async function verify_login(req: Request, res: Response) {
//   const { email, password } = req.body;

//   try {
//     const hashPassword = crypto
//       .createHash("sha256")
//       .update(password)
//       .digest("hex");

//     const result = await pool.query(
//       "SELECT * FROM users WHERE email = $1 AND password = $2",
//       [email, hashPassword]
//     );
//     const exists = result.rowCount !== null && result.rowCount > 0;
//     if (exists) {
//       req.session.user_id = result.rows[0].id;
//       res.json({ success: true });
//     } else {
//       res.status(401).json({ success: false });
//     }
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// }

// async function verify_login(req: Request, res: Response) {
//   const { email, password } = req.body;

//   try {
//     const hashPassword = crypto
//       .createHash("sha256")
//       .update(password)
//       .digest("hex");
//     console.log(1);
//     const result = await pool.query(
//       "SELECT * FROM users WHERE email = $1 AND password = $2",
//       [email, hashPassword]
//     );
//     console.log(2);

//     const exists = result.rowCount !== null && result.rowCount > 0;

//     console.log(3);

//     if (exists) {
//       const user = result.rows[0];
//       console.log(4);

//       // Generate JWT Token
//       const token = jwt.sign(
//         { user_id: user.id, isAdmin: user.isAdmin },
//         JWT_SECRET,
//         { expiresIn: "1h" } // Token expires in 1 hour
//       );
//       console.log(5);

//       res.json({ success: true, token });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// }

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

export default {
  render_signup,
  render_user_login,
  render_user_dashboard,
  create_user,
  check_email,
  verify_login,
};
