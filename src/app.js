const express=require('express')
const cookie=require('cookie-parser')
require('dotenv').config()
const app=express()
app.use(cookie())
module.exports=app