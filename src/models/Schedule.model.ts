import mongoose from 'mongoose'

interface ScheduleDocument extends mongoose.Document {
	month: Date
	shifts: string[]
}

const ScheduleSchema = new mongoose.Schema({
	month: { type: Date, required: true, unique: true },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
})

const Schedule = mongoose.model<ScheduleDocument>('Schedule', ScheduleSchema)

export default Schedule
