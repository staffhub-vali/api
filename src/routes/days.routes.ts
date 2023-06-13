import User from '../models/User.model'
import WorkDay from '../models/WorkDay.model'
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
		let { skip } = req.query
		skip = parseInt(skip) || 0

		let nextSkip = 0

		if (skip > 0) {
			nextSkip = skip + 1
		}

		if (skip < 0) {
			nextSkip = skip - 1
		}

		const currentDate = Math.floor(Date.now() / 1000)

		const today = new Date()
		const currentDayOfWeek = today.getDay()

		const startOfWeek = currentDate - currentDayOfWeek * 24 * 60 * 60 + skip * 7 * 24 * 60 * 60
		const endOfWeek = startOfWeek + 7 * 24 * 60 * 60

		const user = await User.findOne({ _id: req.token._id })

		if (!user) {
			return res.status(404).json({ message: 'User not found.' })
		}

		const workDays = await WorkDay.find({
			date: { $gte: startOfWeek, $lte: endOfWeek },
		}).populate({
			path: 'shifts',
			populate: {
				path: 'employee',
			},
		})

		if (!workDays) {
			return res.status(404).json({ message: 'Work days not found.' })
		}

		const startOfNextWeek = currentDate - currentDayOfWeek * 24 * 60 * 60 + nextSkip * 7 * 24 * 60 * 60
		const endOfNextWeek = startOfNextWeek + 7 * 24 * 60 * 60

		const workDaysNextWeek = await WorkDay.find({
			date: { $gte: startOfNextWeek, $lte: endOfNextWeek },
		})

		res.status(200).json({ workDays, length: workDaysNextWeek.length })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server Error' })
	}
})

router
	.route('/notes')
	.post(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { day, note } = req.body

			if (!note) {
				return res.status(400).json({ message: 'Cannot create empty notes.' })
			}

			const user = await User.findOne({ _id: req.token._id }).populate({
				path: 'workDays',
				populate: {
					path: 'notes',
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const workDay = user.workDays.find((d) => d._id.toString() === day)

			if (!workDay) {
				return res.status(404).json({ message: 'Work day not found.' })
			}

			workDay.notes.push(note)

			await workDay.save()

			res.status(200).json({ message: 'Note saved successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Interal Server Error' })
		}
	})
	.put(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { note, index, workDayId } = req.body

			const user = await User.findById(req.token._id).populate({
				path: 'workDays',
				populate: {
					path: 'notes',
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const workDay = user.workDays.find((d) => d._id.toString() === workDayId)

			if (!workDay) {
				return res.status(404).json({ message: 'Work day not found.' })
			}

			workDay.notes[index] = note

			await workDay.save()

			res.status(200).json({ message: 'Note updated successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Internal Server Error' })
		}
	})
	.delete(Authenticate, async (req: CustomRequest | any, res: Response) => {
		try {
			const { workDay: id, index } = req.query

			const user = await User.findById(req.token._id).populate({
				path: 'workDays',
				populate: {
					path: 'notes',
				},
			})

			if (!user) {
				return res.status(404).json({ message: 'User not found.' })
			}

			const workDay = user.workDays.find((d) => d._id.toString() === id)

			if (!workDay) {
				return res.status(404).json({ message: 'Work day not found.' })
			}

			workDay.notes.splice(index, 1)

			await workDay.save()

			res.status(200).json({ message: 'Note deleted successfully.' })
		} catch (error) {
			console.log(error)
			res.status(500).json({ message: 'Interal Server Error' })
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
			res.status(500).json({ message: 'Interal Server Error' })
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
