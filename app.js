// app.js
const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const studentRoutes = require('./routes/students.routes');
const app = express();
// Middleware พื ้นฐาน
app.use(logger);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// ตั ้งค่า View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Mount routes
app.use('/students', studentRoutes);
// หน้า Home แบบง่าย
app.get('/', (req, res) => {
    res.send('SMS Project is running');
});
module.exports = app;