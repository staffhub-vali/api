import { Response, NextFunction } from 'express'

type RequestWithPayload = {
	payload?: {
		userId: string
		role: string
	}
}

export function isAdmin(req: RequestWithPayload, res: Response, next: NextFunction) {
	if (!req.payload || !req.payload.userId) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	if (req.payload.role !== 'admin') {
		return res.status(403).json({ message: 'Forbidden' })
	}

	next()
}
