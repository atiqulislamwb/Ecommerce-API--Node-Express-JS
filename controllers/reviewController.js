import Review from "../models/ReviewSchema.js";
import Product from "../models/ProductSchema.js";

import { checkPermissions } from "../utils/index.js";

export const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    res.status(401).send({ msg: `No product with id : ${productId}` });
  }

  const reviewAlreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (reviewAlreadySubmitted) {
    res.status(402).send({ msg: "Already submitted review for this product" });
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(200).json({ review });
};

export const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(201).json({ reviews, count: reviews.length });
};

export const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    res.status(402).send({ msg: `No review with id ${reviewId}` });
  }

  res.status(202).json({ review });
};

export const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    res.status(402).send({ msg: `No review with id ${reviewId}` });
  }

  checkPermissions(req.user, review.user);

  const newReview = await Review.findByIdAndUpdate(
    { _id: reviewId },
    { rating, title, comment },
    { new: true, runValidators: true }
  );
  await newReview.save();
  res.status(202).json({ newReview });
};

export const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    res.status(402).send({ msg: `No review with id ${reviewId}` });
  }

  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(203).json({ msg: "Success! Review removed" });
};

export const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const review = await Review.find({ product: productId });
  res.status(201).json({ review, count: review.length });
};
