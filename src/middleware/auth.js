const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        dec_token = jwt.verify(token,'oneforall')
        user = await User.findOne({_id: dec_token._id,'tokens.token':token})

        if(!user){
            throw new Error()
        }

        req.user = user
        next()
    }catch(e){
        res.status(401).send({error:"Authentication Error"})
    }
}

module.exports = auth