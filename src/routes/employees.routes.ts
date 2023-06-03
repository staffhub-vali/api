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
			const user = await User.findById(req.token._id)

			if (!user) {
				return res.status(401).json({ message: 'Unauthorized' })
			}

			const { name, email, phone } = req.body

			if (!name || !email || !phone) {
				return res.status(400).json({ message: 'Name, email, and phone are required.' })
			}

			const employee = new Employee({ name, email, phone })

			user.employees.push(employee._id)

			await Promise.all([employee.save(), user.save()])

			return res.status(201).json({ message: 'Employee created successfully.' })
		} catch (error) {
			return res.status(500).json({ message: 'Failed to create employee.', error })
		}
	})

router
	.route('/:id')
	.get(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const user = await User.findById(req.token._id).populate('employees')

			if (!user) {
				return res.status(401).json({ message: 'Unauthorized' })
			}

			const employee = user.employees.find((employee) => employee._id.toString() === req.params.id)

			return res.status(200).json(employee)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to retrieve employee.', error })
		}
	})
	.put(Authenticate, async (req: Request, res: Response) => {
		const { id, name, email, phone, sickDays, vacationDays } = req.body
		try {
			const employee = await Employee.findById(id)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.name = name
			employee.email = email
			employee.phone = phone
			employee.sickDays = sickDays
			employee.vacationDays = vacationDays

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
				return res.status(401).json({ message: 'Unauthorized' })
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
