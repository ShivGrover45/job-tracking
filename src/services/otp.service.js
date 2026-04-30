const OTP = require('../models/otp.model')

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const saveOTP = async (email) => {
  const otp = generateOTP()

  await OTP.findOneAndReplace(
    { email },
    { email, otp, createdAt: new Date() },
    { upsert: true }
  )

  return otp
}

const verifyOTP = async (email, otp) => {
  const otpRecord = await OTP.findOneAndDelete({ email, otp })
  if (!otpRecord) return false
  return true
}

module.exports = { saveOTP, verifyOTP }