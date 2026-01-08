const express = require('express');
const router = express.Router();

const {
  getStudents,
  getStudentById,
  renderStudentsPage,
} = require('../controllers/students.controllers');

router.get('/view', renderStudentsPage);

router.get('/', getStudents);
router.get('/:id', getStudentById);

module.exports = router;