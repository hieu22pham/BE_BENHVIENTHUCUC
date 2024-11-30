const receptionistService = require("../services/receptionisService");
const db = require("../models/index");

const handleGetAllBooking = async (req, res) => {
    try {
        // Fetch all bookings using the receptionistService without any filters
        const response = await receptionistService.getAllBookings(); // Assuming you have a getAllBookings service method

        // If there's an error, respond with it
        if (response.errCode !== 0) {
            return res.status(500).json({
                errCode: response.errCode,
                errMessage: response.errMessage,
            });
        }

        // Return the fetched booking data
        return res.status(200).json({
            errCode: 0,
            message: "Successfully fetched all bookings",
            data: response.data,
        });
    } catch (error) {
        console.error("Error in handleGetAllBooking:", error);
        return res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error!",
        });
    }
};

const deleteBookingById = async (req, res) => {
    const id = req.params.id; // Lấy id từ request params
    try {
        const result = await receptionistService.deleteBooking(id);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Internal server error",
        });
    }
};

const handleGetBookingById = async (req, res) => {
    const id = req.params.id;

    try {
        const response = await receptionistService.getBookingById(id);

        if (response.errCode !== 0) {
            console.error("Error from service:", response);
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in handleGetBookingById:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Internal server error!",
        });
    }
};

const handleEditBookingById = async (req, res) => {
    const bookingId = req.params.id;
    const { statusId } = req.body;

    if (!bookingId || !statusId) {
        return res.status(400).json({
            message: 'Thiếu ID hoặc trạng thái mới',
        });
    }

    try {
        // Tìm booking trong cơ sở dữ liệu
        const booking = await db.Booking.findOne({
            where: { id: bookingId },
            raw: false, // Đảm bảo nhận được đối tượng Sequelize
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Không tìm thấy lịch hẹn',
            });
        }

        // Debug thông tin đối tượng
        console.log("Booking found:", booking);

        // Cập nhật trạng thái của booking
        booking.statusId = statusId;
        await booking.save();

        return res.status(200).json({
            message: 'Cập nhật trạng thái thành công',
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý',
        });
    }
};

const handleEditInvoiceById = async (req, res) => {
    const bookingId = req.params.id;
    const { payment } = req.body;

    if (!bookingId || !payment) {
        return res.status(400).json({
            message: 'Thiếu ID hoặc trạng thái mới',
        });
    }

    try {
        // Tìm booking trong cơ sở dữ liệu
        const booking = await db.Booking.findOne({
            where: { id: bookingId },
            raw: false, // Đảm bảo nhận được đối tượng Sequelize
        });

        if (!booking) {
            return res.status(404).json({
                message: 'Không tìm thấy lịch hẹn',
            });
        }

        // Debug thông tin đối tượng
        console.log("Booking found:", booking);

        // Cập nhật trạng thái của booking
        booking.payment = payment;
        await booking.save();

        return res.status(200).json({
            message: 'Cập nhật trạng thái thành công',
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);

        return res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý',
        });
    }
};

const getBookingsByUserId = async (req, res) => {
    try {
        const userId  = req.params.id; // Lấy userId từ params

        if (!userId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "User ID is required",
            });
        }

        const bookings = await db.Booking.findAll({
            where: { patientId: userId }, // Lọc theo parentId (trong trường hợp này là patientId)
            attributes: ["id", "doctorId","timeType", "patientId","date", "statusId", "reason"], // Các trường cần lấy từ bảng Booking
        });

        if (!bookings.length) {
            return res.status(200).json({
                errCode: 0,
                errMessage: "No bookings found for this user",
                data: [],
            });
        }

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            data: bookings,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Internal server error",
        });
    }
};



const getDoctorInfoById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy doctorId từ params

        const doctorId = id

        if (!doctorId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Doctor ID is required",
            });
        }

        const doctor = await db.User.findOne({
            where: { id: doctorId },
            attributes: ["id", "firstName", "lastName", "address"], // Các trường cần lấy từ bảng User
        });

        if (!doctor) {
            return res.status(404).json({
                errCode: 2,
                errMessage: "Doctor not found",
            });
        }

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            data: doctor,
        });
    } catch (error) {
        console.error("Error fetching doctor info:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Internal server error",
        });
    }
};


module.exports = {
    handleGetAllBooking,
    deleteBookingById,
    handleGetBookingById,
    handleEditBookingById,
    getBookingsByUserId,
    getDoctorInfoById,
    handleEditInvoiceById
};
