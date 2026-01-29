const bcrypt = require('bcrypt');
const { prisma } = require('../config/db');
const { signToken } = require('../utils/jwt');

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username และ password จำเป็นต้องมี' });
    }

    // 1) ค้นหาผู้ใช้
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' });
    }

    // 2) ตรวจสถานะบัญชี
    if (user.is_active === false) {
      return res.status(403).json({ message: 'บัญชีถูกระงับการใช้งาน' });
    }

    // 3) ตรวจรหัสผ่าน (bcrypt)
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' });
    }

    // 4) อัปเดต last_login
    await prisma.users.update({
      where: { user_id: user.user_id },
      data: { last_login: new Date() }
    });

    // 5) ออก JWT (payload ที่จำเป็น)
    const token = signToken({
      userId: user.user_id,
      role: user.role, // enum users_role
      studentId: user.student_id || null,
      instructorId: user.instructor_id || null,
    });

    // 6) ส่งผลลัพธ์กลับ (ห้ามส่ง password_hash)
    return res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        student_id: user.student_id,
        instructor_id: user.instructor_id,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ server', error: String(err) });
  }
}

async function me(req, res) {
  try {
    const userId = req.user.userId;

    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        username: true,
        role: true,
        student_id: true,
        instructor_id: true,
        is_active: true,
        last_login: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ server', error: String(err) });
  }
}

async function logout(req, res) {
  // JWT แบบพื้นฐานเป็น stateless
  // Server ไม่ได้เก็บ token ดังนั้นการ logout ขั้นพื้นฐานคือ “ให้ client ลบ token ทิ้ง”
  return res.status(200).json({
    message: 'ออกจากระบบสำเร็จ (ให้ลบ token ฝั่ง client)',
  });
}

module.exports = { login, me, logout };