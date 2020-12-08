const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, './config/.env')});

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Require employee routes
const userRoutes = require('./repository/userRepository')

// using as middleware
app.use('/api/v1/users', userRoutes)

// listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});