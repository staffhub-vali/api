import Shift from '../models/Shift.model'
import Roster from '../models/Roster.model'
import WorkDay from '../models/WorkDay.model'
import Employee from '../models/Employee.model'
import Schedule from '../models/Schedule.model'
import express, { Request, Response } from 'express'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

router
	.route('/')
	.post(Authenticate, async (req: Request, res: Response) => {
		try {
			const { id, data } = req.body

			const employee = await Employee.findById(id)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found' })
			}

			const month = data[0].date.slice(3)

			const existingRoster = await Roster.findOne({ employee: employee._id, month: month })
			if (existingRoster) {
				return res.status(400).json({ message: 'Employee already has a roster for the month' })
			}

			let schedule = await Schedule.findOne({ month: month })
			if (!schedule) {
				schedule = await Schedule.create({ month: month })
				await schedule.save()
			}

			const roster = await Roster.create({ employee, month })

			for (const { date, start, end } of data) {
				let workDay = await WorkDay.findOne({ date: date })

				if (!workDay) {
					workDay = await WorkDay.create({ date: date })
					await workDay.save()
				}

				schedule.workDays.push(workDay._id)

				if (!start || !end) {
					continue
				}

				const shift = await Shift.create({
					start,
					end,
					employee,
					workDay,
					roster,
				})

				workDay.shifts.push(shift._id)
				await Promise.all([shift.save(), workDay.save()])
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
	.put(Authenticate, async (req: Request, res: Response) => {
		try {
			const { id, data } = req.body

			const employee = await Employee.findById(id)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found' })
			}

			const month = data[0].date.slice(3)

			const existingRoster = await Roster.findOne({ employee: employee._id, month: month }).populate({
				path: 'shifts',
				populate: {
					path: 'workDay',
				},
			})

			if (!existingRoster) {
				return res.status(400).json({ message: 'Employee does not have a roster for the month' })
			}

			// Extract the shift IDs from the existingRoster
			const shiftIds = existingRoster.shifts.map((shift) => shift._id)

			// Remove the shifts from the roster
			existingRoster.shifts = []
			await existingRoster.save()

			// Remove the shifts from the workDays
			await WorkDay.updateMany({ shifts: { $in: shiftIds } }, { $pull: { shifts: { $in: shiftIds } } })

			// Delete the shifts
			await Shift.deleteMany({ _id: { $in: shiftIds }, roster: existingRoster._id })

			res.status(200).json({ message: 'Shifts deleted successfully' })
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
			console.log(error)
		}
	})

router.get('/:id', Authenticate, async (req: Request, res: Response) => {
	try {
		const roster = await Roster.findById(req.params.id).populate({
			path: 'shifts',
			populate: {
				path: 'workDay',
			},
		})
		if (!roster) {
			return res.status(404).json({ message: 'Roster not found' })
		}
		return res.status(200).json(roster)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server error' })
	}
})

module.exports = router
