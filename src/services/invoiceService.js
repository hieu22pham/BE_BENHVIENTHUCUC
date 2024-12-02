const db = require("../models/index"); // Import mô hình database

const createInvoice = async (invoiceData, parentId) => {
  try {
    // Kiểm tra các trường bắt buộc trong dữ liệu gửi lên
    if (!parentId || !invoiceData.keyTable || !invoiceData.medicine_quantity) {
      return {
        errCode: 1,
        errMessage: "Thiếu thông tin yêu cầu: parentId, keyTable hoặc medicine_quantity!",
      };
    }

    // Tiến hành lưu hóa đơn vào bảng Invoice
    const newInvoice = await db.Invoice.create({
      patientId: parentId,  // Dữ liệu parentId
      parentId: invoiceData.parentId,
      keyTable: invoiceData.keyTable,  // Dữ liệu keyTable (medicine hoặc service)
      medicine_quantity: invoiceData.medicine_quantity, // Dữ liệu số lượng thuốc
    });

    console.log("newInvoice: ", newInvoice)

    return {
      errCode: 0,
      errMessage: "Hóa đơn đã được tạo thành công",
      invoice: newInvoice,
    };
  } catch (error) {
    console.error("Lỗi khi tạo hóa đơn:", error);
    return {
      errCode: -1,
      errMessage: "Có lỗi xảy ra khi tạo hóa đơn",
      details: error.message,
    };
  }
};

module.exports = {
  createInvoice,
};
