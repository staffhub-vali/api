import express, { Request, Response } from 'express'
import Employee from '../models/Employee.model'
import { Authenticate } from '../middleware/jwt.middleware'

const router = express.Router()

router
	.route('/')
	.get(Authenticate, async (req: Request, res: Response) => {
		try {
			const employees = await Employee.find().sort({ name: 'asc' })

			return res.status(200).json(employees)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to retrieve employees.', error })
		}
	})
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

router
	.route('/:id')
	.get(Authenticate, async (req: Request, res: Response) => {
		try {
			const employee = await Employee.findById(req.params.id).populate('rosters')

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			return res.status(200).json(employee)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to retrieve employee.', error })
		}
	})
	.post(Authenticate, async (req: Request, res: Response) => {
		try {
			const { name, email, phone } = req.body
			if (!name || !email || !phone) {
				return res.status(400).json({ message: 'Name, email, and phone are required.' })
			}

			const employee = await Employee.findById(req.params.id)

			if (!employee) {
				return res.status(404).json({ message: 'Employee not found.' })
			}

			employee.name = name
			employee.email = email
			employee.phone = phone

			await employee.save()

			return res.status(200).json(employee)
		} catch (error) {
			return res.status(500).json({ message: 'Failed to update employee.', error })
		}
	})
	.put(Authenticate, async (req: Request, res: Response) => {})
	.delete(Authenticate, async (req: Request, res: Response) => {})

module.exports = router
