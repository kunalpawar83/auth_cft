const express = require("express");
const { connectDB } = require("./utils/db.js");
const authRoutes = require("./routes/authRoutes.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", authRoutes);
connectDB();
app.listen(8000, () => {
  console.log(`server is started`);
});
