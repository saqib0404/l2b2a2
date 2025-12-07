import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config/config";

const verifyJWT = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    errors: "Token missing or invalid"
                })
            }

            const token = authHeader.split(" ")[1]

            const decoded = jwt.verify(
                token as string,
                config.jwt_secret as string
            ) as JwtPayload
            // console.log(decoded)
            req.user = decoded
            next()
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                errors: "Invalid or expired token"
            })
        }
    }
}

const verifyAdmin = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                    errors: "Admin access only"
                })
            }

            next()
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Authorization failed",
                errors: "Authorization failed"
            })
        }
    }
}

export const auth = {
    verifyJWT, verifyAdmin
}