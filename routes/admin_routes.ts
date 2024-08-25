import { Router } from "express";
import AdminController from "../controllers/admin_controller";
import AdminAuth from "../middlewares/admin_auth";

const admin_router = Router();

admin_router.get(
  "/",
  AdminAuth.is_loggedout,
  AdminController.render_admin_login
);
admin_router.post("/", AdminController.verify_admin_login);

admin_router.get(
  "/dashboard",
  AdminAuth.is_loggedin,
  AdminController.render_admin_dashboard
);

admin_router.post("/logout", AdminController.admin_logout);

export default admin_router;
