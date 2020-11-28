const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController');

// Create a new employee
router.post('/', userController.create);
module.exports = router