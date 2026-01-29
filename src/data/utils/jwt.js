const jwt = require('jsonwebtoken')

//ใช้ “ออก token” โดยรับเฉพาะข้อมูลที่จำเป็น เช่น userId และ role
function signToken(payload) {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h'
  if (!secret) {
    throw new Error('JWT_SECRET ไม่ถูกกำหนดใน .env')
  }
  return jwt.sign(payload, secret, { expiresIn })
}

//ใช้ “ตรวจสอบ token” ซึ่งจะถูกเรียกจาก middleware ก่อนเข้า controller
function verifyToken(token) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET ไม่ถูกกำหนดใน .env')
  }
  return jwt.verify(token, secret)
}

module.exports = { signToken, verifyToken }