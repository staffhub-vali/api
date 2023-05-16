import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Shift extends Document {
	end?: number
	start?: number
	total?: number
	roster?: Types.ObjectId
	workDay?: Types.ObjectId
	employee?: Types.ObjectId
}

const shiftSchema: Schema<Shift> = new mongoose.Schema({
	end: { type: Number },
	start: { type: Number },
	total: { type: Number },
	roster: { type: mongoose.Schema.Types.ObjectId, ref: 'Roster' },
	workDay: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay' },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
})

const Shift: Model<Shift> = mongoose.model<Shift>('Shift', shiftSchema)

export default Shift
