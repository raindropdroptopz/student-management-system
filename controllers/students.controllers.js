//controllers/students.controller.js
//------------------------------------
//Student Controller
// - Handles business logic for the 'students' resource
// - Uses Prisma ORM as the data access layer
//------------------------------------

// TODO(Task 1): Import PrismaClient and create prisma instance here

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// TODO(Task 2): Add helper function parseStudentId(req)

function parseStudentId(req) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) return null
  return id
}

// TODO(Task 3): Implement GET /students (getStudents)

exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      orderBy: { student_id: 'asc' },
    })
    return res.json(students)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// TODO(Task 4): Implement GET /students/:id (getStudentById)
exports.getStudentById = async (req, res) => {
  const id = parseStudentId(req)
  if (!id) return res.status(400).json({ error: 'Invalid student ID' })
  try {
    const student = await prisma.students.findUnique({
      where: { student_id: id },
    })
    if (!student) return res.status(404).json({ error: 'Student not found' })
    return res.json(student)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// TODO(Task 5): Implement POST /students (createStudent)

// TODO(Task 5): Implement POST /students (createStudent)

exports.createStudent = async (req, res) => {
  try {
    const {
      student_no,
      first_name_th,
      last_name_th,
      program_id,
      email,
      phone,
      status,
    } = req.body

    // 1. Validation
    if (
      !student_no ||
      !first_name_th ||
      !last_name_th ||
      program_id === undefined
    ) {
      return res.status(400).json({
        message:
          'Required fields: student_no, first_name_th, last_name_th, program_id',
      })
    }

    // 2. Create Data (ต้องอยู่ใน try block เดียวกัน)
    const created = await prisma.students.create({
      data: {
        student_no,
        first_name_th,
        last_name_th,
        program_id: Number(program_id),
        email: email ?? null,
        phone: phone ?? null,
        status: status ?? 'active',
      },
    })

    return res.status(201).json(created)
  } catch (err) {
    // 3. Error Handling
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Student number already exists' })
    }
    return res.status(500).json({ error: err.message })
  }
}

// TODO(Task 6): Implement PUT /students/:id (updateStudent)

exports.updateStudent = async (req, res) => {
  try {
    const student_id = parseStudentId(req)
    if (!student_id) {
      return res.status(400).json({ message: 'Invalid student ID' })
    }

    const { student_no, first_name_th, last_name_th, program_id } = req.body

    const updateData = {}
    if (student_no) updateData.student_no = student_no
    if (first_name_th) updateData.first_name_th = first_name_th
    if (last_name_th) updateData.last_name_th = last_name_th
    if (program_id !== undefined) updateData.program_id = Number(program_id)

    const updatedStudent = await prisma.students.update({
      where: { student_id },
      data: updateData,
    })

    return res.json(updatedStudent)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Student not found' })
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Student number already exists' })
    }
    return res.status(500).json({ error: err.message })
  }
}

// TODO(Task 7): Implement DELETE /students/:id (deleteStudent)

exports.deleteStudent = async (req, res) => {
  try {
    const student_id = parseStudentId(req)
    if (!student_id) {
      return res.status(400).json({ message: 'Invalid student ID' })
    }

    await prisma.students.delete({
      where: { student_id },
    })

    return res.json({ message: 'Student deleted successfully' })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Student not found' })
    }
    return res.status(500).json({ error: err.message })
  }
}

// TODO(Optional): Implement renderStudentsPage for EJS

exports.renderStudentsPage = async (req, res) => {
  try {
    const students = await prisma.students.findMany({
      orderBy: { student_id: 'asc' },
    })

    return res.render('students', { students })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
