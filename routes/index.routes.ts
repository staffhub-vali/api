const router = require('express').Router()
import { Request, Response } from 'express'

router.get('/', (req: Request, res: Response) => {
	res.json('All good in here')
})

module.exports = router
