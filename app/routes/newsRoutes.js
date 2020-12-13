const express = require('express')
const router = new express.Router()
const News = require('../models/news')
const auth = require('../middleware/auth.js')

// - DONE
router.get('/', auth, async (req, res) => {
    try {
        req.query.userId = req.payload.id
        const news = await News.find(req.query)
        for (let i = 0; i < news.length; i++) {
            const upvotesCount = await News.countUpvotes({newsId: news[i].id})
            const upvoted = await News.getUpvotes({userId: req.payload.id, newsId: news[i].id})
            upvoted.length > 0 ? news[i].upvoted = true : news[i].upvoted = false 
            news[i].upvotesCount = upvotesCount
        }
        res.status(200).send(news)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

// - DONE
router.post('/', auth, async (req, res) => {
    console.log(req.body);
    if (!req.body || !req.body.title || !req.body.content)
        return res.status(500).send({error: true, message: "Bad request"})
    try {
        req.body.userId = req.payload.id;
        const news = await News.create(req.body);
        res.status(200).send(news)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})


router.patch('/', auth, async (req, res) => {
    try {
        const found = await News.findOne(req.body.id)
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

        const upvoted = await News.getUpvotes({newsId: req.body.newsId, userId: req.payload.id})
        if (upvoted[0]) {
            await News.downvote({newsId: req.body.newsId, userId: req.payload.id})
            return res.status(200).send()
        }

        const upvote = await News.upvote({
            userId: req.payload.id,
            newsId: req.body.newsId
        });

        res.status(200).send(upvote)
    } catch (e) {return res.status(500).send({error: true, message: e})}
})

module.exports = router