"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Examination extends Model {
    static associate(models) {
      // Liên kết với bảng Service
      Examination.hasMany(models.Service, { foreignKey: "examination_id", as: "services" });
    }
  }

  Examination.init(
    {
      patient_id: DataTypes.INTEGER,           // Mã bệnh nhân
      weight: DataTypes.DECIMAL(5, 2),         // Cân nặng (kg)
      height: DataTypes.DECIMAL(5, 2),         // Chiều cao (cm)
      temperature: DataTypes.DECIMAL(4, 1),    // Nhiệt độ (°C)
      heart_rate: DataTypes.INTEGER,           // Nhịp tim (lần/phút)
      blood_pressure: DataTypes.INTEGER,       // Huyết áp (mmHg)
      bmi: DataTypes.DECIMAL(10, 6),           // Chỉ số BMI
      detailed_examination: DataTypes.TEXT,    // Mô tả chi tiết khám bệnh
    },
    {
      sequelize,
      modelName: "Examination",
      timestamps: false, // Tự động thêm createdAt và updatedAt
    }
  );

  return Examination;
};