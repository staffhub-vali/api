import mongoose from 'mongoose'
import config from 'config'

async function connect() {
	const MONGO_URL = process.env.MONGO_URL || (config.get('MONGO_URL') as string)

	try {
		await mongoose.connect(MONGO_URL)
		console.log('Connected to Database.')
	} catch (error) {
		console.log('Error connecting to Database.', error)
		process.exit(1)
	}
}

export default connect
