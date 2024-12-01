require("dotenv").config();
// import moment from "moment";
const Sequelize = require("sequelize");
const { Op } = Sequelize;
// import { sequelize } from "../models/index";
const { sequelize } = require("../models/index");
const { QueryTypes } = require("sequelize");
// import _ from "lodash";
// import db from "../models/index";
// import emailService from "../services/emailService";

const moment = require("moment");
const _ = require("lodash");
const db = require("../models/index");
const emailService = require("../services/emailService");

const PostExamination = async (data, patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!patientId || !data.weight || !data.height || !data.detailed_examination) {
                return resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin bắt buộc.",
                });
            }

            // Lưu thông tin vào cơ sở dữ liệu
            const result = await db.Examination.create({
                patient_id: data.patientId,
                weight: data.weight,
                height: data.height,
                bmi: data.bmi,
                temperature: data.temperature,
                heart_rate: data.heart_rate,
                blood_pressure: data.blood_pressure,
                detailed_examination: data.detailed_examination,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            resolve({
                errCode: 0,
                message: "Lưu thông tin khám bệnh thành công!",
                data: result,
            });
        } catch (error) {
            console.error('Lỗi trong PostExamination:', error);
            reject({
                errCode: -1,
                errMessage: "Lỗi khi lưu thông tin khám bệnh.",
            });
        }
    });
};

const getPatientNamesByPatientId = async (req, res) => {
    const patientId = req.params.id;

    if (!patientId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Không tìm thấy tham số yêu cầu!", // Missing required parameter
        });
    }

    try {
        // Truy vấn bảng Examination để lấy chi tiết khám cho bệnh nhân
        const patients = await db.Examination.findAll({
            where: { patientId: patientId }, // Filter by patientId
            raw: true, // Return simple objects (not Sequelize instances)
        });

        // If no patients are found, return an appropriate message
        if (patients.length === 0) {
            return res.status(404).json({
                errCode: 2,
                errMessage: "Không tìm thấy bệnh nhân với ID này.", // No patients found
            });
        }

        return res.status(200).json({
            errCode: 0,
            data: patients,
        });

    } catch (error) {
        console.error("Error in getPatientNamesByPatientId:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Có lỗi xảy ra khi truy vấn dữ liệu!", // Error fetching data
            error: error.message,
        });
    }
};



module.exports = {
    PostExamination,
    getPatientNamesByPatientId
}