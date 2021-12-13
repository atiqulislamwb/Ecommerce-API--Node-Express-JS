import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import {
  errorHandlerMiddleware,
  notFoundHandlerMiddleware,
} from "./middleware/allErrorMiddleware.js";

import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import reviewRoute from "./routes/reviewRoute.js";

import helmet from "helmet";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
const app = express();

app.set("trust-proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 200, //limit each ip to 200 request per windowMs
  })
);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "This is a E-commerce Api" });
});

//route define here

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/reviews", reviewRoute);

app.use(errorHandlerMiddleware);
app.use(notFoundHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.MONGO_URI;

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
