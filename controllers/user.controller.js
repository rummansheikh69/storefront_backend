import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { comment, rating } = req.body;
  const userId = req.user._id

  const user = await User.findById(userId)

  if (!productId || !comment || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const review = await Review.create({
    product: productId,
    rating,
    comment,
    user: { name:user.name, _id: user._id },
  });

  res.status(201).json(review);
});
