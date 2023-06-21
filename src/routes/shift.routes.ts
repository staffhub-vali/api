import User from '../models/User.model'
import Shift from '../models/Shift.model'
import WorkDay from '../models/WorkDay.model'
import express, { Response } from 'express'
import { Authenticate, CustomRequest } from '../middleware/jwt.middleware'

const router = express.Router()

router
	.route('/')
	.get(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { start, end } = req.query

			const user = await User.findById(req.token._id)

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const workDays = await WorkDay.find({
				user: req.token._id,
				date: {
					$gte: start,
					$lte: end,
				},
			}).populate({
				path: 'shifts',
			})

			if (!workDays) {
				return res.status(404).json({ message: 'Work days not found.' })
			}

			return res.status(200).json(workDays)
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error.' })
		}
	})
	.post(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { workDayId, employeeId, start, end } = req.body

			if (!employeeId) {
				return res.status(400).json({ message: 'Please select an employee.' })
			}

			if (!start || !end) {
				return res.status(400).json({ message: 'Please select a start and end time.' })
			}

			const user = await User.findById(req.token._id).populate({
				path: 'workDays',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			const workDay = user.workDays.find((day) => day._id.toString() === workDayId)

			if (!workDay) {
				return res.status(404).json({ message: 'Work day not found' })
			}

			const existingShift = await Shift.findOne({ user: req.token._id, workDay: workDayId, employee: employeeId })

			if (existingShift) {
				return res.status(400).json({ message: 'User already has a shift for this day.' })
			}

			const shift = await Shift.create({ user: req.token._id, start, end, employee: employeeId, workDay: workDayId })

			workDay.shifts.push(shift._id)

			await workDay.save()

			return res.status(201).json({ message: 'Shift created successfully.' })
		} catch (error: any) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error.' })
		}
	})

module.exports = router
