// controllers/students.controller.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Safely parse student_id from URL parameters.
 */
function parseStudentId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// GET /students
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      orderBy: { student_id: 'asc' }
    });
    return res.json(students);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const student = await prisma.students.findUnique({
      where: { student_id }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json(student);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /students
exports.createStudent = async (req, res) => {
  try {
    const { student_no, first_name_th, last_name_th, program_id, email, phone, status } = req.body;

    if (!student_no || !first_name_th || !last_name_th || program_id === undefined) {
      return res.status(400).json({
        message: 'Required fields: student_no, first_name_th, last_name_th, program_id'
      });
    }

    const created = await prisma.students.create({
      data: {
        student_no,
        first_name_th,
        last_name_th,
        program_id: Number(program_id),
        email: email ?? null,
        phone: phone ?? null,
        status: status ?? 'active'
      }
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Student number already exists' });
    }
    return res.status(500).json({ error: err.message });
  }
};

// PUT /students/:id
exports.updateStudent = async (req, res) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const { student_no, first_name_th, last_name_th, program_id } = req.body;

    const updateData = {};
    if (student_no) updateData.student_no = student_no;
    if (first_name_th) updateData.first_name_th = first_name_th;
    if (last_name_th) updateData.last_name_th = last_name_th;
    if (program_id !== undefined) updateData.program_id = Number(program_id);

    const updatedStudent = await prisma.students.update({
      where: { student_id },
      data: updateData
    });

    return res.json(updatedStudent);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Student number already exists' });
    }
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    await prisma.students.delete({
      where: { student_id }
    });

    return res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Student not found' });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.showUploadForm = async (req, res) => {
    try {
        const { id } = req.params; // รับ id จาก URL (เช่น /students/5/upload)
        
        // ส่งค่า id ไปที่หน้า upload.ejs
        res.render('upload', { 
            student_id: id 
        });
    } catch (error) {
        res.status(500).send("Error");
    }
};

// GET /students/view
exports.renderStudentsPage = async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      orderBy: { student_id: 'asc' }
    });

    return res.render('students', { students });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

/**
 * STEP 4) POST /students/:id/photo
 * Upload student photo
 *
 * เงื่อนไข:
 * - multer (upload.single('photo')) จะทำให้มี req.file
 * - validateUpload จะกันกรณีไม่มีไฟล์ / id ไม่ใช่ตัวเลขแล้ว
 */
exports.uploadStudentPhoto = async (req, res, next) => {
  try {
    const student_id = parseStudentId(req);
    if (!student_id) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    // ตรวจว่ามีนักศึกษาจริงก่อน (กันอัปโหลดให้ id ที่ไม่มี)
    const student = await prisma.students.findUnique({
      where: { student_id }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // multer จะใส่ข้อมูลไฟล์ไว้ใน req.file
    const file = req.file;

    // (Optional) ถ้าตาราง students ของคุณมีคอลัมน์เก็บชื่อไฟล์รูป เช่น photo / avatar / image
    // ให้ปลด comment และแก้ชื่อ field ให้ตรงกับ schema จริง
    // await prisma.students.update({
    //   where: { student_id },
    //   data: { photo: file.filename }
    // });

    return res.status(200).json({
      success: true,
      message: 'Upload success',
      data: {
        student_id,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/students/${file.filename}`
      }
    });
  } catch (err) {
    // ส่งให้ errorHandler.js จัดการต่อ
    return next(err);
  }
};
