const Product = require("../models/product");
const { createUserService, loginService, getUserService, updateAccountService, getCountAccountService } = require("../services/userService");
const path = require('path');
const createUserAPI = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const data = await createUserService(name, email, password, confirmPassword);

    return res.status(200).json(data);
}


const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    return res.status(200).json(data);
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data);
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

const handleUpdateAccount = async (req, res) => {
    const { email, address } = req.body;
    const data = await updateAccountService(email, address);
    console.log("check data", data);
    return res.status(200).json(data);
}

const getCountUser = async (req, res) => {
    const data = await getCountAccountService();
    console.log("check data", data);
    return res.status(200).json({ data });
}
const createProductAPI = async (req, res) => {
    try {
        const { name, price, shortDesc, address, stock, category } = req.body;
        const image = req.file ? path.basename(req.file.path) : null; // Chỉ lấy tên file
        // Lưu thông tin sản phẩm vào cơ sở dữ liệu
        const newProduct = new Product({
            name,
            price,
            shortDesc,
            address,
            stock,
            category,
            image, // Lưu đường dẫn đến ảnh
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully!', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
}

module.exports = {
    createUserAPI,
    handleLogin,
    getUser,
    getAccount,
    handleUpdateAccount,
    getCountUser,
    createProductAPI
}