const express = require('express');
const { createUserAPI, handleLogin, getUser, getAccount, handleUpdateAccount, getCountUser, createProductAPI, handleGetProduct, getCountProduct, handleDeleteProduct, getProductDetail, getAProduct, handleGetProductContract, getAllUsers, getUserDetail, handleDeleteUser, handleUpdateUser } = require("../controllers/userController");
const delay = require('../middleware/delay');
const auth = require('../middleware/auth');
const multer = require('multer');
const Product = require('../models/product');
const routerAPI = express.Router();
const path = require('path');
const fs = require('fs');

routerAPI.get("/getUser", getAllUsers);
routerAPI.get("/getUserDetail/:id", getUserDetail);

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
routerAPI.get("/getProductContract", handleGetProductContract)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'productLaptop')); // Lưu vào thư mục 'product'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
    },
});

const upload = multer({ storage: storage });

routerAPI.delete("/users/:id", handleDeleteUser);
routerAPI.put('/updateUser', handleUpdateUser);
routerAPI.post("/createProduct", upload.single('image'), createProductAPI);
routerAPI.put("/deleteProduct", handleDeleteProduct)
routerAPI.get("/getProductDetail/:id", getProductDetail)
routerAPI.get("/getAProduct/:id", getAProduct)
routerAPI.post('/updateProduct/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price, shortDesc, stock, category, address } = req.body;

    try {
        // Tìm sản phẩm theo id
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Nếu có ảnh mới, cập nhật ảnh mới, nếu không thì giữ ảnh cũ
        let updatedImage = product.image;  // Giữ lại ảnh cũ mặc định
        if (req.file) {
            updatedImage = req.file.filename;  // Nếu có ảnh mới, lưu ảnh mới
        }

        // Cập nhật thông tin sản phẩm (giữ nguyên thông tin ảnh cũ nếu không có ảnh mới)
        product.name = name || product.name;
        product.price = price || product.price;
        product.shortDesc = shortDesc || product.shortDesc;
        product.stock = stock || product.stock;
        product.category = category || product.category;
        product.address = address || product.address;
        product.image = updatedImage;  // Cập nhật ảnh mới hoặc giữ ảnh cũ

        // Lưu lại thông tin sản phẩm
        await product.save();

        // Trả về thông tin sản phẩm đã cập nhật
        return res.status(200).json({ message: 'Product updated successfully', product });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});





module.exports = routerAPI; //export default