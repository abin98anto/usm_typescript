import { Sequelize } from "sequelize";

const sequelize = new Sequelize("usm_ts", "postgres", "qwerty", {
  host: "localhost",
  dialect: "postgres",
});

export default sequelize;
