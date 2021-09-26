const express= require("express")

const app =express()

let path = require('path')

const publicPath = path.join(__dirname,'./public')
app.use(express.static(publicPath))


app.listen(5050, ()=>{
    console.log('funciona en http://localhost:5050/productCart' )
})

app.get('/login', (req,res) =>{
    res.sendFile(path.join(__dirname,'/views/login.html'))
})














app.get('/register', (req,res) =>{
    res.sendFile(path.join(__dirname,'/views/register.html'))
})

app.get('/productCart', (req,res) =>{
    res.sendFile(path.join(__dirname,'/views/productCart.html'))
})