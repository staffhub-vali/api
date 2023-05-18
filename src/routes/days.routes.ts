import User from '../models/User.model'
import express, { Response } from 'express'
import { Authenticate } from '../middleware/jwt.middleware'
import { CustomRequest } from '../middleware/jwt.middleware'

const router = express.Router()

router.get('/', Authenticate, async (req: CustomRequest | any, res: Response) => {
	try {
		const user = await User.findOne({ _id: req.token._id }).populate({
			path: 'workDays',
		})

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		res.status(200).json(user.workDays)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server Error' })
	}
})

router.get('/:id', Authenticate, async (req: CustomRequest | any, res: Response) => {
	try {
		const user = await User.findById(req.token._id).populate({
			path: 'workDays',
			populate: {
				path: 'shifts',
				populate: {
					path: 'employee',
				},
			},
		})

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		const workDay = user.workDays.find((workDay) => workDay._id.toString() === req.params.id)

		if (!workDay) {
			return res.status(404).json({ message: 'Work day not found.' })
		}

		res.status(200).json(workDay)
	} catch (error: any) {
		console.log(error)
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
