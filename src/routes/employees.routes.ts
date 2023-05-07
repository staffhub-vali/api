import express, { Request, Response } from 'express'
import Employee from '../models/Employee.model'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

router
	.route('/')
	// Get a list of employees
	.get(Authenticate, async (req: Request, res: Response) => {
		try {
			const employees = await Employee.find()

			return res.status(200).json(employees)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to retrieve employees.', error })
		}
	})
	// Create a new employee
	.post(Authenticate, async (req: Request, res: Response) => {
		try {
			const { name, email, phone } = req.body

			if (!name || !email || !phone) {
				return res.status(400).json({ message: 'Name, email, and phone are required.' })
			}

			const employee = new Employee({ name, email, phone })

			await employee.save()

			return res.status(201).json(employee)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to create employee.', error })
		}
	})

module.exports = router
