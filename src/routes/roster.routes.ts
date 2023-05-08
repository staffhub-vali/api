import express, { Request, Response } from 'express'
import Shift from '../models/Shift.model'
import Roster from '../models/Roster.model'
import Employee from '../models/Employee.model'
import WorkingDay from '../models/WorkingDay.model'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

router.post('/', Authenticate, async (req: Request, res: Response) => {
	try {
		const { id, data } = req.body

		const employee = await Employee.findById(id)

		if (!employee) {
			return res.status(404).json({ message: 'Employee not found' })
		}

		const month = data[0].date.slice(3)

		const roster = await Roster.create({ employee, month })

		for (const { date, start, end } of data) {
			if (!start || !end) {
				continue
			}

			const workingDay = await WorkingDay.create({ date })
			const shift = await Shift.create({
				start,
				end,
				employee,
				workingDay,
			})
			workingDay.shifts.push(shift._id)
			await Promise.all([shift.save(), workingDay.save()])
			roster.workingDays.push(workingDay._id)
		}

		await roster.save()

		return res.status(201).json(roster)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server error' })
	}
})

module.exports = router
