const User = require("../models/user");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Config = require('../config/index')

exports.index = (req, res, next) => {
  // res.send('Hello kitty');
  res.status(200).json({
    fullname: 'Nitiwat Phomemarasee'
  })
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    //validation
    console.log(req.body)
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง")
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
    }

    const existEmail = await User.findOne({ email: email })
    if (existEmail) {
      const error = new Error("อีเมลนี้มีผู้ใช้งานในระบบแล้ว")
      error.statusCode = 400
      throw error;
    }

    let user = new User();
    user.name = name
    user.email = email
    user.password = await user.encryptPassword(password)

    await user.save()

    res.status(201).json({
      message: "ลงทะเบียนเรียบร้อยแล้ว"
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง")
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
    }

    // check email isExist
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error("ไม่พบผู้ใช้งาน")
      error.statusCode = 404
      throw error;
    }

    const isValid = await user.checkPassword(password)
    if (!isValid) {
      const error = new Error("รหัสผ่านไม่ถูกต้อง")
      error.statusCode = 401
      throw error;
    }

    //creat token
    const token = await jwt.sign({
      id: user._id,
      role: user.role,
    }, Config.TOKEN
      , { expiresIn: "5 days" })

    const expires_in = jwt.decode(token)

    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: 'Bearer'
    })
  } catch (error) {
    next(error)
  }
}

exports.profile = (req, res, next) => {
  // res.send('Hello with a resource');
  const { role, name, email } = req.user
  res.status(200).json({
    role: role,
    name: name,
    email: email
  });
};

exports.delete = async (req, res, next) => {
  /* http://localhost:3000/staff/63942d89bf53fc309c987962 */
  /* router.get('/id', staffcontroller.show) */
  try {
      const { id } = req.params
      const user = await User.deleteOne({
          _id: id
      })
      if (!user.deleteCount === 0) {
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