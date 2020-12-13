const express = require('express')
const router = new express.Router()
const SubjectUser = require('../models/subject_user')
const Subject = require('../models/subject_user')
const auth = require('../middleware/auth.js')

router.get('/users', auth, async (req, res) => {
    try {
        const result = await SubjectUser.getSubjects(req.body)
        return res.status(200).send(result)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.post('/users', auth, async (req, res) => {
    if (!req.body || !req.body.userId || !req.body.subjectId)
        return res.status(400).send({error: true, message: "Bad params"})

    try {
        const result = await SubjectUser.createSubjectUser(req.body)
        return res.status(200).send(result)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.patch('/users', auth, async (req, res) => {
    if (!req.body || !req.body.id)
        return res.status(400).send({error: true, message: "Bad params"})

    try {
        const result = await SubjectUser.updateSubjectUser(req.body)
        return res.status(200).send(result)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.delete('/users', auth, async (req, res) => {
    if (!req.body || !req.body.id)
        return res.status(400).send({error: true, message: "Bad params"})

    try {
        const result = await SubjectUser.removeSubjectUser(req.body)
        return res.status(200).send(result)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

module.exports = router
