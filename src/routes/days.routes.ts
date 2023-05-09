import WorkDay from '../models/WorkDay.model'
import express, { Request, Response } from 'express'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

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
