const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.js')

router.get('/', (req, res) => {
    res.send('Hello world!')
});

module.exports = router