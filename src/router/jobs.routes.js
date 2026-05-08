const express=require('express')
const auth=require('../middleware/auth.middleware')
const { getJobs, createJob, getStats, getJob, updateJob, deleteJob, addNote, addInterview, updateInterview } = require('../controller/job.controller')

const jobRouter=express.Router()

jobRouter.get('/',auth,getJobs)
jobRouter.post('/',auth,createJob)
jobRouter.get('/stats',auth,getStats)
jobRouter.get('/:id',auth,getJob)
jobRouter.patch('/:id',auth,updateJob)
jobRouter.delete('/:id',auth,deleteJob)
jobRouter.post('/:id/notes',auth,addNote)
jobRouter.post('/:id/interviews',auth,addInterview)
jobRouter.patch('/:jobId/interviews/:interviewId',auth,updateInterview)

module.exports=jobRouter