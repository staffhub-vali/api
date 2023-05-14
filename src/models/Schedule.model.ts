import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema({
	month: { type: Date, required: true },
	workDays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay', unique: true }],
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

export default Schedule
