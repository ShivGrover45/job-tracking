const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const interviewSchema = new mongoose.Schema({
  round: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  mode: {
    type: String,
    enum: ['Online', 'In-person', 'Phone']
  },
  interviewer: {
    type: String
  },
  questions: [String],
  outcome: {
    type: String,
    enum: ['Cleared', 'Rejected', 'Awaiting'],
    default: 'Awaiting'
  },
  notes: {
    type: String
  }
})

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['applied', 'screening', 'interview', 'offer', 'rejected', 'ghosted'],
    default: 'applied'
  },
  jobUrl: {
    type: String
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  followUpDate: {
    type: Date
  },
  notes: [noteSchema],
  interviews: [interviewSchema]
}, { timestamps: true })

module.exports = mongoose.model('Job', jobSchema)