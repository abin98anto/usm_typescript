import { Router } from "express";
import AdminController from "../controllers/admin_controller";

const admin_router = Router();

admin_router.get("/", AdminController.render_admin_login);
admin_router.post("/", AdminController.verify_admin_login);

admin_router.get("/dashboard", AdminController.render_admin_dashboard);

admin_router.post("/logout", AdminController.admin_logout);

export default admin_router;
