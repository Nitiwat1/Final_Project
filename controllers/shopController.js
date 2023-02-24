const Shop = require("../models/shop");
// const Brand = require("../models/brand");
const Lamp = require("../models/lamp");

const { validationResult } = require("express-validator");

exports.shop = async (req, res, next) => {
  const shops = await Shop.find().select('name photo location').sort({ _id: -1 });
  const shopWithPhotoDomain = await shops.map((shop) => {
      return {
          id: shop._id,
          name: shop.name,
      }
  })
  res.status(200).json({
      data: shopWithPhotoDomain,
  })
};

exports.insert = async (req, res, next) => {
  try {
    const { name, } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let shop = new Shop({
      name: name,
    });

    await shop.save();

    res.status(201).json({
      message: `Insert Shop: ${shop.name} ✔ Successfully`,
    });
  } catch (err) {
    next(err);
  }
};

// exports.show = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error("received incorrect information.❗");
//       error.statusCode = 422;
//       error.validation = errors.array();
//       throw error;
//     }
//     const shop = await Shop.findById(id)
//       .populate("brands", "name description")
//       .select("name description");

//     res.status(200).json({
//       data: shop,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.show = async (req, res, next) => {
  const shops = await Shop.findById(req.params.id).populate("lamp");
  const lamps = await Lamp.find({shop:shops._id});
  console.log(shops._id)
  res.status(200).json({
      shopdata: shops,
      lampdata: lamps
  });
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const beforeUpdate = await Shop.findById(id);

    const shop = await Shop.findByIdAndUpdate(id, {
      name: name || beforeUpdate.name,
      description: description || beforeUpdate.description,
    });

    if (!shop) {
      const error = new Error("หาร้านไม่เจอ");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      message: "การอัพเดทข้อมูลเสร็จเรียบร้อย",
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  /* http://localhost:3000/staff/63942d89bf53fc309c987962 */
  /* router.get('/id', staffcontroller.show) */
  try {
      const { id } = req.params
      const shop = await Shop.deleteOne({
          _id: id
      })
      if (!shop.deleteCount === 0) {
          const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูลผู้ใช้งาน")
          error.statusCode = 400
          throw error;
      } else {
          res.status(200).json({
              message: 'ลบข้อมูลเรียบร้อยแล้ว',
          })
      }
  } catch (error) {
      next(error)
  }
};
