const express = require('express');
const path = require('path');

const logger = require('./middleware/loggers');
const studentRoutes = require('./routes/students.routes');

const app = express();

app.use(logger);
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('SMS Project is Running');
});

module.exports = app;