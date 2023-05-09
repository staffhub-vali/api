import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema({
	month: { type: String, required: true },
	workDays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkDay' }],
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

export default Schedule
