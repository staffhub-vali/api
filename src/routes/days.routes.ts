import WorkDay from '../models/WorkDay.model'
import express, { Request, Response } from 'express'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

router.get('/', Authenticate, async (req: Request, res: Response) => {
	try {
		const today = new Date().toLocaleDateString('en-GB')

		const workDays = await WorkDay.find({
			date: today,
		})

		res.status(200).json(workDays)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server Error' })
	}
})

router.get('/:id', Authenticate, async (req, res) => {
	try {
		const workDay = await WorkDay.findById(req.params.id).populate({
			path: 'shifts',
			populate: {
				path: 'employee',
			},
		})
		res.json(workDay)
	} catch (error: Error | any) {
		console.log(error)
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
