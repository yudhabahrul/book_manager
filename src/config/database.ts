import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db_name = process.env.DB_NAME;
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD || "";

const sequelize = new Sequelize(
  db_name as string,
  db_username as string,
  db_password as string,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default sequelize;
