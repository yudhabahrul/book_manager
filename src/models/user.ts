import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";

interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isVerified: boolean;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "role" | "isVerified"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: "admin" | "user";
  public isVerified!: boolean;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user", // Masih diatur ke 'user' jika tidak ada input
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Masih diatur ke false jika tidak ada input
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;
