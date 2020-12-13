const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, './config/.env')});
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();

app.use(cors( {origin: 'http://localhost:3001'}))
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const genericRoutes = require('./routes')
const userRoutes = require('./routes/userRoutes')
const newsRoutes = require('./routes/newsRoutes')
const markRoutes = require('./routes/markRoutes')
const authRoutes = require('./routes/authRoutes')
const systemRoutes = require('./routes/systemRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes')
const subjectRoutes = require('./routes/subjectRoutes')

app.use(genericRoutes)
app.use('/api/users', userRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/marks', markRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/system', systemRoutes)
app.use('/api/schedule', scheduleRoutes)
app.use('/api/subject', subjectRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});