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

			const date = new Date(data[0].date)
			const month = date.getMonth()

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
				const dateObj = new Date(date)

				let workDay = await WorkDay.findOne({ date: dateObj })

				if (!workDay) {
					workDay = await WorkDay.create({ date: dateObj })
					await workDay.save()
				}

				if (!schedule.workDays.includes(workDay._id)) {
					schedule.workDays.push(workDay._id)
				}

				if (!start || !end) {
					continue
				}

				const startTime = new Date(`1970-01-01T${start}:00Z`) // Convert the time to a Date object
				const endTime = new Date(`1970-01-01T${end}:00Z`) // Convert the time to a Date object

				const shift = await Shift.create({
					start: startTime,
					end: endTime,
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

			const roster = await Roster.findOne({ employee: employee._id, month: month }).populate({
				path: 'shifts',
				populate: {
					path: 'workDay',
				},
			})

			if (!roster) {
				return res.status(400).json({ message: 'Employee does not have a roster for the month' })
			}

			const shiftIds = roster.shifts.map((shift) => shift._id)

			roster.shifts = []
			await roster.save()

			await WorkDay.updateMany({ shifts: { $in: shiftIds } }, { $pull: { shifts: { $in: shiftIds } } })

			await Shift.deleteMany({ _id: { $in: shiftIds }, roster: roster._id })

			for (const { date, start, end } of data) {
				let workDay = await WorkDay.findOne({ date: date })

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

				workDay?.shifts.push(shift._id)
				await Promise.all([shift.save(), workDay?.save()])
				roster.shifts.push(shift._id)
			}

			await Promise.all([roster.save(), employee.save()])

			return res.status(201).json(roster)
		} catch (error) {
			res.status(500).json({ message: 'Server error' })
			console.log(error)
		}
	})
	.delete(Authenticate, async (req: Request, res: Response) => {
		const rosterId = req.query.id

		const roster = await Roster.findById(rosterId).populate({
			path: 'shifts',
			populate: {
				path: 'workDay',
			},
		})

		if (!roster) {
			return res.status(404).json({ message: 'Roster not found' })
		}

		const employee = await Employee.findById(roster.employee._id)

		if (!employee) {
			return res.status(404).json({ message: 'Employee not found' })
		}

		employee.rosters = employee.rosters.filter((roster) => roster.toString() !== rosterId)
		await employee.save()

		const shiftIds = roster.shifts.map((shift) => shift._id)

		await WorkDay.updateMany({ shifts: { $in: shiftIds } }, { $pull: { shifts: { $in: shiftIds } } })

		await Shift.deleteMany({ _id: { $in: shiftIds }, roster: roster._id })

		await Roster.findByIdAndDelete(rosterId)

		res.status(200).json({ message: 'Roster deleted successfully' })
	})

router.get('/:id', Authenticate, async (req: Request, res: Response) => {
	try {
		const roster = await Roster.findById(req.params.id)
			.populate({
				path: 'shifts',
				populate: {
					path: 'workDay',
				},
			})
			.populate('employee')

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
