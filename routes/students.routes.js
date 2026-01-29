// routes/students.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/students.controller");
 
// GET /students - get all students
router.get("/view", controller.renderStudentListPage);
 
router.get("/", controller.getStudents);
 
router.post("/", controller.createStudent);
 
router.get("/:id", controller.getStudentByID);
 
router.put("/:id", controller.updateStudent);
 
router.delete("/:id", controller.deleteStudent);
 
module.exports = router;