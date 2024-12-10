"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // Liên kết với Medicine
      Invoice.belongsTo(models.Medicine, {
        foreignKey: "parentId",
        as: "medicineDetails",
      });

      // Liên kết với Service
      Invoice.belongsTo(models.Service, {
        foreignKey: "parentId",
        as: "serviceDetails",
      });
    }
  }

  Invoice.init(
    {
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER, // Cột này liên kết với bảng Service hoặc Medicine
        allowNull: false,
      },
      doctorId: {
        type: DataTypes.INTEGER, // Cột này liên kết với bảng Service hoặc Medicine
        allowNull: false,
      },
      keyTable: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      medicine_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Invoice",
      timestamps: false,
    }
  );

  return Invoice;
};
