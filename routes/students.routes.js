const express = require('express');
const router = express.Router();
const controller = require('../controllers/students.controller');

router.get('/', controller.getStudents);
router.get('/:id', controller.getStudentById);
router.post('/', controller.createStudent);
router.put('/:id', controller.updateStudent);
router.delete('/:id', controller.deleteStudent);

// Optional
router.get('/view/all', controller.renderStudentsPage);

module.exports = router;