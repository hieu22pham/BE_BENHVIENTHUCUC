"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // Liên kết với bảng Examination
      Service.belongsTo(models.Examination, { foreignKey: "examination_id", as: "examination" });

      // Liên kết với bảng User (thêm mới)
      Service.belongsTo(models.User, { foreignKey: "patientId", as: "patient" });

      // Liên kết với Invoice
      Service.hasMany(models.Invoice, { foreignKey: "parentId", as: "invoices" });
    }
  }

  Service.init(
    {
      service_name: DataTypes.STRING,
      unit_price: DataTypes.DECIMAL(10, 2),
      quantity: DataTypes.INTEGER,
      
      price: DataTypes.DECIMAL(10, 2),
      notes: DataTypes.TEXT,
      department: DataTypes.STRING,
      examination_id: DataTypes.INTEGER,
      // Thêm mới trường patient_id
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Đảm bảo không được null
      },
    },
    {
      sequelize,
      modelName: "Service",
      timestamps: false,
    }
  );

  return Service;
};
