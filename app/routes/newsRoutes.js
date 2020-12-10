const express = require('express')
const router = new express.Router()
const News = require('../models/news')
const auth = require('../middleware/auth.js')

router.get('/', auth, async (req, res) => {
    try {
        const news = await News.find(req.query)
        res.status(200).send(news)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

router.post('/', auth, async (req, res) => {
    try {
        const news = await News.create(req.body)
        res.status(200).send(news)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

router.patch('/', auth, async (req, res) => {
    try {
        const found = await News.findOne(req.body)
        if (!found) return res.status(404).send({error: true, message: 'News item not found'})

        const news = await News.update(req.body)
        res.status(200).send(news)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

router.delete('/', auth, async (req, res) => {
    try {
        const found = await News.findOne(req.body)
        if (!found) return res.status(404).send({error: true, message: 'News item not found'})

        const news = await News.delete(req.body)
        res.status(200).send(news)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

router.get('/upvotes/:id/', auth, async (req, res) => {
    try {
        const found = await News.findOne(req.params)
        if (!found) return res.status(404).send({error: true, message: 'News item not found'})

        const upvotes = await News.getUpvotes(req.params)
        res.status(200).send(upvotes)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

router.get('/upvotes/:id/count', auth, async (req, res) => {
    try {
        const found = await News.findOne(req.params)
        if (!found) return res.status(404).send({error: true, message: 'News item not found'})

        const count = await News.countUpvotes(req.params)
        res.status(200).send(count)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

router.post('/upvote', auth, async (req, res) => {
    try {
        const found = await News.findOne(req.body)
        if (!found) return res.status(404).send({error: true, message: 'News item not found'})

        const upvoted = await News.getUpvotes({id: req.body.id, userId: req.payload.id})
        if (upvoted[0]) return res.status(404).send({error: true, message: 'Already upvoted'})

        const upvote = await News.upvote({
            userId: req.payload.id,
            newsId: req.body.id
        })

        res.status(200).send(upvote)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

module.exports = router