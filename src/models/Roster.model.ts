import mongoose, { Document, Schema, Model, Types } from 'mongoose'

interface Roster extends Document {
	month: number
	shifts: Types.ObjectId[]
	employee: Types.ObjectId
}

const rosterSchema: Schema<Roster> = new mongoose.Schema({
	month: { type: Number, required: true },
	shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }],
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
})

const Roster: Model<Roster> = mongoose.model<Roster>('Roster', rosterSchema)

export default Roster
