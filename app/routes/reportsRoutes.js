const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth.js')
const Report = require('../models/reports')

router.get('/', auth, async (req, res) => {
    try {
        const result = await Report.generateSchoolReport({})
        res.status(200).send(result)
    } catch (e) {res.status(500).send({error: true, message: e.message})}
})

module.exports = router