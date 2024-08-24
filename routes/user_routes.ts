import { Router } from "express";
import UserController from "../controllers/user_controller";

const router = Router();

router.get("/", UserController.render_signup);
router.get("/login", UserController.render_user_login);
router.get("/dashboard", UserController.render_user_dashboard);

export default router;