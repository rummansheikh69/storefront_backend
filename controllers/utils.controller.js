import { DigitalProduct } from "../models/digitalProduct.model.js";
import { Offer } from "../models/offer.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProducts = asyncHandler(async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const {
      minPrice,
      maxPrice,
      sort = "newest", // default sorting
    } = req.query;

    // 🔎 Build filter object
    let filter = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 🔄 Sorting logic
    let sortOption = {};

    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "rating_desc":
        sortOption = { rating: -1 };
        break;
      case "featured":
        sortOption = { rating: -1, totalReviews: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // 🔢 Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .select("-updatedAt -__v")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        hasMore: page * limit < totalProducts,
      },
    });
  } catch (error) {
    console.log("Error in getProducts", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getOffers = asyncHandler(async (req, res) => {
  try {
    const offers = await Offer.find().select(" -updatedAt -__v");
    res.status(200).json(offers);
  } catch (error) {
    console.log("Error in get offers", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getDigitalProducts = asyncHandler(async (req, res) => {
  try {
    const digitalProducts = await DigitalProduct.find()
      .select(" -updatedAt -__v")
      .sort({ createdAt: -1 });
    res.status(200).json(digitalProducts);
  } catch (error) {
    console.log("Error in get digital products", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.log("Error in get single product", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  if (!productId || productId === "undefined") {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const reviews = await Review.find({ product: productId }).sort({ _id: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      const products = await Product.find().select("-__v -updatedAt");
      return res.status(200).json({ products });
    }

    const products = await Product.find({
      title: { $regex: query, $options: "i" }, // case-insensitive search
    }).select("-__v -updatedAt");

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error searching products", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getProducts, getOffers, getDigitalProducts };
