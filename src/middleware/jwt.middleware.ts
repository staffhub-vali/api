import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Response, Request } from 'express'

const TOKEN_SECRET = process.env.GOOGLE_CLIENT_SECRET as string

export const SECRET_KEY: string = TOKEN_SECRET

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '')

		if (!token) {
			throw new Error()
		}

		const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload
		req.token = { _id: decoded._id }

		next()
	} catch (err) {
		res.status(401).json('Unauthorized.')
	}
}
