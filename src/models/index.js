// models/index.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Object để chứa tất cả các model
const models = {};

// Đọc tất cả các file trong thư mục hiện tại (trừ index.js)
fs.readdirSync(__dirname).forEach((file) => {
    // Bỏ qua file index.js
    if (file === 'index.js') return;

    // Lấy tên file mà không có phần mở rộng
    const modelName = path.basename(file, path.extname(file));
    // Import model và thêm vào đối tượng models
    const model = require(path.join(__dirname, file));
    models[modelName] = model;
});

// Export tất cả các model
module.exports = models;

const User = require('./User');
const RefreshToken = require('./RefreshToken');
const Product = require('./Product');
const Service = require('./Service');

module.exports = {
    User,
    RefreshToken,
    Product,
    Service
};
