import { Offer } from "../models/offer.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.model.js";

export const createProviderFull = async (req, res) => {
  try {
    const { name, image, categories } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!image) return res.status(400).json({ message: "Image is required" });

    // Ensure categories is array
    let parsedCategories = [];
    if (categories) {
      if (typeof categories === "string") {
        parsedCategories = JSON.parse(categories);
      } else if (Array.isArray(categories)) {
        parsedCategories = categories;
      }
    }

    // Convert offer.price to Number
    parsedCategories = parsedCategories.map((cat) => ({
      ...cat,
      offers: cat.offers.map((offer) => ({
        ...offer,
        price: Number(offer.price),
      })),
    }));

    // Upload Base64 image to Cloudinary
    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "providers",
    });

    const provider = await Offer.create({
      name,
      image: uploaded.secure_url,
      categories: parsedCategories,
    });

    res.status(201).json(provider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ message: "Error creating provider" });
  }
};

/** UPDATE provider info (name + image optional) */
export const updateProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { name, image } = req.body;

    const provider = await Offer.findById(providerId);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    if (name) provider.name = name;
    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "providers",
      });
      provider.image = uploaded.secure_url;
    }

    await provider.save();
    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating provider" });
  }
};

/** DELETE provider */
export const deleteProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await Offer.findByIdAndDelete(providerId);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Provider deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting provider" });
  }
};

/** UPDATE a category */
export const updateCategory = async (req, res) => {
  try {
    const { providerId, categoryId } = req.params;
    const { title } = req.body;

    const provider = await Offer.findById(providerId);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const category = provider.categories.id(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (title) category.title = title;
    await provider.save();
    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating category" });
  }
};

/** DELETE a category */
export const deleteCategory = async (req, res) => {
  try {
    const { providerId, categoryId } = req.params;

    const provider = await Offer.findById(providerId);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    provider.categories.id(categoryId).remove();
    await provider.save();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting category" });
  }
};

/** UPDATE an offer */
export const updateOffer = async (req, res) => {
  try {
    const { providerId, categoryId, offerId } = req.params;
    const { title, validity, price } = req.body;

    const provider = await Offer.findById(providerId);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const category = provider.categories.id(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const offer = category.offers.id(offerId);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    if (title) offer.title = title;
    if (validity) offer.validity = validity;
    if (price !== undefined) offer.price = Number(price);

    await provider.save();
    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating offer" });
  }
};

/** DELETE an offer */
export const deleteOffer = async (req, res) => {
  try {
    const { providerId, categoryId, offerId } = req.params;

    const provider = await Offer.findById(providerId);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const category = provider.categories.id(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.offers.id(offerId).remove();
    await provider.save();

    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting offer" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      inStock,
      rating,
      totalReviews,
      thumbnailImage,
      images,
    } = req.body;

    // Upload thumbnail
    const uploadedThumbnail = await cloudinary.uploader.upload(thumbnailImage, {
      folder: "products",
    });

    // Upload multiple images
    const uploadedImages = await Promise.all(
      images.map((img) =>
        cloudinary.uploader.upload(img, {
          folder: "products",
        }),
      ),
    );

    const newProduct = await Product.create({
      title,
      description,
      price,
      discountPrice,
      inStock,
      rating,
      totalReviews,
      thumbnailImage: uploadedThumbnail.secure_url,
      images: uploadedImages.map((img) => img.secure_url),
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If thumbnail is base64, upload again
    if (updateData.thumbnailImage?.startsWith("data:image")) {
      const uploadedThumbnail = await cloudinary.uploader.upload(
        updateData.thumbnailImage,
        { folder: "products" },
      );
      updateData.thumbnailImage = uploadedThumbnail.secure_url;
    }

    // If images updated
    if (
      updateData.images &&
      updateData.images.length &&
      updateData.images[0].startsWith("data:image")
    ) {
      const uploadedImages = await Promise.all(
        updateData.images.map((img) =>
          cloudinary.uploader.upload(img, { folder: "products" }),
        ),
      );

      updateData.images = uploadedImages.map((img) => img.secure_url);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
