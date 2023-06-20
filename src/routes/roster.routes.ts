import User from '../models/User.model'
import Shift from '../models/Shift.model'
import express, { Response } from 'express'
import WorkDay from '../models/WorkDay.model'
import Employee from '../models/Employee.model'
import { Authenticate, CustomRequest } from '../middleware/jwt.middleware'

const router = express.Router()

router.route('/').post(Authenticate, async (req: CustomRequest | any, res: Response) => {
	try {
		const { id, data } = req.body

		if (data.length < 1) {
			return res.status(404).json({ message: 'Please select a month.' })
		}

		if (!id) {
			return res.status(400).json({ message: 'Please select an employee.' })
		}

		const hasShifts = data.some((shift: { start: number; end: number }) => shift.start && shift.end)

		if (!hasShifts) {
			return res.status(400).json({ message: 'Please make at least one shift.' })
		}

		const user = await User.findOne({ _id: req.token._id })

		if (!user) {
			return res.status(404).json({ message: 'User not found.' })
		}

		const employee = await Employee.findById(id)

		if (!employee) {
			return res.status(404).json({ message: 'Employee not found' })
		}

		for (const { date, start, end } of data) {
			const modifiedDate = new Date(date * 1000)

			modifiedDate.setHours(0, 0, 0, 0)

			const midnightUnixCode = Math.floor(modifiedDate.getTime() / 1000)

			let workDay = await WorkDay.findOne({ date: midnightUnixCode, user: req.token._id })

			if (!workDay) {
				workDay = await WorkDay.create({ date: midnightUnixCode, user: req.token._id })
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

			shift.end = end
			shift.start = start

			if (!workDay.shifts.some((shiftId) => shiftId.equals(shift?._id))) {
				workDay.shifts.push(shift._id)
			}

			await Promise.all([shift.save(), workDay.save(), user.save()])
		}

		return res.status(201).json({ message: 'Roster Created' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error creating the roster' })
	}
})

module.exports = router
