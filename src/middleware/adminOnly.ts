import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth'


export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user
    if (user && Array.isArray(user.role) && user.role.includes('ADMIN')) {
        next()
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." })
    }
}