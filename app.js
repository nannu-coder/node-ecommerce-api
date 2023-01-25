require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

//Database
const connectDB = require("./DB/ConnectDB");
//Paths
const notFoundMiddleware = require("./Middleware/Not-Found");
const errorHandlerMiddleware = require("./Middleware/ErrorHandler");
const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoutes");

//Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("Ecommerce API!");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("Ecommerce API!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

//Error Handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const StartDB = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

StartDB();
