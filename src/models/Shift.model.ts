import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Shift extends Document {
	end?: number
	start?: number
	total?: number
	workDay?: Types.ObjectId
	employee?: Types.ObjectId
}

const shiftSchema: Schema<Shift> = new mongoose.Schema({
	end: { type: Number },
	start: { type: Number },
	total: { type: Number },
	workDay: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay' },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
})

const Shift: Model<Shift> = mongoose.model<Shift>('Shift', shiftSchema)

export default Shift
