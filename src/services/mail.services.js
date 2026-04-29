require('dotenv').config()
const nodemailer=require('nodemailer')
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email — Job Tracker",
    html: `
      <h2>Your OTP is <strong>${otp}</strong></h2>
      <p>Valid for 10 minutes. Do not share this with anyone.</p>
    `,
  });
};

const sendFollowUpReminder = async (email, company, role, notes) => {
  await transporter.sendMail({
    from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Follow-up reminder — ${company}`,
    html: `
      <h2>Time to follow up on your application</h2>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Your notes:</strong> ${notes || "No notes added"}</p>
    `,
  });
};

module.exports={sendOTPEmail,sendFollowUpReminder}