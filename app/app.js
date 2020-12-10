const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, './config/.env')});
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();

app.use(cors({origin: 'null'}))
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const genericRoutes = require('./routes')
const userRoutes = require('./routes/userRoutes')
const newsRoutes = require('./routes/newsRoutes')
const markRoutes = require('./routes/markRoutes')
const authRoutes = require('./routes/authRoutes')

app.use(genericRoutes)
app.use('/api/users', userRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/marks', markRoutes)
app.use('/api/auth', authRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});