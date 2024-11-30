const invoicesService = require("../services/invoiceService");

let handleCreateInvoice = async (req, res) => {
  try {
    const invoiceData = req.body; // Nhận dữ liệu từ body của request
    console.log("Nhận dữ liệu hóa đơn:", invoiceData);
    const parentId = req.params.id

    console.log("parentId: ", parentId)
    console.log("req.body: ", req.body)

    // Kiểm tra các tham số bắt buộc
    if (!parentId || !invoiceData.keyTable || !invoiceData.medicine_quantity) {
      return res.status(400).json({
        errCode: -1,
        errMessage: "Thiếu thông tin yêu cầu: parentId, keyTable hoặc medicine_quantity.",
      });
    }

    // Gọi service để tạo hóa đơn
    const result = await invoicesService.createInvoice(invoiceData, parentId);

    // Trả về kết quả
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi trong handleCreateInvoice:", error); // Log lỗi chi tiết

    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi từ server...",
      details: error.message, // Bao gồm chi tiết lỗi trong phản hồi
    });
  }
};

module.exports = {
  handleCreateInvoice,
};
