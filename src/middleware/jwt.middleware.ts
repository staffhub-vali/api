import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const TOKEN_SECRET = process.env.TOKEN_SECRET as string

export const SECRET_KEY: Secret = TOKEN_SECRET

export interface CustomRequest extends Request {
	token: string | JwtPayload
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '')

		if (!token) {
			throw new Error()
		}

		const decoded = jwt.verify(token, SECRET_KEY)
		;(req as CustomRequest).token = decoded

		next()
	} catch (err) {
		res.status(401).json('Unauthorized.')
	}
}
