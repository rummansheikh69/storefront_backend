import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { comment, rating } = req.body;

  if (!productId || !comment || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const existingReview = await Review.findOne({
    product: productId,
    "user._id": req.user._id,
  });

  if (existingReview) {
    return res
      .status(400)
      .json({ message: "You have already submitted a review" });
  }

  const review = await Review.create({
    product: productId,
    rating,
    comment,
    user: {
      name: req.user.name,
      _id: req.user._id,
    },
  });

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  product.rating = stats[0]?.avgRating || 0;
  await product.save();

  const totalReviews = await Review.countDocuments({ product: productId });
  product.totalReviews = totalReviews;
  await product.save();

  res.status(201).json(review);
});
