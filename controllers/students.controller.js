// controllers/students.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 
// helper function
function parseStudentID(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}
 
// GET Students
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      orderBy: { student_id: 'asc' } // ใช้ชื่อคอลัมน์จริงใน DB
    });
    return res.json(students);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
 
// GET Student by ID
exports.getStudentByID = async (req, res) => {
  try {
    const id = parseStudentID(req);
    if (!id) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
 
    const student = await prisma.students.findUnique({
      where: { student_id: id }
    });
 
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
 
    return res.json(student);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
 
// CREATE Student
exports.createStudent = async (req, res) => {
  try {
    const { student_no, first_name_th, last_name_th, program_id, email, phone, status } = req.body;
 
    if (!student_no || !first_name_th || !last_name_th || program_id === undefined) {
      return res.status(400).json({
        message: 'require fields: student_no, first_name_th, last_name_th, program_id'
      });
    }
 
    const create = await prisma.students.create({
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
 
    return res.status(201).json(create);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Student number already exists' });
    }
    return res.status(500).json({ error: err.message });
  }
};
 
// UPDATE Student
exports.updateStudent = async (req, res) => {
  try {
    const id = parseStudentID(req);
    if (!id) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
 
    const { student_no, first_name_th, last_name_th, program_id } = req.body;
 
    const updateData = {};
    if (student_no) updateData.student_no = student_no;
    if (first_name_th) updateData.first_name_th = first_name_th;
    if (last_name_th) updateData.last_name_th = last_name_th;
    if (program_id !== undefined) updateData.program_id = Number(program_id);
 
    const updatedStudent = await prisma.students.update({
      where: { student_id: id },
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
 
// DELETE Student
exports.deleteStudent = async (req, res) => {
  try {
    const id = parseStudentID(req);
    if (!id) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
 
    await prisma.students.delete({
      where: { student_id: id }
    });
 
    return res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Student not found' });
    }
    return res.status(500).json({ error: err.message });
  }
};
 
// RENDER Students List Page
exports.renderStudentListPage = async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      orderBy: { student_id: 'asc' }
    });
    return res.render('students', { students });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};