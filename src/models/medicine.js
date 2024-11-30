// models/medicineModel.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    static associate(models) {
      // Mỗi Medicine có thể có nhiều Invoice
      Medicine.hasMany(models.Invoice, {
        foreignKey: "parentId", // Liên kết với cột 'medicineId' trong bảng Invoice
        as: "invoices",  // Alias cho mối quan hệ
      });
    }
  }

  Medicine.init(
    {
      name: DataTypes.STRING,             // Tên thuốc
      unit: DataTypes.STRING,             // Đơn vị
      price: DataTypes.FLOAT,             // Giá thuốc
      usg: DataTypes.STRING,            // Cách sử dụng
      activeIngredient: DataTypes.STRING, // Hoạt chất
      dosage: DataTypes.STRING,           // Hàm lượng
      route: DataTypes.STRING,            // Đường dùng
      packaging: DataTypes.STRING,        // Quy cách đóng gói
      manufacturer: DataTypes.STRING,     // Đơn vị sản xuất
      declarationUnit: DataTypes.STRING,  // Đơn vị kê khai
    },
    {
      sequelize,
      modelName: "Medicine",
    }
  );

  return Medicine;
};
