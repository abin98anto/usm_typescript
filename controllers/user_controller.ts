import { Request, Response } from "express";

function render_signup(req: Request, res: Response) {
  return res.render("sign_up");
}

function render_user_login(req: Request, res: Response) {
  return res.render("user_login");
}

function render_user_dashboard(req: Request, res: Response) {
  return res.render("user_dashboard");
}

export default {
  render_signup,
  render_user_login,
  render_user_dashboard,
};