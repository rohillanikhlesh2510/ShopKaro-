const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");


const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("wishlist")
      .populate({
        path: "wishlist",
        select: "title price thumbnail brand stock isActive category",
        populate: { path: "category", select: "name slug" },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error.message);
    return res.status(500).json({ message: "Server error while fetching wishlist" });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Customer
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(409).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(product._id);
    await user.save();

    return res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error("Add to wishlist error:", error.message);
    return res.status(500).json({ message: "Server error while adding to wishlist" });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Customer
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wasInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!wasInWishlist) {
      return res.status(404).json({ message: "Product not in wishlist" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    return res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Remove from wishlist error:", error.message);
    return res.status(500).json({ message: "Server error while removing from wishlist" });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Customer
const clearWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { wishlist: [] });
    return res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    console.error("Clear wishlist error:", error.message);
    return res.status(500).json({ message: "Server error while clearing wishlist" });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
