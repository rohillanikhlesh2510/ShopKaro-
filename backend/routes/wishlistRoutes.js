const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("customer"));

router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/", clearWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;
