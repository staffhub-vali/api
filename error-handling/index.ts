import { Request, Response, Application } from 'express'

interface Error {
	status: number
}

module.exports = (app: Application) => {
	app.use((req: Request, res: Response) => {
		res.status(404).json({ message: 'This route does not exist.' })
	})

	app.use((err: Error, req: Request, res: Response) => {
		console.error('ERROR', req.method, req.path, err)
		if (err.status === 401) {
			res.status(401).json({ message: 'Token Expired' })
		}

		if (!res.headersSent) {
			res.status(500).json({
				message: 'Internal server error. Check the server console',
			})
		}
	})
}
