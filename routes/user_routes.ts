import { Router } from "express";
import UserController from "../controllers/user_controller";

const router = Router();

router.get("/", UserController.render_signup);
router.get("/login", UserController.render_user_login);
router.get("/dashboard", UserController.render_user_dashboard);
router.post("/check-email", UserController.check_email);
router.post("/", UserController.create_user);

export default router;
