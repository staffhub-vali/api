import Schedule from '../models/Schedule.model'
import express, { Request, Response } from 'express'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

router.get('/', Authenticate, async (req, res) => {
	try {
		const schedules = await Schedule.find()
		res.status(200).json(schedules)
	} catch (error: any) {
		console.log(error)
		res.status(500).json({ message: error.message })
	}
})

router.get('/:id', Authenticate, async (req, res) => {
	try {
		const schedule = await Schedule.findById(req.params.id).populate('workDays')
		res.status(200).json(schedule)
	} catch (error: any) {
		console.log(error)
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
