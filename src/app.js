const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./router/auth.router')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use('/api/auth',authRouter)

module.exports = app