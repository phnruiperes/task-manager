const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/task.js')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.listen(port,()=>{
    console.log('Server is up on port',port)
})

// Create User
app.post('/users',async (req,res)=>{
        const user = new User(req.body)
        
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})
// Get Users
app.get('/users',async (req,res)=>{

    try{
        users = await User.find({})
        res.status(200).send(users)
    }catch(e){
        res.status(500).send()
    }
})
// Get User by Id
app.get('/users/:id',async (req,res)=>{
    const _id = req.params.id
    
    try{
        user = await User.findById(_id)
        if(!user){
            res.status(404).send("404: User not found")
        }else{
            res.status(200).send(user)
        }
    }catch(e){
        res.status(500).send()
    }
})

// Create Task
app.post('/tasks',async (req,res)=>{
    const task = new Task(req.body)
    
try{
    await task.save()
    res.status(201).send(task)
}catch(e){
    res.status(400).send(e)
}
})
// Get Tasks
app.get('/tasks',async (req,res)=>{

    try{
        tasks = await Task.find({})
        res.status(200).send(tasks)
    }catch(e){
        res.status(500).send()
    }
})
// Get Task by Id
app.get('/tasks/:id',async (req,res)=>{
    const _id = req.params.id
    
    try{
        task = await Task.findById(_id)
        if(!task){
            res.status(404).send("404: Task not found")
        }else{
            res.status(200).send(task)
        }
    }catch(e){
        res.status(500).send()
    }
})
    


