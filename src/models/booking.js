"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            // Liên kết với User qua doctorId
            Booking.belongsTo(models.User, {
                foreignKey: "doctorId",
                as: "doctorData", // Alias cho doctor
            });

            // Liên kết với User qua patientId
            Booking.belongsTo(models.User, {
                foreignKey: "patientId",
                as: "patientData", // Alias cho patient
            });

            // Liên kết với TimeType
            Booking.belongsTo(models.TimeType, {
                foreignKey: "timeType",
                targetKey: "id",
                as: "timeTypeDataPatient", // Alias cho TimeType
            });

            // Liên kết với Status
            Booking.belongsTo(models.Status, {
                foreignKey: "statusId",
                targetKey: "id",
                as: "statusData", // Alias cho Status
            });

            // Liên kết với History
            Booking.hasOne(models.History, {
                foreignKey: "bookingId",
                as: "bookingData", // Alias cho History
            });
        }
    }

    Booking.init(
        {
            statusId: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            date: DataTypes.STRING,
            timeType: DataTypes.STRING,
            token: DataTypes.STRING,
            reason: DataTypes.STRING,
            status: {
                type: DataTypes.STRING,
                defaultValue: "pending",
            },
            payment: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: "Booking",
        }
    );

    return Booking;
};
