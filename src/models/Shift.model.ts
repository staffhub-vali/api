import mongoose from 'mongoose'

const ShiftSchema = new mongoose.Schema({
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	location: { type: String, required: true },
	employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
	schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
})

const Shift = mongoose.model('Shift', ShiftSchema)

export default Shift
