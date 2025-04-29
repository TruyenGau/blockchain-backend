const express = require('express');
const { createUserAPI, handleLogin, getUser, getAccount, handleUpdateAccount, getCountUser, createProductAPI, handleGetProduct, getCountProduct, handleDeleteProduct, getProductDetail, getAProduct } = require("../controllers/userController");
const delay = require('../middleware/delay');
const auth = require('../middleware/auth');
const multer = require('multer');
const Product = require('../models/product');
const routerAPI = express.Router();
const path = require('path');
const fs = require('fs');

routerAPI.all("*", auth)

routerAPI.post("/register", createUserAPI);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", getAccount);
routerAPI.put("/updateAccount", handleUpdateAccount);

//admin
routerAPI.get("/countUser", getCountUser);
routerAPI.get("/countProduct", getCountProduct);

/////////////////////////////////////////
// Kiểm tra xem thư mục 'product' đã tồn tại chưa, nếu chưa thì tạo thư mục
routerAPI.get("/getProduct", handleGetProduct)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'productLaptop')); // Lưu vào thư mục 'product'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
    },
});

const upload = multer({ storage: storage });

routerAPI.post("/createProduct", upload.single('image'), createProductAPI);
routerAPI.delete("/deleteProduct", handleDeleteProduct)
routerAPI.get("/getProductDetail/:id", getProductDetail)
routerAPI.get("/getAProduct", getAProduct)




module.exports = routerAPI; //export default