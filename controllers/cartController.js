const User = require("../Models/userModel");

// Update the user's cart (add or update items)
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the request
    const { cart } = req.body; // Get the updated cart from the request body

    // Validate cart data
    if (!Array.isArray(cart)) {
      return res.status(400).json({ msg: "Invalid cart data" });
    }

    // Find user by ID and update their cart
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cart },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Cart updated successfully", cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get the user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the request

    // Find the user and get the cart
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete an item from the user's cart
const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the request
    const productId = req.params.id; // Get the product ID from the request parameters
    console.log("Deleting product ID:", productId);

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Filter out the item to be removed based on productId
    const updatedCart = user.cart.filter(item => item.productId !== productId);
    
    // Check if any items were removed
    if (user.cart.length === updatedCart.length) {
      console.log("No items were removed. Item may not exist in cart.");
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    // Update the cart in the database
    user.cart = updatedCart;
    await user.save(); // Save the updated user document
    
    console.log("Cart updated:", updatedCart);
    res.json({ msg: "Item removed from cart", cart: updatedCart });
  } catch (error) {
    console.error("Error in deleteCart:", error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  updateCart,
  getCart,
  deleteCart,
};