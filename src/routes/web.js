const express = require("express");

// import {
//     getHomePage,
//     getAboutPage,
//     getCRUD,
//     postCrud,
//     displayCRUD,
//     getEditCRUD,
//     putCRUD,
//     deleteCRUD,
// } from "../controllers/homeController";
// import userController from "../controllers/userController";
// import doctorController from "../controllers/doctorController";
// import patientController from "../controllers/patientController";
// import specialtyControler from "../controllers/specialtyControler";
// import clinicControler from "../controllers/clinicControler";
// import middlewareControler from "../controllers/middlewareControler";
// import statisticControler from "../controllers/statisticControler";

const {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCrud,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
} = require("../controllers/homeController");
const userController = require("../controllers/userController");
const doctorController = require("../controllers/doctorController");
const patientController = require("../controllers/patientController");
const specialtyControler = require("../controllers/specialtyControler");
const clinicControler = require("../controllers/clinicControler");
const middlewareControler = require("../controllers/middlewareControler");
const statisticControler = require("../controllers/statisticControler");
const medicinController = require("../controllers/medicineController")
const receptionistController = require("../controllers/receptionist.controller")
const examinationController = require("../controllers/examinationController")
const invoiceController = require("../controllers/invoiceController")
const sendMailHelper = require("../helper/sendMail")
const serviceHelper = require("../controllers/serviceController")

let router = express.Router();

