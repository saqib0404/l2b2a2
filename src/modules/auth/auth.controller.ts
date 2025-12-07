import { Request, Response } from "express";
import { authServices } from "./auth.services";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.createUser(req.body)
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err.message
        })
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const result = await authServices.loginUser(email, password)

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user
            }
        })
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: err.message,
            errors: err.message
        })
    }
}


export const authController = {
    createUser, loginUser
}