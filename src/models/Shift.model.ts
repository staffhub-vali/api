import mongoose from 'mongoose'

const shiftSchema = new mongoose.Schema({
	end: { type: String },
	start: { type: String },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
	workingDay: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkingDay' },
})

const Shift = mongoose.model('Shift', shiftSchema)

export default Shift
