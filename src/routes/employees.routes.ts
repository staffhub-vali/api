import User from '../models/User.model'
import express, { Request, Response } from 'express'
import Employee from '../models/Employee.model'
import { Authenticate } from '../middleware/jwt.middleware'
import { CustomRequest } from '../middleware/jwt.middleware'

const router = express.Router()

router
	.route('/')
	.get(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const user = await User.findById(req.token._id).populate({
				path: 'employees',
				options: { sort: { name: 1 } },
			})

			if (!user) {
				return res.status(401).json({ message: 'Unauthorized' })
			}

			return res.status(200).json(user.employees)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to retrieve employees.', error })
		}
	})
	.post(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { name, email, phone, address } = req.body

			const user = await User.findById(req.token._id)

			if (!user) {
				return res.status(401).json({ message: 'User not found.' })
			}

			if (!name || !email || !phone || !address) {
				return res.status(400).json({ message: 'Name, email, phone and address are required.' })
			}

			const employee = new Employee({ name, email, phone, address })

			user.employees.push(employee._id)

			await Promise.all([employee.save(), user.save()])

			return res.status(201).json({ message: 'Employee created successfully.' })
		} catch (error) {
			return res.status(500).json({ message: 'Failed to create employee.', error })
		}
	})

router
	.route('/notes')
	.post(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { note, employeeId } = req.body

			if (note === '') {
				return res.status(400).json({ message: 'Note can not be empty.' })
			}

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
				populate: {
					path: 'notes',
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId.toString())

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.notes.push(note)

			await employee.save()

			res.status(200).json({ message: 'Note added successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error.' })
		}
	})
	.put(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { employeeId, index, note } = req.body

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.notes[index] = note

			await employee.save()

			return res.status(200).json({ message: 'Note updated successfully.' })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error.' })
		}
	})
	.delete(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { employeeId, index } = req.query

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.notes.splice(index, 1)

			await employee.save()

			return res.status(200).json({ message: 'Note deleted successfully.' })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error.' })
		}
	})

router
	.route('/preferences')
	.post(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { shiftPreference, employeeId } = req.body

			if (shiftPreference === '') {
				return res.status(400).json({ message: 'Shift preference can not be empty.' })
			}

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
				populate: {
					path: 'shiftPreferences',
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId.toString())

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.shiftPreferences.push(shiftPreference)

			await employee.save()

			res.status(200).json({ message: 'Shift preference added successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error.' })
		}
	})
	.put(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { employeeId, index, shiftPreference } = req.body

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.shiftPreferences[index] = shiftPreference

			await employee.save()

			return res.status(200).json({ message: 'Shift preference updated successfully.' })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error.' })
		}
	})
	.delete(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { employeeId, index } = req.query

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.shiftPreferences.splice(index, 1)

			await employee.save()

			return res.status(200).json({ message: 'Shift preference deleted successfully.' })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error.' })
		}
	})

router
	.route('/vacation')
	.post(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { employeeId, start, end, daysRemaining, daysPlanned } = req.body

			if (daysPlanned < 1) {
				return res.status(400).json({ message: 'Days planned cannot be negative.' })
			}

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId.toString())

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.vacations.push({ start, end })

			employee.vacationDays = daysRemaining

			await employee.save()

			res.status(200).json({ message: 'Vacation added successfully.' })
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error.' })
		}
	})
	.put(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { employeeId, amount } = req.body

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId.toString())

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.vacationDays = amount

			await employee.save()

			return res.status(200).json({ message: 'Vacation amount updated successfully.' })
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Server Error.' })
		}
	})
	.delete(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { employeeId, index } = req.query

			const user = await User.findById(req.token._id).populate({
				path: 'employees',
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === employeeId)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			const vacation = employee.vacations[index]

			const millisecondsPerDay = 24 * 60 * 60 * 1000
			const totalDays = Math.ceil((vacation.end - vacation.start) / millisecondsPerDay) + 1

			employee.vacations.splice(index, 1)

			employee.vacationDays += totalDays

			await employee.save()

			res.status(200).json({ message: 'Vacation deleted successfully.', totalDays: totalDays })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Failed to delete vacation.' })
		}
	})

router
	.route('/:id')
	.get(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const user = await User.findById(req.token._id).populate('employees')

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === req.params.id)

			return res.status(200).json(employee)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to retrieve employee.', error })
		}
	})
	.put(Authenticate, async (req: Request, res: Response) => {
		const { id, name, email, phone } = req.body
		try {
			const employee = await Employee.findById(id)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.name = name
			employee.email = email
			employee.phone = phone

			await employee.save()

			res.status(200).json({ message: 'Employee updated successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Failed to retrieve employee.' })
		}
	})
	.delete(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { id } = req.query

			const user = await User.findById(req.token._id)

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			await Employee.findByIdAndDelete(id)

			user.employees = user.employees.filter((employeeId) => employeeId.toString() !== id.toString())

			await user.save()

			res.status(200).json({ message: 'Employee deleted successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Failed to delete employee.' })
		}
	})

module.exports = router
