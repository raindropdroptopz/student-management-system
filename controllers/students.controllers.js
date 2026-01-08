const students = require('../middleware/src/data/students');

function getStudents(req, res) {
  res.json(students);
}

function getStudentById(req, res) {
  const id = Number(req.params.id);
  
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json(student);
}

function renderStudentsPage(req, res) {
  res.render('students', { students });
}

module.exports = {
  getStudents,
  getStudentById,
  renderStudentsPage,
};