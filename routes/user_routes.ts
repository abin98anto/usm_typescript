import { Router } from "express";
import UserController from "../controllers/user_controller";
import AuthMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", AuthMiddleware.is_loggedout, UserController.render_signup);
router.post("/", UserController.create_user);

router.get(
  "/login",
  AuthMiddleware.is_loggedout,
  UserController.render_user_login
);
router.post("/login", UserController.verify_login);

router.get(
  "/dashboard",
  AuthMiddleware.is_loggedin,
  UserController.render_user_dashboard
);

router.post("/check-email", UserController.check_email);
router.post("/logout", UserController.user_logout);

export default router;
