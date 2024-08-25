import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret-key";

function is_loggedin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (token) {
      try {
        // Verify the token
        jwt.verify(token, JWT_SECRET);
        return next(); // Token is valid, proceed to the requested route
      } catch (error) {
        console.log("Invalid token:", error);
        return res.redirect("/login"); // Redirect to login if token is invalid
      }
    }

    // No token present, redirect to login
    res.redirect("/login");
  } catch (error) {
    console.log("Error in is_loggedin function (auth middleware):", error);
    res.status(500).send("Internal server error");
  }
}

function is_loggedout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (token) {
      res.redirect("/dashboard");
    }

    // No token present, redirect to login
    return next();
  } catch (error) {
    console.log("Error in is_loggedin function (auth middleware):", error);
    res.status(500).send("Internal server error");
  }
}

export default { is_loggedin, is_loggedout };
