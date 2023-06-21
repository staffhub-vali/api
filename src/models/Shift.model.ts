import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Shift extends Document {
	start?: number
	end?: number
	user: Types.ObjectId
	workDay?: Types.ObjectId
	employee?: Types.ObjectId
}

const shiftSchema: Schema<Shift> = new mongoose.Schema({
	start: { type: Number },
	end: { type: Number },
	workDay: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay' },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const Shift: Model<Shift> = mongoose.model<Shift>('Shift', shiftSchema)

export default Shift
