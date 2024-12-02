const medicinesService = require("../services/medicines")

let handleGetAllMedicines = async (req, res) => {
    try {
        // Gọi service để lấy danh sách thuốc
        let medicines = await medicinesService.getAllMedicines();

        console.log(medicines)

        // Trả về phản hồi thành công
        return res.status(200).json(medicines);
    } catch (error) {
        // Ghi lỗi ra console để debug
        console.error("Error in handleGetAllMedicines:", error);

        // Trả về lỗi
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
            details: error.message,
        });
    }
};

let handleDeleteMedicine = async (req, res) => {
    try {
        const  medicineId = req.params.id;

        // Kiểm tra tham số đầu vào


        // Gọi service để xóa thuốc
        let result = await medicinesService.deleteMedicines(medicineId);

        // Trả về kết quả từ service
        return res.status(200).json(result);
    } catch (error) {
        // Ghi lỗi ra console để debug
        console.error("Error in handleDeleteMedicine:", error);

        // Trả về lỗi
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
            details: error.message,
        });
    }
};

let handleCreateMedicine = async (req, res) => {
    try {
        const medicineData = req.body; // Nhận dữ liệu thuốc từ body request

        // Gọi service để tạo thuốc
        let result = await medicinesService.createMedicines(medicineData);

        // Trả về kết quả
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in handleCreateMedicines:", error);

        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server...",
            details: error.message,
        });
    }
};


const handleGetAllMedicinesByPatientId = async (req, res) => {
    const patientId = req.query.id; // Nhận patientId từ request
    const doctorId = req.query.doctorId; // Nhận patientId từ request

    console.log(`Received request for patientId: ${patientId}`);  // Log patientId

    console.log()

    try {
        // Gọi service để lấy danh sách thuốc cho bệnh nhân theo patientId
        const medicines = await medicinesService.getMedicinesByPatientId(patientId, doctorId);
        console.log(`Medicines found: ${JSON.stringify(medicines)}`);  // Log medicines result

        res.json({
            errCode: 0,
            errMessage: "Success",
            data: medicines,
        });
    } catch (error) {
        // Log the actual error message
        console.error("Error in handleGetAllMedicinesByPatientId:", error);

        res.status(500).json({
            errCode: -1,
            errMessage: "Error fetching medicines",
            details: error.message,
        });
    }
};

const handleGetAllServicesByPatientId = async (req, res) => {
    try {
        const patientId = req.query.id; // Nhận patientId từ request
        const doctorId = req.query.doctorId; // Nhận patientId từ request

      const services = await medicinesService.getServicesByPatientId(patientId, doctorId)
  
      res.json({
        errCode: 0,
        errMessage: "Success",
        data: services?.data || [],
      });
    } catch (error) {
      console.error("Error in handleGetAllServicesByPatientId:", error);
  
      res.status(500).json({
        errCode: -1,
        errMessage: "Error fetching services",
        details: error.message,
      });
    }
  };
  

module.exports = {
    handleGetAllMedicines,
    handleDeleteMedicine,
    handleCreateMedicine,
    handleGetAllMedicinesByPatientId,
    handleGetAllServicesByPatientId,
}
