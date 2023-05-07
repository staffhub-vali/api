import mongoose from 'mongoose'

const ShiftSchema = new mongoose.Schema({
	end: { type: Date, required: true },
	start: { type: Date, required: true },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
	workingDay: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkingDay' },
})

const Shift = mongoose.model('Shift', ShiftSchema)

export default Shift
