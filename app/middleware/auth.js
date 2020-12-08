const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    let accessToken = req.cookies.jwt

    if (!accessToken){
        return res.status(403).send()
    }

    let payload
    try{
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        req.payload = payload
        next()
    }
    catch(e){
        return res.status(401).send()
    }
}

module.exports = auth