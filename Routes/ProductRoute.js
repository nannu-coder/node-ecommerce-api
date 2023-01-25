const router = require("express").Router();

const {
  authenticateUser,
  authorization,
} = require("../Middleware/Authenticate");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../Controllers/ProductController");

router
  .route("/")
  .post([authenticateUser, authorization("admin")], createProduct)
  .get(getAllProducts);
router.route("/upload").post(uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorization("admin")], updateProduct)
  .delete(deleteProduct);

module.exports = router;
