const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth.js')
const Mark = require('../models/mark')
const User = require('../models/user')

router.get('/', auth, async (req, res) => {
    try {
        const marks = await Mark.find(req.query)

        if (marks.length === 0) 
            return res.status(404).send({error: true, message: "No marks found"})

        return res.status(200).send(marks)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.post('/', auth, async (req, res) => {
    if (!req.body || !req.body.subjectId || !req.body.userId || 
        req.body.description === undefined || !req.body.mark)
            return res.status(400).send({error: true, message: "Bad request"})

    try {
        const mark = await Mark.create(req.body)
        return res.status(200).send(mark)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.patch('/', auth, async (req, res) => {
    if (!req.body || !req.body.id)
        return res.status(400).send({error: true, message: 'Bad request'})
    try {
        const found = await Mark.findOne(req.body)
        if (!found) return res.status(404).send({error: true, message: 'Mark not found'})

        const mark = await Mark.update(req.body)
        return res.status(200).send(mark)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.delete('/', auth, async (req, res) => {
    try {
        const found = await Mark.findOne(req.body)
        if (!found) return res.status(404).send({error: true, message: 'Mark not found'})

        const mark = await Mark.delete(req.body)
        return res.status(200).send(mark)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/average', auth, async (req, res) => {
    if (!req.query.userId) 
        return res.status(400).send({error: true, message: "Bad query (missing userId)"})
    try {
        const found = await User.findOne("id", req.query.userId)
        if (!found) return res.status(404).send({error: true, message: 'User not found'})

        const average = await Mark.getAverage(req.query)

        return res.status(200).send(average)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

module.exports = router