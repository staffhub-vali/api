import { Request, Response } from 'express'

type Error = {
	status: number
}

module.exports = (app: any) => {
	app.use((req: Request, res: Response) => {
		// this middleware runs whenever requested page is not available
		res.status(404).json({ message: 'This route does not exist' })
	})

	app.use((err: Error, req: Request, res: Response) => {
		// whenever you call next(err), this middleware will handle the error
		// always logs the error
		console.error('ERROR', req.method, req.path, err)
		if (err.status === 401) {
			res.status(401).json({ message: 'Token Expired' })
		}

		// only render if the error occurred before sending the response
		if (!res.headersSent) {
			res.status(500).json({
				message: 'Internal server error. Check the server console',
			})
		}
	})
}
