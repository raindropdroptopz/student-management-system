const express = require('express');
const router = express.Router();

// Import the students controller
// The controller contains all business logic and database operations
const controller = require('../controllers/students.controller');

// ===== เพิ่ม import สำหรับ File Upload =====
const { upload } = require('../middleware/upload');
const validateUpload = require('../middleware/validateUpload');

// GET /students/view
router.get('/view', controller.renderStudentsPage);

// GET /students
// Retrieve a list of all students
router.get('/', controller.getStudents);

// POST /students
// Create a new student record
router.post('/', controller.createStudent);

// GET /students/:id
// Retrieve a single student by ID
router.get('/:id', controller.getStudentById);

// PUT /students/:id
// Update an existing student record
router.put('/:id', controller.updateStudent);

// DELETE /students/:id
// Delete a student record
router.delete('/:id', controller.deleteStudent);

// ===== STEP 3: Upload student photo =====
// POST /students/:id/photo
router.post(
  '/:id/photo',
  upload.single('photo'),   // รับไฟล์จาก field ชื่อ "photo"
  validateUpload,           // ตรวจว่ามีไฟล์ + id ถูกต้อง
  controller.uploadStudentPhoto
);

module.exports = router;
