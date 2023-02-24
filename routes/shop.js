var express = require('express');
var router = express.Router();
const shopController = require('../controllers/shopController')
const { body } = require('express-validator');

/* GET home page. */
router.get('/', shopController.shop);
// router.get('/lamp', shopController.lamp);
router.get('/:id', shopController.show);
router.post('/', [
    body("name").not().isEmpty().withMessage("กรุณาใส่ชื่อร้านด้วย"),
], shopController.insert);
router.delete('/:id',shopController.delete)

module.exports = router;
