import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface WorkDay extends Document {
	date: number
	shifts: Types.ObjectId[]
	notes: string[]
}

const workDaySchema: Schema<WorkDay> = new mongoose.Schema({
	date: { type: Number, required: true, unique: true },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
	notes: [{ type: String }],
})

const WorkDay: Model<WorkDay> = mongoose.model<WorkDay>('WorkDay', workDaySchema)

export default WorkDay
