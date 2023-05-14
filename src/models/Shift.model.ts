import mongoose from 'mongoose'

const shiftSchema = new mongoose.Schema({
	end: { type: Date },
	start: { type: Date },
	roster: { type: mongoose.Schema.Types.ObjectId, ref: 'Roster' },
	workDay: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay' },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
})

const Shift = mongoose.model('Shift', shiftSchema)

export default Shift
