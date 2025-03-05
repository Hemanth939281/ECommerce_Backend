const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const productCtrl = require("../controllers/productCtrl");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - product_id
 *         - title
 *         - content
 *         - description
 *         - price
 *         - category
 *         - image
 *       properties:
 *         product_id:
 *           type: string
 *           description: Unique identifier for the product
 *         title:
 *           type: string
 *           description: Product title
 *         content:
 *           type: string
 *           description: Product content
 *         description:
 *           type: string
 *           description: Detailed product description
 *         price:
 *           type: number
 *           description: Product price
 *         category:
 *           type: string
 *           description: Product category
 *         image:
 *           type: string
 *           description: Product image URL
 *       example:
 *         product_id: "12345"
 *         title: "Sample Product"
 *         content: "This is a sample product"
 *         description: "Detailed description of the sample product"
 *         price: 99.99
 *         category: "Electronics"
 *         image: "https://example.com/sample.jpg"
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.route("/products")
  .get(productCtrl.getProducts)
  .post(productCtrl.createProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.route("/products/:id")
  .get(productCtrl.getProductById)
  .put(productCtrl.updateProducts)
  .delete(productCtrl.deleteProducts);

module.exports = router;
