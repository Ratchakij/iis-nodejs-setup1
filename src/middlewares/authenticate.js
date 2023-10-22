const createError = require("../utils/create-error");

const tokenService = require("../services/token-service");
const userService = require("../services/user-service");

module.exports = async (req, res, next) => {
  try {
    // ### ตรวจสอบการรับรองตัวตน:
    const authorization = req.headers.authorization; // ดึงข้อมูลการรับรองตัวตน (authentication) จาก headers ของ HTTP request ที่ถูกส่งมาที่เซิร์ฟเวอร์และเก็บไว้ในตัวแปร authorization.

    // ทำการตรวจสอบว่า authorization มีค่า (ไม่เป็น falsy) และเริ่มต้นด้วยคำว่า 'Bearer '.
    // หากค่า authorization ไม่มี หรือไม่ได้เริ่มต้นด้วย 'Bearer ' จะทำการเรียกใช้ฟังก์ชัน createError
    // เพื่อสร้างข้อผิดพลาด (error) และ Unauthorized กลับไปที่ client โดยใช้สถานะ HTTP 401.
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("Unauthorized", 401));
    }

    // ### แยก Token:
    const token = authorization.split(" ")[1];
    // หาก Token ว่างเปล่า, จะ "Unauthorized" และส่งไปยัง middleware ถัดไป.
    if (!token) {
      return next(createError("Unauthorized", 401));
    }

    // ตรวจสอบ Token และ Payload:
    const payload = tokenService.verify(token); // ตรวจสอบ Token และถอดรหัส (verify) เพื่อรับข้อมูลที่อยู่ใน Token (payload).
    if (!payload) {
      return next(createError("Unauthorized", 401));
    }

    // ### การค้นหาผู้ใช้:
    const user = await userService.getUserById(payload.id); // Middleware นี้ใช้บริการ userService เพื่อค้นหาผู้ใช้จากฐานข้อมูลโดยใช้ id จาก payload.
    if (!user) {
      return next(createError("Unauthorized", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
