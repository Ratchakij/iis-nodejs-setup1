const createError = (message, statusCode) => {
  const error = new Error(message); // สร้าง Error object
  error.statusCode = statusCode; // กำหนดค่าของ property 'statusCode' ของ Error object เพื่อเก็บ status ของข้อผิดพลาด.
  return error;
  //   throw error;
};

module.exports = createError;
