const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error("Age can't be negative")
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password can include the word "password"')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.methods.generateAuthToken = async function (){
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, 'oneforall', {expiresIn:"7d"})
    
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
        
    next()
})

const User = new mongoose.model("User", userSchema)
module.exports = User