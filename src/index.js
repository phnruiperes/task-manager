const express = require('express')
require('./db/mongoose.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express()
const port = process.env.PORT || 3000

/* app.use(function serverMaintenance(req,res,next){
    if(req.method){
        res.status(503).send('Server Maintenance')
    }else{
        next()
    }
}) */

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port', port)
})

