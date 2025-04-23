const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true }, // Để giá dưới dạng String nếu muốn chứa số lớn hoặc chuỗi
    shortDesc: { type: String, required: true },
    stock: { type: Number, required: true }, // stock có thể là một số
    address: { type: String, required: true }, // Địa chỉ seller lưu dưới dạng chuỗi
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
