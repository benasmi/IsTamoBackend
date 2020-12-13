const express = require('express')
const router = express.Router()
const User = require('../models/user')
const SubjectUser = require('../models/subject_user')
const auth = require('../middleware/auth.js')

router.get('/me', auth, async (req, res) => {
    try {
        console.log(req.payload.id);
        const user = await User.findOne({id: req.payload.id})

        user.subjects = await SubjectUser.getSubjects({userId: req.payload.id})

        return res.status(200).send(user)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find(req.query)

        for (var i = 0; i < users.length; i++) {
            users[i].subjects = await SubjectUser.getSubjects({userId: users[i].id})
        }

        return res.status(200).send(users)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/:id/', auth, async (req, res) => {
    try {
        const user = await User.findOne({id: req.params.id})
        if (!user) return res.status(404).send({error: true, message: 'User not found'})

        user.subjects = await SubjectUser.getSubjects({userId: user.id})

        return res.status(200).send(user)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.post('/', auth, async (req, res) => {
    try {
        const inserted = await User.create(req.body)
        if (req.body.subjects) {
            req.body.subjects.forEach(async element => {
                await SubjectUser.createSubjectUser({subjectId: element, userId: inserted.id})
            })
        }
        return res.status(200).send(inserted)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.patch('/', auth, async (req, res) => {
    try {
        const user = await User.findOne({id: req.body.id});
        if (!user) return res.status(404).send({error: true, message: 'User not found'})

        await User.update(req.body)

        return res.status(200).send(user)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.delete('/', auth, async (req, res) => {
    try {
        const user = await User.findOne({id: req.body.id})
        if (!user) return res.status(404).send({error: true, message: 'User not found'})

        await User.delete(req.body.id)

        return res.status(200).send(user)
    } catch (e) {res.status(500).send({error: true, message: e.message})}
})

router.get('/:id/related', auth, async (req, res) => {
    console.log(req.payload)
    try {
        const users = await User.getRelatedUsers({userId: req.params.id === "me" ? req.payload.id : req.params.id})

        return res.status(200).send(users)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

module.exports = router