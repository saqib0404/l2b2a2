import { Request, Response } from "express";
import { usersServices } from "./users.services";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.getAllUsers()
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err.message
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await usersServices.updateUser(Number(id), req.body)
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errors: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await usersServices.deleteUser(Number(id))

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errors: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err.message
        })
    }
}

export const usersController = {
    getAllUsers, updateUser, deleteUser
}