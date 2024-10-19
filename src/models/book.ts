import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

interface BookAttributes {
  id?: number;
  title: string;
  author: string;
  description?: string;
}

class Book extends Model<BookAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public description?: string;
}

Book.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Book",
  }
);

export default Book;
