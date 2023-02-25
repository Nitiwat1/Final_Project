const Lamp = require("../models/lamp");
const Shop = require("../models/shop");
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');

exports.index = async (req, res, next) => {
    const lamp = await Lamp.find().select().sort({ _id: -1 });
    const shopWithPhotoDomain = await lamp.map((lamps) => {

        return {
            id: lamps._id,
            name: lamps.name,
            price:lamps.price,
            shop: lamps.shop,
            detail: lamps.detail    
        }
    })
    res.status(200).json({
        data: shopWithPhotoDomain,
    })
  };

exports.insert = async (req, res, next) => {
    try {
        const { name, detail, shop, price, brand } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        const checkShopid = await Shop.findById({ _id: shop });
        // console.log(checkShopid())
        if (!checkShopid) {
            const error = new Error("ไม่มี ID ร้านนี้อยู่ในข้อมูล❗");
            error.statusCode = 400;
            throw error;
        }

        let lamp = new Lamp({
            name: name,
            detail: detail,
            brand: brand,
            price: price,
            shop: shop,
        });

        await lamp.save();

        res.status(201).json({
            message: 'เพิ่่มข้อมูลเรียบร้อยแล้ว',
        });
    } catch (err) {
        next(err);
    }
};

exports.show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("received incorrect information ❗");
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }
        const lamp = await Lamp.findById(id).populate("brand");

        if (!lamp) {
            const error = new Error("lamp not founded ❗");
            error.statusCode = 400;
            throw error;
        }

        let setLamp = [];
        setLamp = [
            {
                id: lamp.id,
                name: lamp.name,
                brand: {
                    id: lamp.brand.id,
                    name: lamp.brand.name,
                },
                detail: lamp.detail,
            },
        ];

        res.status(200).json({
            data: setLamp,
        });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, detail, id } = req.body;
       
        console.log(mongoose.Types.ObjectId.isValid(shopid))
        const lamp = await Lamp.updateOne
            (
                { _id : id },
                {
                    name: name,
                    detail: detail
                });

        if (!lamp === 0) {
            const error = new Error("Lamp not founded ❗");
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({
            message: "Updated Successfully ✔",
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
        // console.log(mongoose.Types.ObjectId.isValid(id))
        const lamp = await Lamp.deleteOne({
            _id: id
        }) 

        if (!lamp.deleteCount === 0) {
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
