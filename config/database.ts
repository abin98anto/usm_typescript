import { Sequelize } from "sequelize";

const sequelize = new Sequelize("usm_ts", "postgres", "qwerty", {
  host: "localhost",
  dialect: "postgres",
  logging: console.log,
});

export default sequelize;
