import mongoose from 'mongoose'

interface ShiftDocument extends mongoose.Document {
	start: Date
	end: Date
	employees: string[]
	schedule: string
}

const ShiftSchema = new mongoose.Schema({
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	location: { type: String, required: true },
	employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
	schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
})

const Shift = mongoose.model<ShiftDocument>('Shift', ShiftSchema)

export default Shift
