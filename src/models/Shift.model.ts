import mongoose from 'mongoose'

const shiftSchema = new mongoose.Schema({
	end: { type: String },
	start: { type: String },
	roster: { type: mongoose.Schema.Types.ObjectId, ref: 'Roster' },
	workDay: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay' },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
})

shiftSchema.pre('deleteMany', { document: true, query: false }, async function (next) {
	const shift: { roster: string; workDay: string; _id: string } = this
	try {
		await mongoose.model('Roster').updateOne({ _id: shift.roster }, { $pull: { shifts: shift._id } })
		await mongoose.model('WorkDay').updateOne({ _id: shift.workDay }, { $pull: { shifts: shift._id } })
		next()
	} catch (error: any) {
		next(error)
	}
})

const Shift = mongoose.model('Shift', shiftSchema)

export default Shift
