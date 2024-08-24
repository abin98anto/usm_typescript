import { Sequelize } from "sequelize";

const sequelize = new Sequelize("usm_ts", "postgres", "qwerty", {
  host: "localhost",
  dialect: "postgres",
  logging: console.log, // Enable logging to see SQL queries
});

export default sequelize;
