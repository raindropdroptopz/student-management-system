// app.js
const express = require('express')
const path = require('path')
const logger = require('./middleware/logger')
// 1. เพิ่มบรรทัดนี้ครับ (สมมติว่าคุณมีไฟล์ errorHandler.js อยู่ใน folder middleware)
const errorHandler = require('./middleware/errorHandler')

const studentRoutes = require('./routes/students.routes')
const app = express()

// Middleware พื้นฐาน
app.use(logger)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ตั้งค่า View Engine (EJS)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Mount routes
app.use('/students', studentRoutes)
// (ผมลบบรรทัดที่ซ้ำออกให้แล้วครับ: app.use('/students', studentRoutes);)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.static(path.join(__dirname, 'public')))

// หน้า Home แบบง่าย
app.get('/', (req, res) => {
  res.send('SMS Project is running')
})

// 404 handler (ต้องมาก่อน errorHandler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// error handler (ต้องอยู่ท้ายสุดเสมอ)
// ตอนนี้บรรทัดนี้จะทำงานได้แล้ว เพราะเรา import มาแล้วข้างบน
app.use(errorHandler)

module.exports = app
