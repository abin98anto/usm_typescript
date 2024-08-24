"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = require("path");
var app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", [
    path_1.default.join(__dirname, "views", "users"),
    path_1.default.join(__dirname, "views", "admin"),
    path_1.default.join(__dirname, "views", "partials"),
]);
app.get("/", function (req, res) { return res.render("sign_up"); });
app.listen(3000, function () { return console.log("server started : http://localhost:3000/"); });
