// Import các module cần thiết
const db = require("../models/index"); // Sequelize models
const { Op } = require("sequelize");

const handleGetService = async (req, res) => {
    try {
        console.log(req.params)
        const serviceId = req.params.id; // Lấy ID từ query parameter

        if (!serviceId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Service ID is required!",
            });
        }

        // Giả sử bạn sử dụng ORM (ví dụ: Sequelize, Mongoose) để truy cập DB
        const service = await db.Service.findOne({
            where: { id: serviceId }, // Tìm dịch vụ theo ID
        });

        if (!service) {
            return res.status(404).json({
                errCode: 2,
                errMessage: "Service not found!",
            });
        }

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            data: service,
        });
    } catch (error) {
        console.error("Error in handleGetService:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Server error!",
        });
    }
};

const handleGetAllServices = async (req, res) => {
    try {
        // Lấy tất cả các dịch vụ từ bảng
        const data = await db.Service.findAll({
            attributes: [
                "id",
                "service_name",
                "unit_price",
                "quantity",
                "price",
                "notes",
                "department",
                "examination_id",
                "created_at",
                "updated_at",
            ],
            raw: true, // Trả về data dưới dạng JSON thô
        });

        return res.status(200).json({
            errCode: 0,
            message: "Successfully fetched all services",
            data,
        });
    } catch (error) {
        console.error("Error in handleGetAllServices:", error);
        return res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error!",
        });
    }
};

const handleAddService = async (req, res) => {
    try {
        const { patientId, service_name, unit_price, quantity, notes, department, examination_id } = req.body;
        console.log("req.body: ", req.body)

        // const {patientId} = req.params
        console.log("patientId: ", patientId)

        // Tạo mới một dịch vụ
        await db.Service.create({
            service_name,
            unit_price,
            patientId,
            quantity,
            notes,
            department,
            examination_id,
        });

        return res.status(201).json({
            errCode: 0,
            message: "Service added successfully!",
        });
    } catch (error) {
        console.error("Error in handleAddService:", error);
        return res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error!",
        });
    }
};

const handleUpdateService = async (req, res) => {
    try {
        const serviceId = req.params.id; // Lấy ID từ params
        const { service_name, unit_price, notes, department } = req.body; // Lấy dữ liệu từ body

        // Kiểm tra nếu thiếu ID hoặc dữ liệu cần thiết
        if (!serviceId || !service_name || unit_price === undefined || !department) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required fields!",
            });
        }

        // Tìm service trong cơ sở dữ liệu
        const service = await db.Service.findOne({
            where: { id: serviceId },
            raw: false, // Đảm bảo nhận được đối tượng Sequelize để có thể sửa đổi
        });

        if (!service) {
            return res.status(404).json({
                errCode: 1,
                errMessage: "Service not found!",
            });
        }

        // Debug thông tin đối tượng
        console.log("Service found:", service);

        // Cập nhật thông tin
        service.service_name = service_name;
        service.unit_price = unit_price;
        service.department = department;
        service.notes = notes;

        // Lưu các thay đổi
        await service.save();

        return res.status(200).json({
            errCode: 0,
            errMessage: "Service updated successfully!",
        });
    } catch (error) {
        console.error("Error in handleUpdateService:", error);

        return res.status(500).json({
            errCode: -1,
            errMessage: "Internal server error!",
        });
    }
};

const handleDeleteService = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)

        // Xóa dịch vụ theo ID
        const rowsDeleted = await db.Service.destroy({ where: { id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({
                errCode: 1,
                message: "Service not found!",
            });
        }

        return res.status(200).json({
            errCode: 0,
            message: "Service deleted successfully!",
        });
    } catch (error) {
        console.error("Error in handleDeleteService:", error);
        return res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error!",
        });
    }
};

// Export các hàm controller
module.exports = {
    handleGetAllServices,
    handleAddService,
    handleUpdateService,
    handleDeleteService,
    handleGetService
};
