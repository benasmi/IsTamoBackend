const express = require('express')
const router = express.Router()
const Schedule = require('../models/schedule')
const SubjectSchedule = require('../models/subject_schedule')
const SubjectUser = require('../models/subject_user')
const Subject = require('../models/subject')
const Room = require('../models/room')
const auth = require('../middleware/auth.js')

router.get('/', auth, async (req, res) => {
    try {
        const subjects = await SubjectUser.getSubjects({userId: req.payload.id})

        for (let i = 0; i < subjects.length; i++) {
            const schedule = await SubjectSchedule.getSchedule({subjectId: subjects[i].id})

            for (let j = 0; j < schedule.length; j++) {
                const scheduleInfo = await Schedule.getScheduleInfo({scheduleId: schedule[j].fk_scheduleId})
                const roomInfo = await Room.getRoom({roomId: schedule[j].fk_roomId})
                schedule[j].info = scheduleInfo
                schedule[j].room = roomInfo
            }

            subjects[i].schedule = schedule
        }

        return res.status(200).send(subjects)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/global', auth, async (req, res) => {
    try {
        const schedule = await Schedule.getSchedules({})
        return res.status(200).send(schedule)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/rooms', auth, async (req, res) => {
    try {
        const rooms = await Room.getRooms({})
        return res.status(200).send(rooms)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/rooms', auth, async (req, res) => {
    try {
        const subjects = await Subject.getSubjects({})
        return res.status(200).send(subjects)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/user/:id', auth, async (req, res) => {
    try {
        const subjects = await SubjectUser.getSubjects({userId: req.params.id})

        for (let i = 0; i < subjects.length; i++) {
            const schedule = await SubjectSchedule.getSchedule({subjectId: subjects[i].id})

            for (let j = 0; j < schedule.length; j++) {
                const scheduleInfo = await Schedule.getScheduleInfo({scheduleId: schedule[j].fk_scheduleId})
                const roomInfo = await Room.getRoom({roomId: schedule[j].fk_roomId})
                schedule[j].info = scheduleInfo
                schedule[j].room = roomInfo
            }

            subjects[i].schedule = schedule
        }

        return res.status(200).send(subjects)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.get('/subjects/:id', auth, async (req, res) => {
    try {
        const schedule = await SubjectSchedule.getSchedule({subjectId: req.params.id})
        for (let i = 0; i < schedule.length; i++) {
            const scheduleInfo = await Schedule.getScheduleInfo({scheduleId: schedule[i].fk_scheduleId})
            const roomInfo = await Room.getRoom({roomId: schedule[i].fk_roomId})
            schedule[i].info = scheduleInfo
            schedule[i].room = roomInfo
        }
        return res.status(200).send(schedule)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.post('/', auth, async (req, res) => {
    try {
        const schedule = await SubjectSchedule.createSubjectSchedule(req.body)

        return res.status(200).send(schedule)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.patch('/', auth, async (req, res) => {
    try {
        const schedule = await SubjectSchedule.updateSubjectSchedule(req.body)

        return res.status(200).send(schedule)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

router.delete('/', auth, async (req,res) => {
    try {
        const schedule = await SubjectSchedule.removeSubjectSchedule(req.body)

        return res.status(200).send(schedule)
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

module.exports = router