import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Schedule extends Document {
	month: number
	workDays: Types.ObjectId[]
}

const scheduleSchema: Schema<Schedule> = new mongoose.Schema({
	month: { type: Number, required: true },
	workDays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay', unique: true }],
})

const Schedule: Model<Schedule> = mongoose.model<Schedule>('Schedule', scheduleSchema)

export default Schedule
