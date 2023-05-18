import User from '../models/User.model'
import Shift from '../models/Shift.model'
import WorkDay from '../models/WorkDay.model'
import Employee from '../models/Employee.model'
import express, { Response } from 'express'
import { Authenticate, CustomRequest } from '../middleware/jwt.middleware'

const router = express.Router()

router.route('/').post(Authenticate, async (req: CustomRequest | any, res: Response) => {
	try {
		const { id, data } = req.body

		const user = await User.findOne({ _id: req.token._id })

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		const employee = await Employee.findById(id)

		if (!employee) {
			return res.status(404).json({ message: 'Employee not found' })
		}

		for (const { date, start, end } of data) {
			let workDay = await WorkDay.findOne({ date: date })

			if (!workDay) {
				workDay = await WorkDay.create({ date: date })
			}

			if (!start || !end) {
				continue
			}

			const shift = await Shift.create({
				start,
				end,
				employee,
				workDay,
			})

			workDay.shifts.push(shift._id)
			user.workDays.push(workDay._id)
			await Promise.all([shift.save(), workDay.save(), user.save()])
		}

		console.log('Roster Created')
		return res.status(201).json({ message: 'Roster Created' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server error' })
	}
})

module.exports = router
