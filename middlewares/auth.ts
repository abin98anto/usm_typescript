import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret-key";

// To check if user is logged in before proceeding.
function is_loggedin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (token) {
      try {
        jwt.verify(token, JWT_SECRET);
        return next();
      } catch (error) {
        console.log("Invalid token:", error);
        return res.redirect("/login");
      }
    }

    res.redirect("/login");
  } catch (error) {
    res
      .status(500)
      .send(`Error in is_loggedin function (auth middleware): ${error}`);
  }
}

// To check if user is logged out before proceeding.
function is_loggedout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (token) {
      return res.redirect("/dashboard");
    }

    next();
  } catch (error) {
    res
      .status(500)
      .send(`Error in is_loggedout function (auth middleware): ${error}`);
  }
}

export default { is_loggedin, is_loggedout };
