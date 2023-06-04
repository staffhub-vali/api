import User from '../models/User.model'
import Shift from '../models/Shift.model'
import express, { Response } from 'express'
import { Authenticate } from '../middleware/jwt.middleware'
import { CustomRequest } from '../middleware/jwt.middleware'
import { ObjectId } from 'mongoose'

const router = express.Router()

interface ShiftProps {
	_id: string
	end: number
	start: number
	employee: ObjectId
}

interface workDayProps {
	_id?: string
	date: number
	save: any
	shifts: ShiftProps[] | unknown[]
}

router.get('/', Authenticate, async (req: CustomRequest | any, res: Response) => {
	try {
		const user = await User.findOne({ _id: req.token._id }).populate({
			path: 'workDays',
		})

		if (!user) {
			return res.status(404).json({ message: 'User not found.' })
		}

		res.status(200).json(user.workDays)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server Error' })
	}
})

router
	.route('/:id')
	.get(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const user = await User.findById(req.token._id).populate({
				path: 'workDays',
				populate: {
					path: 'shifts',
					populate: {
						path: 'employee',
					},
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const workDay = user.workDays.find((workDay) => workDay._id.toString() === req.params.id)

			if (!workDay) {
				return res.status(404).json({ message: 'Work day not found.' })
			}

			res.status(200).json(workDay)
		} catch (error: any) {
			console.log(error)
			res.status(500).json({ message: error.message })
		}
	})
	.put(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { _id: workDayId, shifts } = req.body

			const user = await User.findById(req.token._id).populate({
				path: 'workDays',
				populate: {
					path: 'shifts',
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const workDay: workDayProps | undefined = user.workDays.find((workDay) => workDay._id.toString() === workDayId)

			if (!workDay) {
				return res.status(404).json({ message: 'Work day not found.' })
			}

			await Shift.deleteMany({ _id: { $in: workDay.shifts } })

			const newShifts = await Shift.insertMany(shifts)

			workDay.shifts = newShifts.map((shift) => shift._id)

			await workDay.save()

			res.status(200).json({ message: 'Shift updated successfully.' })
		} catch (error: any) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	})
	.delete(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { shiftId, workDayId } = req.query

			const user = await User.findById(req.token._id).populate({
				path: 'workDays',
				populate: {
					path: 'shifts',
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const workDay: workDayProps | undefined = user.workDays.find((workDay) => workDay._id.toString() === workDayId)

			if (!workDay) {
				return res.status(404).json({ message: 'Work day not found.' })
			}

			await Shift.findByIdAndDelete(shiftId)

			const shiftIndex = workDay.shifts.findIndex((shift: any) => shift._id.toString() === shiftId)

			if (shiftIndex !== -1) {
				workDay.shifts.splice(shiftIndex, 1)
				await workDay.save()
			}

			res.status(200).json({ message: 'Shift deleted successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	})

module.exports = router
