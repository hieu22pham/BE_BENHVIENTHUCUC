require("dotenv").config();
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { sequelize } = require("../models/index");
const { QueryTypes } = require("sequelize");

const moment = require("moment");
const _ = require("lodash");
const db = require("../models/index");
const emailService = require("../services/emailService");

const getAllBookings = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Booking.findAll({
                include: [
                    {
                        model: db.TimeType,
                        as: "timeTypeDataPatient",
                        attributes: ["valueEn", "valueVi"], // Fetch time slot info
                    },
                    {
                        model: db.User,
                        as: "patientData",
                        attributes: ["firstName", "lastName", "email", "phoneNumber"], // Patient info
                    },
                    {
                        model: db.Status,
                        as: "statusData",
                        attributes: ["valueEn", "valueVi"], // Booking status info
                    },
                ],
                raw: false,
                nest: true,
            });

            if (!data || data.length === 0) {
                data = [];
            }

            resolve({
                errCode: 0,
                data,
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

const deleteBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem Booking có tồn tại không
            const booking = await db.Booking.findOne({
                where: { id: id },
            });

            if (!booking) {
                return resolve({
                    errCode: 1,
                    errMessage: "Booking not found!",
                });
            }

            // Thực hiện xóa Booking
            await db.Booking.destroy({
                where: { id: id },
            });

            resolve({
                errCode: 0,
                message: "Booking deleted successfully!",
            });
        } catch (error) {
            console.error(error);
            reject({
                errCode: -1,
                errMessage: "An error occurred while deleting the booking.",
            });
        }
    });
};

const getBookingById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Booking.findOne({
                where: {
                    id: id, // Tìm kiếm theo ID
                },
                include: [
                    {
                        model: db.TimeType,
                        as: "timeTypeDataPatient", // Alias cho thông tin thời gian
                        attributes: ["valueEn", "valueVi"], // Thông tin về thời gian (valueEn, valueVi)
                    },
                    {
                        model: db.User,
                        as: "patientData", // Alias cho thông tin bệnh nhân
                        attributes: ["firstName", "lastName", "email", "phoneNumber"], // Thông tin bệnh nhân
                    },
                    {
                        model: db.Status,
                        as: "statusData", // Alias cho trạng thái booking
                        attributes: ["valueEn", "valueVi"], // Trạng thái booking (valueEn, valueVi)
                    },
                ],
                raw: false,
                nest: true,
            });

            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: "Booking not found!",
                });
            } else {
                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            console.error("Error in getBookingById:", error);
            reject({
                errCode: -1,
                errMessage: "An error occurred while fetching the booking.",
            });
        }
    });
};



module.exports = {
    getAllBookings,
    deleteBooking,
    getBookingById
};
