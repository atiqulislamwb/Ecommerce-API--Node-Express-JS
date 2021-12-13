import Product from "../models/ProductSchema.js";
import path from "path";

export const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);
  res.status(200).json({ product });
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(201).json({ products, count: products.length });
};

export const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");
  if (!product) {
    res.status(405).send({ msg: `No product with id : ${productId}` });
  }

  res.status(203).json({ product });
};

export const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(405).send({ msg: `No product with id : ${productId}` });
  }

  res.status(203).json({ product });
};

export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    res.status(405).send({ msg: `No product with id : ${productId}` });
  }

  await product.remove();
  res.status(204).json({ product });
};

export const uploadImage = async (req, res) => {
  if (!req.files) {
    res.status(505).send({ msg: "No File Uploaded" });
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    res.status(505).send({ msg: "No File Uploaded" });
  }

  const maxSize = 1024 * 1024 * 5;

  if (productImage.size > maxSize) {
    res.status(505).send({ msg: "Please upload image smaller than 5MB" });
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);

  res.status(200).json({ image: `/uploads/${productImage.name}` });
};
