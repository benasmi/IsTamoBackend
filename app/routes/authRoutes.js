const express = require('express')
const router = new express.Router()
const path = require('path');
require('dotenv').config({path: path.join(__dirname, './config/.env')});
const auth = require('../middleware/auth.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/user')

router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');

    try {
        var user = await User.findOne({email, password})
        if (!user)
            return res.status(404).send({error: true, message: "User not found"})

        let payload = {
            id: user.id,
            role: user.role
        }

        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        })

        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        })

        User.updateRefreshToken({userId: user.id, token: refreshToken})

        // res.cookie("jwt", accessToken, {secure: false, httpOnly: true})
        res.status(200).send(accessToken)
    } catch (e) {
        return res.status(500).send({error: true, message: e.message})
    }
})

router.post('/refresh', async (req, res) => {
    let accessToken = req.cookies.jwt

    if (!accessToken){
        return res.status(403).send()
    }

    let payload
    try{
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    } catch(e) {return res.status(401).send({error: true, message: e.message})}

    let user
    try {
        user = await User.findOne(["id"], [payload.id])
    } catch (e) {return res.status(404).send({error: true, message: e.message})}

    const refreshToken = user.refresh_token

    try{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch(e){
        return res.status(401).send({error: true, message: e.message})
    }
    const newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, 
    {
        algorithm: "HS256"
    })
    
    res.cookie("jwt", newToken, {secure: false, httpOnly: true})
    res.status(200).send()
})

router.post('/logout', auth, async (req, res) => {
    try {
        User.updateRefreshToken(req.payload.id, null)
        res.cookie("jwt", null, {secure: false, httpOnly: true})
        res.status(200).send()
    } catch (e) {return res.status(500).send({error: true, message: e.message})}
})

module.exports = router