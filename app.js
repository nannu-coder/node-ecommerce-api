require("dotenv").config();
require("express-async-errors");
const cors = require("cors");

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const morgan = require("morgan");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 5000;

//Database
const connectDB = require("./DB/ConnectDB");
//Paths
const notFoundMiddleware = require("./Middleware/Not-Found");
const errorHandlerMiddleware = require("./Middleware/ErrorHandler");
const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoutes");
const productRoute = require("./Routes/ProductRoute");
const reviewRoute = require("./Routes/ReviewRoute");
const orderRoute = require("./Routes/OrderRouter");

//Middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());
app.use(express.static("./public"));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Ecommerce API!");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("Ecommerce API!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/orders", orderRoute);

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
