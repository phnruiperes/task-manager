const mongoose = require('mongoose')

async function connect() {

    try {
        res = await mongoose.connect('mongodb://127.0.0.1:27017/tak-manager-api')
        console.log("Connected Mongoose")

    } catch (e) {
        console.log("Mongoose Error:", e)
    }
}

connect()