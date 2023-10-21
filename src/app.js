require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Express is working on IISNode!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
