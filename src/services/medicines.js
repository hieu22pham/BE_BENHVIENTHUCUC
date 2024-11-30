require("dotenv").config();
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { sequelize } = require("../models/index");
const db = require("../models/index");

let getAllMedicines = () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Fetching all medicines..."); // Log kiểm tra

            let data = await db.Medicine.findAll({
                attributes: { exclude: [] },
                raw: true,
                nest: true,
            });

            console.log("Fetched medicines:", data); // Log kiểm tra dữ liệu trả về

            resolve({
                errCode: 0,
                data: data,
            });
        } catch (error) {
            console.error("Error fetching medicines:", error); // Log lỗi
            reject(error);
        }
    });
};

const deleteMedicines =  (medicineId) => {
    return new Promise(async (resolve, reject) => {
        try {

            // Tìm thuốc cần xóa
            let medicineToDelete = await db.Medicine.findOne({
                where: {
                    id: medicineId,
                },
            });

            if (!medicineToDelete) {
                return resolve({
                    errCode: 2,
                    errMessage: "Thuốc cần xóa không tồn tại!",
                });
            }

            // Xóa thuốc
            await db.Medicine.destroy({ where: { id: medicineId } });

            // Trả về kết quả thành công
            resolve({
                errCode: 0,
                message: "Xóa thuốc thành công!",
            });
        } catch (error) {
            // Xử lý lỗi
            reject({
                errCode: -1,
                errMessage: "Lỗi từ phía server!",
                details: error.message,
            });
        }
    });
};

let createMedicines = (medicineData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Creating new medicine..."); // Log kiểm tra

            // Tạo mới trong database (sử dụng Sequelize)
            let newMedicine = await db.Medicine.create(medicineData);

            console.log("New medicine created:", newMedicine); // Log kiểm tra dữ liệu mới

            resolve({
                errCode: 0,
                message: "Tạo thuốc mới thành công!",
                medicine: newMedicine,
            });
        } catch (error) {
            console.error("Error creating medicine:", error); // Log lỗi
            reject({
                errCode: -1,
                errMessage: "Lỗi khi tạo thuốc mới.",
                details: error.message,
            });
        }
    });
};

let getMedicinesByPatientId = (patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`Fetching medicines for patientId: ${patientId}`);  // Log incoming patientId

            // Query to fetch all invoices related to a patient, including the medicines
            let invoices = await db.Invoice.findAll({
                where: {
                    patientId: patientId,  // Filter by patientId
                },
                include: [
                    {
                        model: db.Medicine,  // Include the Medicine model
                        as: "medicineDetails",  // Alias for the relation
                        required: true,  // Only include invoices that have related medicines
                    },
                ],
                raw: true,  // Return raw data as plain objects
                nest: true,  // Properly nest the included models
            });

            console.log(`Fetched invoices with medicines: ${JSON.stringify(invoices)}`);  // Log fetched data

            console.log("invoices: ", invoices)
            // If no medicines found, return an error message
            if (!invoices || invoices.length === 0) {
                return resolve({
                    errCode: 1,
                    errMessage: "No medicines found for this patient.",
                });
            }

            // Process the results to return all fields from the Medicine model
            let medicines = invoices.map(invoice => ({
                medicineId: invoice["medicineDetails.id"],  // Medicine ID
                medicineName: invoice["medicineDetails.name"],  // Medicine Name
                medicineType: invoice["medicineDetails.type"],  // Medicine Type (if applicable)
                medicinePrice: invoice["medicineDetails.price"],  // Price of the medicine
                medicineDescription: invoice["medicineDetails.description"],  // Description (if applicable)
                quantity: invoice.medicine_quantity,  // Quantity of the medicine in the invoice
                createdAt: invoice["medicineDetails.createdAt"],  // Date created (if applicable)
                updatedAt: invoice["medicineDetails.updatedAt"],  // Date updated (if applicable)
                // Add any other fields you need from the Medicine model here
            }));

            // Return the result directly with all the necessary medicine fields
            resolve({
                errCode: 0,
                errMessage: "Success",
                data: invoices,  // This will contain the array of all medicines with full details
            });

        } catch (error) {
            console.error("Error in getMedicinesByPatientId:", error);  // Log any error

            reject({
                errCode: -1,
                errMessage: "Error fetching medicines",
                details: error.message,
            });
        }
    });
};

const getServicesByPatientId = (patientId) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Fetching services for patientId: ${patientId}`); // Log nhận đầu vào
  
        const invoices = await db.Invoice.findAll({
          where: { patientId: patientId },
          include: [
            {
              model: db.Service,
              as: "serviceDetails",
              required: true,
            },
          ],
          raw: true,
          nest: true,
        });
  
        console.log(`Fetched invoices: ${JSON.stringify(invoices)}`); // Log kết quả từ cơ sở dữ liệu
  
        if (!invoices || invoices.length === 0) {
          return resolve({
            errCode: 1,
            errMessage: "No services found for this patient.",
          });
        }
  
        const services = invoices.map((invoice) => ({
          serviceId: invoice["serviceDetails.id"],
          serviceName: invoice["serviceDetails.service_name"],
          unitPrice: invoice["serviceDetails.unit_price"],
          quantity: invoice["serviceDetails.quantity"],
          totalPrice: invoice["serviceDetails.price"],
          notes: invoice["serviceDetails.notes"],
          department: invoice["serviceDetails.department"],
          createdAt: invoice["serviceDetails.createdAt"],
          updatedAt: invoice["serviceDetails.updatedAt"],
        }));
  
        console.log(`Processed services: ${JSON.stringify(invoices)}`); // Log kết quả cuối
  
        resolve({
          errCode: 0,
          errMessage: "Success",
          data: invoices,
        });
      } catch (error) {
        console.error("Error in getServicesByPatientId:", error); // Log lỗi chi tiết
  
        reject({
          errCode: -1,
          errMessage: "Error fetching services",
          details: error.message,
        });
      }
    });
  };
  

module.exports = {
    getAllMedicines, 
    deleteMedicines,
    createMedicines,
    getMedicinesByPatientId,
    getServicesByPatientId
};
