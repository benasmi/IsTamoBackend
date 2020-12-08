const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, './config/.env')});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const genericRoutes = require('./routes')
const userRoutes = require('./routes/userRoutes')

app.use(genericRoutes)
app.use('/api/users', userRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});