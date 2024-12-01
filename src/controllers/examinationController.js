const examinationService = require("../services/examination")
const db = require("../models/index");

const handlePostExamination = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Dữ liệu gửi lên không hợp lệ!",
            });
        }

        console.log("Dữ liệu nhận được:", req.body);
        const patientId = req.params.id
        // Gọi service xử lý
        let response = await examinationService.PostExamination(req.body, patientId);

        return res.status(200).json(response);
    } catch (error) {
        console.error("Lỗi khi xử lý yêu cầu:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
        });
    }
};

const getPatientNamesByPatientId = async (req, res) => {
    const patientId = req.params.id;
    console.log("patientId: ", patientId);

    if (!patientId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: "Không tìm thấy tham số yêu cầu!", // Missing required parameter
        });
    }

    try {
        const patients = await db.Booking.findOne({
            where: { patientId: patientId }, // Filter by patientId
            raw: true, // Return simple objects (not Sequelize instances)
        });

        if (patients.length === 0) {
            return res.status(404).json({
                errCode: 2,
                errMessage: "Không tìm thấy bệnh nhân với ID này.", // No patients found
            });
        }

        const examinations = await db.Examination.findAll({
            where: { patient_id: patientId }, // Filter by patientId
            raw: true, // Return simple objects (not Sequelize instances)
        });

        const detail = examinations[examinations.length - 1].detailed_examination

        console.log("examinations: ", examinations)

        if (examinations.length === 0) {
            return res.status(404).json({
                errCode: 2,
                errMessage: "Không tìm thấy danh sách khám bệnh của bệnh nhân này.", // No examinations found
            });
        }

        patients.detailed_examination = detail

        // Gắn examinations vào từng patient
        // const patientsWithExaminations = patients.map((patient) => {
        //     return {
        //         ...patient,
        //         examinations: examinations.filter(
        //             (exam) => exam.patient_id === patientId
        //         ),
        //     };
        // });


        // console.log("patientsWithExaminations: ", patientsWithExaminations);

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
    handlePostExamination,
    getPatientNamesByPatientId
};