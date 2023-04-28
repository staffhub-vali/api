const router = require('express').Router()
const Report = require('../models/Report.model')
import { Request, Response } from 'express'

router.post('/report', async (req: Request, res: Response) => {
	try {
		const { id, content } = req.body

		await Report.create({ id, content })

		res.status(200).json({ message: 'Report submitted. Thank you for making this website a better place.' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong. Please try again later.' })
	}
})

router.post('/contact', async (req: Request, res: Response) => {
	const { id, content, subject } = req.body
	console.log(req.body)
	try {
		await Report.create({ id, content, subject })

		res.status(200).json({ message: 'Form submitted.' })
	} catch (err) {
		res.status(500).json({ message: 'Something went wrong. Please try again later.' })
	}
})

module.exports = router
