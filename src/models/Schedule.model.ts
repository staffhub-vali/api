import mongoose from 'mongoose'

const ScheduleSchema = new mongoose.Schema({
	month: { type: Date, required: true, unique: true },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
})

const Schedule = mongoose.model('Schedule', ScheduleSchema)

export default Schedule
