require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const db = require("./models/index");
const authRoute = require("./routes/auth-route");

const authenticate = require("./middlewares/authenticate");
const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(helmet());
app.use(express.json());

app.get("/", async function (req, res) {
  try {
    await db.sequelize.authenticate();
    res.send("Connection has been established successfully.");
    //   res.send("Express is working on IISNode!");
  } catch (err) {
    res.send(err);
  }
});

// app.get("/", async (req, res) => {
//   try {
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// });

app.use("/auth", authRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
