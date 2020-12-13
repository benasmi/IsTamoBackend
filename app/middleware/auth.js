const jwt = require('jsonwebtoken')
const BEARER = 'Bearer ';
const auth = async (req, res, next) => {
    let accessToken = req.header('Authorization');
    if (!accessToken && !accessToken.startsWith(BEARER)){
        return res.status(403).send()
    }

    let payload
    try{
        let parsedToken = accessToken.replace(BEARER, '');
        payload = jwt.verify(parsedToken, process.env.ACCESS_TOKEN_SECRET)
        req.payload = payload
        next()
    }
    catch(e){
        return res.status(401).send(e)
    }
}

module.exports = auth