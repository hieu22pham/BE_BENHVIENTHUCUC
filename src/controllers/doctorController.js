// import doctorService from "../services/doctorService";
const doctorService = require("../services/doctorService");
let handleGetTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    console.log(limit);
    if (!limit) {
        limit = 10;
    }
    try {
        let response = await doctorService.getTopDoctorHome(limit);
        // console.log(response);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

let handleGetTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }

    try {
        let response = await doctorService.getTopDoctor(limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

    let handleGetAllDoctor = async (req, res) => {
        try {
            let doctors = await doctorService.getAllDoctor();
            // console.log(doctors);
            res.status(200).json(doctors);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: "Lỗi từ server...",
            });
        }
    };

const handlePostInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetDetailDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleBulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(response);  
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetScheduleDoctorByDate = async (req, res) => {
    // console.log(req.query);
    try {
        let response = await doctorService.getScheduleDoctorByDate(
            req.query.doctorId,
            req.query.date
        );

        console.log(response)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};




const handleDeleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        console.log(req.params.id)
        let response = await doctorService.deleteSchedule(scheduleId);
        return res.status(200).json(response);
        // return res.status(200)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetExtraInforDoctorById = async (req, res) => {
    // console.log(req.query.doctorId);
    try {
        let infor = await doctorService.getExtraInforDoctorById(
            req.query.doctorId
        );
        return res.status(200).json(infor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetProfileDoctorById = async (req, res) => {
    try {
        let profile = await doctorService.getProfileDoctorById(
            req.query.doctorId
        );
        return res.status(200).json(profile);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetListPatientForDoctor = async (req, res) => {
    console.log(req.query);
    try {
        console.log("req.query: ", req.query)
        let result = await doctorService.getListPatientForDoctor(
            req.query.doctorId,
            req.query.date,
            req.query.timeType
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetListPatientForDoctorAdmin = async (req, res) => {
    console.log(req.query);
    try {
        let result = await doctorService.getListPatientForDoctor(
            req.query.doctorId,
            req.query.date,
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleGetListPatientForDoctorAdminS5 = async (req, res) => {
    console.log(req.query);
    try {
        let result = await doctorService.getListPatientForDoctorS5(
            req.query.doctorId,
            req.query.date,
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handleSendRemedy = async (req, res) => {
    try {
        let result = await doctorService.sendRemedy(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

let handleSearchDoctorByName = async (req, res) => {
    try {
        let result = await doctorService.searchDoctorByName(req.query.search);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

let handleGetDoctorByClinic = async (req, res) => {
    try {
        let result = await doctorService.getDoctorByClinic(req.query.clinicId);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const handlePostScheduleDoctorByDate = async (req, res) => {
    console.log("Received body:", req.body);

    const { doctorId, date, timeType, maxNumber, currentNumber } = req.body;

    // Kiểm tra các tham số yêu cầu
    if (!doctorId || !date || !timeType || !maxNumber || currentNumber === undefined) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Không tìm tham số yêu cầu!",
        });
    }

    try {
        // Tạo dữ liệu lịch khám
        const scheduleData = {
            doctorId,
            date,
            timeType,
            maxNumber,
            currentNumber,
        };

        // Gọi service để xử lý
        const response = await doctorService.createSchedules(scheduleData);

        if (response.errCode === 0) {
            return res.status(200).json({
                errCode: 0,
                errMessage: "Lịch khám được tạo thành công!",
            });
        } else {
            return res.status(500).json({
                errCode: response.errCode,
                errMessage: response.errMessage || "Lỗi trong quá trình tạo lịch khám!",
            });
        }
    } catch (error) {
        console.error("Error in handlePostScheduleDoctorByDate:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server!",
        });
    }
};


module.exports = {
    handleGetTopDoctorHome,
    handleGetAllDoctor,
    handlePostInforDoctor,
    handleGetDetailDoctorById,
    handleBulkCreateSchedule,
    handleGetScheduleDoctorByDate,
    handlePostScheduleDoctorByDate,
    handleDeleteSchedule,
    handleGetExtraInforDoctorById,
    handleGetProfileDoctorById,
    handleGetTopDoctor,
    handleGetListPatientForDoctor,
    handleSendRemedy,
    handleSearchDoctorByName,
    handleGetDoctorByClinic,
    handleGetListPatientForDoctorAdmin,
    handleGetListPatientForDoctorAdminS5
};
