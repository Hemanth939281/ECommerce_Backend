const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const cartController = require("../controllers/cartController");

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: API for managing the shopping cart
 */

/**
 * @swagger
 * /api/updateCart:
 *   post:
 *     summary: Update the user's cart (add/update items)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "60b8d295f8d2b623b8c8d123"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid cart data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/updateCart", auth, cartController.updateCart);

/**
 * @swagger
 * /api/getCart:
 *   get:
 *     summary: Retrieve the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's cart
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/getCart", auth, cartController.getCart);

/**
 * @swagger
 * /api/deleteCartItem/{id}:
 *   delete:
 *     summary: Remove an item from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: User or item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteCartItem/:id", auth, cartController.deleteCart);

module.exports = router;
