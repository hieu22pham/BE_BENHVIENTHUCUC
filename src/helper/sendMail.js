const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
  try {
    // Tạo transporter với thông tin đăng nhập email và mật khẩu ứng dụng
    // const transporter = nodemailer.createTransport({
    //   // service: 'gmail',
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for port 465, false for other ports
    //   auth: {
    //     user: "",
    //   },
    //   tls: {
    //     rejectUnauthorized: false, // Tắt kiểm tra SSL nếu cần
    //   },
    // });

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Hoặc host: 'smtp.gmail.com'
      auth: {
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Cấu hình email
    const mailOptions = {
      from: 'Bệnh viện Thu Cúc', // sender address, // Người gửi
      to: email, // Người nhận
      subject: subject, // Chủ đề
      html: html, // Nội dung email
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    if (info) {
      console.log("Email sent successfully:", info.response); // Log kết quả gửi thành công
    }

    return true; // Trả về trạng thái thành công
  } catch (error) {
    console.error("Error while sending email:", error); // Log lỗi nếu có
    return false; // Trả về trạng thái thất bại
  }
};
