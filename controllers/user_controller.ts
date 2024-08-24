import { Request, Response } from "express";
import crypto from "crypto";
import { Pool } from "pg";
import cloudinary from "cloudinary";

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
function render_user_dashboard(req: Request, res: Response) {
  return res.render("user_dashboard");
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

// Create new user.
// async function create_user(req: Request, res: Response) {
//   const { name, email, password, image } = req.body;

//   try {
//     const username = name;

//     const hashPassword = crypto
//       .createHash("sha256")
//       .update(password)
//       .digest("hex");

//     const uploadResponse = await cloudinary.v2.uploader.upload(image, {
//       folder: "user_images",
//     });

//     const imageUrl = uploadResponse.secure_url;

//     await pool.query(
//       "INSERT INTO users (username, email, password, isAdmin) VALUES ($1, $2, $3, $4)",
//       [username, email, hashPassword, false, imageUrl]
//     );

//     res.status(200).send();
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// Create new user.
// async function create_user(req: Request, res: Response) {
//   console.log("1");

//   const { name, email, password, image } = req.body;
//   console.log("2");

//   //   if (!image) {
//   //       console.log("3");
//   //     return res.status(400).json({ error: "Image is required." });
//   //   }

//   try {
//     const username = name;

//     const hashPassword = crypto
//       .createHash("sha256")
//       .update(password)
//       .digest("hex");
//     console.log("4");

//     const uploadResponse = await cloudinary.v2.uploader.upload(image, {
//       folder: "Home",
//       upload_preset: "gkrbyxgv",
//     });

//     console.log("5");

//     const imageUrl = uploadResponse.secure_url;
//     console.log("5");
//     await pool.query(
//       "INSERT INTO users (username, email, password, isAdmin, imageUrl) VALUES ($1, $2, $3, $4, $5)",
//       [username, email, hashPassword, false, imageUrl]
//     );
//     console.log("6");
//     res.status(200).send();
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

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


export default {
  render_signup,
  render_user_login,
  render_user_dashboard,
  create_user,
  check_email,
};
