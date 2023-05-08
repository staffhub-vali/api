import express, { Request, Response } from 'express'
import Shift from '../models/Shift.model'
import Roster from '../models/Roster.model'
import Employee from '../models/Employee.model'
import Schedule from '../models/Schedule.model'
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

		let schedule = await Schedule.findOne({ month: month })
		if (!schedule) {
			schedule = await Schedule.create({ month: month })
			await schedule.save()
		}

		const roster = await Roster.create({ employee, month })

		for (const { date, start, end } of data) {
			let workingDay = await WorkingDay.findOne({ date: date })

			if (!workingDay) {
				workingDay = await WorkingDay.create({ date: date })
				await workingDay.save()
			}

			schedule.workingDays.push(workingDay._id)

			if (!start || !end) {
				continue
			}

			const shift = await Shift.create({
				start,
				end,
				employee,
				workingDay,
			})

			workingDay.shifts.push(shift._id)
			await Promise.all([shift.save(), workingDay.save()])
			roster.shifts.push(shift._id)
		}

		employee.rosters.push(roster._id)

		await Promise.all([roster.save(), employee.save(), schedule.save()])

		return res.status(201).json(roster)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server error' })
	}
})

module.exports = router
