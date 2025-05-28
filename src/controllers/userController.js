const Product = require("../models/product");
const User = require('../models/user');
const { createUserService, loginService, getUserService, updateAccountService, getCountAccountService, getProductService, getCountProductService, deleteProductService, getProductDetailService, getProductServiceContract, deleteUserService } = require("../services/userService");
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
const getCountProduct = async (req, res) => {
    const data = await getCountProductService();
    console.log("check data", data);
    return res.status(200).json({ data });
}

const createProductAPI = async (req, res) => {
    try {
        const { name, price, shortDesc, address, stock, category, numberproduct } = req.body;
        const image = req.file ? path.basename(req.file.path) : null; // Chỉ lấy tên file
        // Lưu thông tin sản phẩm vào cơ sở dữ liệu
        const newProduct = new Product({
            name,
            price,
            shortDesc,
            address,
            stock,
            category,
            image, // Lưu đường dẫn đến ảnh,
            numberproduct
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully!', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
}

const handleGetProduct = async (req, res) => {
    const data = await getProductService();
    return res.status(200).json(data);
}

const handleGetProductContract = async (req, res) => {
    const data = await getProductServiceContract();
    return res.status(200).json(data);
}
const handleDeleteProduct = async (req, res) => {
    const { id } = req.body;

    const data = await deleteProductService(id);
    return res.status(200).json(data);
}

const getProductDetail = async (req, res) => {
    const { id } = req.params;
    // console.log("check id", id);
    const data = await getProductDetailService(id);
    return res.status(200).json(data);
}
const getAProduct = async (req, res) => {
    const { id } = req.params; // Sử dụng query parameter thay vì body
    const data = await getProductDetailService(id);
    return res.status(200).json(data);
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();  // Lấy tất cả người dùng từ MongoDB
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách người dùng' });
    }

}

const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ EC: 1, EM: 'Không tìm thấy người dùng' });
        }
        return res.status(200).json({ EC: 0, EM: 'Thành công', data: user });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết người dùng:', error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server' });
    }
}

const handleDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                EC: 1,
                EM: "Thiếu ID người dùng cần xóa",
                data: null
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                EC: 1,
                EM: "Người dùng không tồn tại",
                data: null
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            EC: 0,
            EM: "Xóa người dùng thành công",
            data: user
        });
    } catch (error) {
        console.error("Lỗi xóa người dùng:", error);
        return res.status(500).json({
            EC: 1,
            EM: "Đã xảy ra lỗi khi xóa người dùng",
            data: null
        });
    }
};


const handleUpdateUser = async (req, res) => {
    try {
        const { id, name, email, address } = req.body;

        if (!id) {
            return res.status(400).json({ EC: 1, EM: "Thiếu ID người dùng", data: null });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ EC: 1, EM: "Người dùng không tồn tại", data: null });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.address = address || user.address;

        await user.save();

        return res.status(200).json({
            EC: 0,
            EM: "Cập nhật người dùng thành công",
            data: user
        });

    } catch (error) {
        console.error("Lỗi cập nhật người dùng:", error);
        return res.status(500).json({ EC: -1, EM: "Lỗi server", data: null });
    }
};


<<<<<<< HEAD
=======

const getProductStatistics = async (req, res) => {
    try {
        const products = await Product.find();

        const totalProducts = products.length;
        const totalInStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

        const categoryCount = {};
        const categoryStock = {};
        for (const p of products) {
            const category = p.category || "Chưa phân loại"; // xử lý null
            const stock = p.stock || 0;

            categoryCount[category] = (categoryCount[category] || 0) + 1;
            categoryStock[category] = (categoryStock[category] || 0) + stock;
        }

        res.json({
            totalProducts,
            totalInStock,
            categoryCount,
            categoryStock
        });
    } catch (err) {
        console.error("🔥 Lỗi backend:", err);
        res.status(500).json({ error: "Lỗi khi thống kê sản phẩm" });
    }
};




;



>>>>>>> 1235ef90727f9593bf9c9c8dbfcd719e6b89cb87
module.exports = {
    createUserAPI,
    handleLogin,
    getUser,
    getAccount,
    handleUpdateAccount,
    getCountUser,
    createProductAPI,
    handleGetProduct,
    getCountProduct,
    handleDeleteProduct,
    getProductDetail,
    getAProduct,
    handleGetProductContract,
    getAllUsers,
    getUserDetail,
    handleDeleteUser,
    handleUpdateUser,
    getProductStatistics
}