import User from '../models/User.model'
import Shift from '../models/Shift.model'
import WorkDay from '../models/WorkDay.model'
import Employee from '../models/Employee.model'
import express, { Response } from 'express'
import { Authenticate, CustomRequest } from '../middleware/jwt.middleware'
import { startsWith } from 'lodash'

const router = express.Router()

router.route('/').post(Authenticate, async (req: CustomRequest | any, res: Response) => {
	try {
		const { id, data } = req.body

		if (!id) {
			return res.status(400).json({ message: 'Please select an employee.' })
		}

		if (!data.some((obj: any) => obj.start && obj.end)) {
			return res.status(400).json({ message: 'Please fill out at least 1 shift.' })
		}

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

			if (!user.workDays.some((workDayId) => workDayId.equals(workDay?._id))) {
				user.workDays.push(workDay._id)
				await user.save()
			}

			if (!start || !end) {
				continue
			}

			let shift = await Shift.findOne({ employee, workDay })

			if (!shift) {
				shift = await Shift.create({ employee, workDay, start, end })
			}

			shift.start = start
			shift.end = end

			workDay.shifts.push(shift._id)

			await Promise.all([shift.save(), workDay.save(), user.save()])
		}

		return res.status(201).json({ message: 'Roster Created' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error creating the roster' })
	}
})

module.exports = router
