const express = require("express");
let router = express.Router();
const { body } = require("express-validator");
const lampController = require('../controllers/lampControllers')
const passportJWT = require("../middleware/passportJWT").isLogin;
const checkAdmin = require("../middleware/checkAdmin").isAdmin;

/* GET users listing. */
router.get("/", lampController.index);
router.post("/",
  [
    passportJWT,
    checkAdmin,
    body("name").not().isEmpty().withMessage("กรุณาใส่ชื่อโปรดัก"),
    body("brand")
      .not()
      .isEmpty()
      .withMessage("โปรดใส่ชื่อแบรนด์"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("โปรดใส่ราคา")
      .isNumeric("โปรดใส่เป็นตัวเลข"),
    body("detail.type")
      .not()
      .isEmpty()
      .withMessage("โปรดใส่ประเภทของสินค้า"),
    body("detail.stock")
      .isNumeric()
      .withMessage("โปรดใส่เป็นตัวเลข"),
    body("shop").not().isEmpty().withMessage("โปรดใส่ชื่อร้านค้า")
  ],
  lampController.insert);
router.get("/:id", lampController.show);
router.put(
  "/:id",
  [passportJWT, checkAdmin],
  lampController.update
);
router.delete("/:id", [passportJWT, checkAdmin], lampController.delete);

module.exports = router;
