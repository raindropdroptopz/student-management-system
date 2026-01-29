const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'ต้องส่ง Authorization header' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'รูปแบบ Authorization ไม่ถูกต้อง (ต้องเป็น Bearer <token>)' });
    }

    const payload = verifyToken(token);

    // เก็บข้อมูลไว้ใน req เพื่อให้ controller ใช้ต่อ
    req.user = payload; // เช่น { userId, role, iat, exp }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'token ไม่ถูกต้องหรือหมดอายุ' });
  }
}

// Authorization: ตรวจ role (RBAC แบบง่าย)
function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง (role ไม่ถูกต้อง)' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง (role ไม่เพียงพอ)' });
    }

    next();
  };
}

module.exports = { requireAuth, requireRole };