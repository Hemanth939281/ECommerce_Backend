const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists or password too short
 */
router.post("/register", userCtrl.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: User does not exist or incorrect password
 */
router.post("/login", userCtrl.login);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.get("/logout", userCtrl.logout);

/**
 * @swagger
 * /refreshtoken:
 *   get:
 *     summary: Get a new access token using the refresh token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: New access token returned
 *       400:
 *         description: Refresh token is missing or invalid
 */
router.get("/refreshtoken", userCtrl.refreshtoken);

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Get user information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User information returned
 *       401:
 *         description: Unauthorized
 */
router.get("/info", auth, userCtrl.getUser);

module.exports = router;
