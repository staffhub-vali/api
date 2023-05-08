import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema({
	month: { type: String, required: true },
	workingDays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkingDay' }],
})

const Schedule = mongoose.model('Schedule', scheduleSchema)

export default Schedule
