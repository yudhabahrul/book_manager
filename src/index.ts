import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import bookRoutes from "./routes/books.js";
import sequelize from "./config/database.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