let initWebRoutes = (app) => {
    //viết theo chuẩn rest api
    router.post('/api/send-invoice-email', async (req, res) => {
        try {
          const { email, patientName, patientId, services, medicines } = req.body; // Lấy dữ liệu từ body request
          console.log("Email body: ", req.body);
    
          // Chủ đề email
          const subject = `Hóa đơn dịch vụ cho bệnh nhân: ${patientName}`;
    
          // Xây dựng nội dung email
          const html = `
            <h3>Hóa đơn chi tiết cho bệnh nhân</h3>
            <p><strong>Tên bệnh nhân:</strong> ${patientName}</p>
            <p><strong>Mã bệnh nhân:</strong> ${patientId}</p>
    
            <h4>Dịch vụ đã sử dụng:</h4>
            <ul>
              ${services
                .map(
                  (service) => `
                  <li>
                    <strong>Dịch vụ ID:</strong> ${service.id} - 
                    <strong>Số lượng thuốc:</strong> ${service.medicine_quantity} - 
                    <strong>Ngày tạo:</strong> ${new Date(service.created_at).toLocaleString()}
                  </li>
                `
                )
                .join('')}
            </ul>
    
            <h4>Thuốc đã cấp:</h4>
            <ul>
              ${medicines
                .map(
                  (medicine) => `
                  <li>
                    <strong>Thuốc ID:</strong> ${medicine.id} - 
                    <strong>Số lượng:</strong> ${medicine.medicine_quantity} - 
                    <strong>Ngày tạo:</strong> ${new Date(medicine.created_at).toLocaleString()}
                  </li>
                `
                )
                .join('')}
            </ul>
    
            <p>Trân trọng,<br>Phòng khám ABC</p>
          `;
    
          // Gửi email thông qua helper
          const emailSent = await sendMailHelper.sendMail(email, subject, html);
          if (emailSent) {
            res.status(200).json({ message: 'Email sent successfully!' });
          } else {
            res.status(500).json({ message: 'Failed to send email.' });
          }
        } catch (error) {
          console.error("Error sending email: ", error);
          res.status(500).json({ message: "Failed to send email." });
        }
      });

    router.post('/api/confirm-schedule', async (req, res) => {
    try {
        // const { email, patientName, patientId, services, medicines } = req.body; // Lấy dữ liệu từ body request
        const email = req.body.email

        console.log("Email body: ", email);
        console.log("req.body: ", req.body);


        const formattedDate = new Date(+req.body.date).toLocaleDateString("vi-VN");
        // Chủ đề email
        const subject = `Xác nhận lịch hẹn với bác sĩ ${req.body.fullNameUser}`;

        // Xây dựng nội dung email
        const html = `
            <p>Chào bạn ${req.body.fullName}</p>
            <p>Bạn đã đặt lịch hẹn thành công với bác sĩ. ${req.body.fullNameUser} </p>
            <p>Chi tiết lịch hẹn:</p>
            <ul>
                <li><strong>Họ và tên: ${req.body.fullName}</strong> </li>
                <li><strong>Ngày khám: ${formattedDate}</strong> </li>
                <li><strong>Giờ khám: ${req.body.timeTypeValueVi} h</strong> </li>
                <li><strong>Địa điểm:</strong> Phòng khám Thu Cúc</li>
            </ul>
            <p>Vui lòng có mặt trước giờ hẹn 10 phút để được hỗ trợ tốt nhất.</p>
            <p>Trân trọng,</p>
            <p>Phòng khám XYZ</p>
         `;
          

        // Gửi email thông qua helper
        const emailSent = await sendMailHelper.sendMail(email, subject, html);
        if (emailSent) {
        res.status(200).json({ message: 'Email sent successfully!' });
        } else {
        res.status(500).json({ message: 'Failed to send email.' });
        }
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ message: "Failed to send email." });
    }
    });

    router.post('/api/cancel-schedule', async (req, res) => {
        try {
            const { email, fullName, fullNameUser, date, timeTypeValueVi } = req.body;
    
            // Kiểm tra các trường bắt buộc
            if (!email || !fullName || !fullNameUser || !date || !timeTypeValueVi) {
                return res.status(400).json({ message: "Missing required fields in request body." });
            }
    
            // Chuyển đổi timestamp sang ngày định dạng
            const formattedDate = new Date(+date).toLocaleDateString("vi-VN");
    
            // Chủ đề email
            const subject = `Thông báo hủy lịch hẹn với bác sĩ ${fullNameUser}`;
    
            // Xây dựng nội dung email
            const html = `
                <p>Chào bạn <strong>${fullName}</strong>,</p>
                <p>Rất tiếc, lịch hẹn của bạn với bác sĩ <strong>${fullNameUser}</strong> vào ngày <strong>${formattedDate}</strong> lúc <strong>${timeTypeValueVi}</strong> đã bị hủy.</p>
                <p>Chúng tôi rất xin lỗi vì sự bất tiện này.</p>
                <p>Nếu bạn muốn đặt lại lịch hẹn hoặc có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                <p>Trân trọng,</p>
                <p>Phòng khám Thu Cúc</p>
            `;
    
            // Gửi email thông qua helper
            const emailSent = await sendMailHelper.sendMail(email, subject, html);
            if (emailSent) {
                res.status(200).json({ message: 'Cancellation email sent successfully!' });
            } else {
                res.status(500).json({ message: 'Failed to send cancellation email.' });
            }
        } catch (error) {
            console.error("Error sending email: ", error);
            res.status(500).json({ message: "Failed to send email." });
        }
    });
    

    router.get("/", getHomePage);
    router.get("/about", getAboutPage);

    router.get("/crud", getCRUD); //chuyển sang trang edit
    router.post("/post-crud", postCrud); //chú ý gọi phương thức đúng ở đây là post
    router.get("/get-crud", displayCRUD);
    router.get("/edit-crud", getEditCRUD);
    //Nhấn nút update sẽ cập nhập csdl và quay lại trang /get-crud
    router.post("/put-crud", putCRUD); //click form có method là post
    router.get("/delete-crud", deleteCRUD); //chỉ là thẻ a chuyển trang thì ta chỉ cần dùng get

    //Viết api cho user
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-users", userController.handleGetAllUser); //http://localhost:8080/api/get-all-users?id=1
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user/:id", userController.handleEditUser);
    router.delete("/api/delete-user/:id", userController.handleDeleteUser); 
    router.get("/api/allcode", userController.handleGetAllCode);
    router.post("/api/change-password", userController.handleChangePassword);

    //Viết api cho doctor
    router.get("/api/top-doctor-home", doctorController.handleGetTopDoctorHome);
    router.get("/api/get-all-doctor", doctorController.handleGetAllDoctor);
    router.post(
        "/api/save-infor-doctor",
        doctorController.handlePostInforDoctor
    );
    router.get(
        "/api/get-detail-doctor-by-id",
        doctorController.handleGetDetailDoctorById
    );
    router.get("/api/get-top-doctor", doctorController.handleGetTopDoctor);
    router.get(
        `/api/search-doctor-by-name`,
        doctorController.handleSearchDoctorByName
    );

    //Viết api cho schedule
    router.post(
        "/api/bulk-create-schedule",
        doctorController.handleBulkCreateSchedule
    );
    router.get(
        "/api/get-schedule-doctor-by-date",
        doctorController.handleGetScheduleDoctorByDate
    );

    router.post(
        "/api/create-schedule-doctor-by-date",
        doctorController.handlePostScheduleDoctorByDate
    );

    router.get(
        "/api/get-extra-infor-doctor-by-id",
        doctorController.handleGetExtraInforDoctorById
    );
    router.delete(
        `/api/delete-schedule/:id`,
        doctorController.handleDeleteSchedule
    );
    router.get(
        `/api/get-doctor-by-clinic`,
        doctorController.handleGetDoctorByClinic
    );

    //Viết api đặt lịch
    router.get(
        "/api/get-profile-doctor-by-id",
        doctorController.handleGetProfileDoctorById
    );
    router.post(
        "/api/patient-book-appointment",
        patientController.handlePostBookAppointment
    );
    router.post(
        "/api/verify-book-appointment",
        patientController.handlePostVerifyBookAppointment
    );

    //Viết api quản lý chuyên khoa
    router.post(
        "/api/create-new-specialty",
        specialtyControler.handleCreateSpecialty
    );
    router.get(
        "/api/get-all-specialty",
        specialtyControler.handleGetAllSpecialty
    );
    router.get(
        `/api/search-specialty-by-name`,
        specialtyControler.handleSearchSpecialtyByName
    );
    //Viết api cho chi tiết chuyên khoa
    router.get(
        "/api/get-detail-specialty-by-id",
        specialtyControler.handleGetDetailSpecialtyById
    );
    router.put(
        "/api/edit-specialty/:id",
        specialtyControler.handleEditSpecialty
    );
    router.delete(
        "/api/delete-specialty/:id",
        specialtyControler.handleDeleteSpecialty
    ); //restAPI

    //Viết api quản lý phòng khám
    router.post("/api/create-new-clinic", clinicControler.handleCreateClinic);
    router.get("/api/get-clinic", clinicControler.handleGetAllClinic);
    router.get(
        "/api/get-detail-clinic-by-id",
        clinicControler.handleGetDetailClinicById
    );
    router.put("/api/edit-clinic/:id", clinicControler.handleEditClinic);
    router.delete("/api/delete-clinic/:id", clinicControler.handleDeleteClinic); //restAPI
    router.get(
        `/api/search-clinic-by-name`,
        clinicControler.handleSearchClinicByName
    );

    //Viết api search HomePage
    router.get("/api/search-by-name", userController.handleSearchByName);
    router.get("/api/search", userController.handleGetDataSearch);

    //Viết api xác thực người dùng
    router.post("/api/login2", userController.handleLogin2);
    router.get(
        "/api/system-user-infor",
        middlewareControler.authenticateToken,
        (req, res) => {
            let userInfor = {
                id: req.user.id,
                userName: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
            };

            if (req.user.role === "R1") {
                userInfor.userType = "admin";
            }
            if (req.user.role === "R2") {
                userInfor.userType = "doctor";
            }
            if (req.user.role === "R4") {
                userInfor.userType = "receptionist";
            }

            res.status(200).json({
                errCode: 0,
                message: "User Infor",
                userInfor,
            });
        }
    );
    router.get(
        "/api/admin-dashboard",
        middlewareControler.authenticateToken,
        middlewareControler.authorize(["R1"]),
        (req, res) => {
            let userInfor = {
                id: req.user.id,
                userName: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
            };
            // Xử lý khi người dùng là admin

            res.status(200).json({
                errCode: 0,
                message: "Admin Dashboard",
                userInfor,
            });
        }
    );
    router.get(
        "/api/doctor-dashboard",
        middlewareControler.authenticateToken,
        middlewareControler.authorize(["R2"]),
        (req, res) => {
            res.status(200).json({
                errCode: 0,
                message: "Doctor Dashboard",
            });
        }
    );

    router.get(
        "/api/receptionist-dashboard",
        middlewareControler.authenticateToken,
        middlewareControler.authorize(["R4"]),
        (req, res) => {
            res.status(200).json({
                errCode: 0,
                message: "Receptionist Dashboard",
            });
        }
    );

    router.get(
        "/api/home-dashboard",
        middlewareControler.authenticateToken,
        middlewareControler.authorize(["R1", "R2", "R4"]),
        (req, res) => {
            res.status(200).json({
                errCode: 0,
                message: "Welcome to dashboard home.",
            });
        }
    );

    //Viết api quản lý bệnh nhân
    router.get(
        "/api/get-list-patient-for-doctor",
        doctorController.handleGetListPatientForDoctor
    );

    router.get(
        "/api/get-list-patient-for-doctor-admin-s5",
        doctorController.handleGetListPatientForDoctorAdminS5
    );

    router.get(
        "/api/get-list-patient-for-doctor-admin",
        doctorController.handleGetListPatientForDoctorAdmin
    );

    router.post("/api/send-remedy", doctorController.handleSendRemedy);

    //Viết api thống kê
    router.get(
        `/api/get-booking-count-by-month`,
        statisticControler.handleGetBookingCountsByMonth
    );
    router.get(
        `/api/clinics/monthly-booking-stats`,
        statisticControler.handleClinicMonthlyBookingStats
    );
    router.get(
        `/api/count-stats-for-admin`,
        statisticControler.handleCountStatsForAdmin
    );

    //api get infor
    router.get(`/api/get-infor-user`, userController.handleGetInforUser);

    //Viết api lấy ra lịch khám 
    router.get(
        `/api/get-booking-history-for-patient`,
        middlewareControler.authenticateToken,
        patientController.handleGetBookingHistoryForPatient
    );
    router.get(
        `/api/look-up-booking-history-for-patient`,
        patientController.handleLookUpBookingHistoryForPatient
    );
    router.put(
        `/api/cancle-booking/:id`,
        patientController.handleCancleBooking
    );

    //Viết api cập nhập thông tin
    router.put(`/api/update-profile/:id`, userController.handleUpdateProfile);

    //Viết api lấy genders
    router.get(`/api/get-all-gender`, userController.handleGetAllGender);

    //Viết api đăng ký
    router.post(`/api/register`, userController.handleRegister);

    //Viết api đánh giá
    router.post(`/api/new-review`, patientController.handleNewReview);
    router.get(
        `/api/get-doctor-rating`,
        patientController.handleGetDoctorRating
    );
    router.get(`/api/get-reviews`, patientController.handleGetReviews);

    router.get(`/api/get-all-medicine`, medicinController.handleGetAllMedicines);
    router.get(`/api/get-all-medicine-invoice/:patientId`, medicinController.handleGetAllMedicinesByPatientId);
    router.get(`/api/get-all-service-invoice/:patientId`, medicinController.handleGetAllServicesByPatientId);
    router.post(
        `/api/create-medicine`,
        medicinController.handleCreateMedicine
    );

    router.post(
        `/api/create-medicine`,
        medicinController.handleCreateMedicine
    );

    router.delete(
        `/api/delete-medicine/:id`,
        medicinController.handleDeleteMedicine
    );


    router.get(`/api/get-all-bookings`, receptionistController.handleGetAllBooking);
    router.get(`/api/get-booking-by-user-id/:id`, receptionistController.getBookingsByUserId);
    router.get(`/api/get-doctor-by-id/:id`, receptionistController.getDoctorInfoById);


    router.delete(
        `/api/delete-booking/:id`,
        receptionistController.deleteBookingById
    );
    router.get(`/api/get-examination-payment/:id`, receptionistController.handleGetBookingById);
    router.put(`/api/update-booking-status/:id`, receptionistController.handleEditBookingById);

    router.post(`/api/post-examination`, examinationController.handlePostExamination);
    router.get(`/api/get-examination/:id`, examinationController.getPatientNamesByPatientId);

    router.post(`/api/create-invoice/:id`, invoiceController.handleCreateInvoice)

    router.get(`/api/get-all-service`, serviceHelper.handleGetAllServices)

    router.get(`/api/get-service/:id`, serviceHelper.handleGetService)

    router.delete(
        `/api/delete-service/:id`,
        serviceHelper.handleDeleteService
    );
    router.put(`/api/update-service/:id`, serviceHelper.handleUpdateService);
    router.post(`/api/create-service/:patientId`, serviceHelper.handleAddService)


    //sử dụng router cho ứng dụng
    return app.use("/", router);
};

module.exports = initWebRoutes;
