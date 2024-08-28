import express from "express";
import path from "path";
import sequelize from "./config/database";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import nocache from "nocache";

import UserRoute from "./routes/user_routes";
import AdminRoute from "./routes/admin_routes";

cloudinary.v2.config({
  cloud_name: "dqjjysikb",
  api_key: "693894612636766",
  api_secret: "yJTpRqj1xwIC1KrJ6c1twQdq2qU",
});

const app = express();

app.use(nocache());
app.use(cookieParser());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views", "users"),
  path.join(__dirname, "views", "admin"),
  path.join(__dirname, "views", "partials"),
]);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", UserRoute);
app.use("/admin", AdminRoute);

sequelize
  .sync({ force: false })
  .then(() => console.log("database and tables created!"));

app.listen(3000, () => console.log("server started : http://localhost:3000/"));

