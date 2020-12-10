const express = require('express')
const router = express.Router()
const System = require('../models/system')
const auth = require('../middleware/auth.js')

router.get('/', async (req, res) => {
    try {
        const params = await System.getParams()
        return res.status(200).send(params)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.patch('/', auth, async (req, res) => {
    try {
        const params = await System.updateParams(req.body)
        return res.status(200).send(params)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/theme', async (req, res) => {
    try {
        const params = await System.getParams()
        return res.status(200).send({theme: params.theme})
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

module.exports = router