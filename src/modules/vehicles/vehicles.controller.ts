import { Request, Response } from "express"
import { vehicleServices } from "./vehicles.services"

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllvehicles()
        if (result.rowCount === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            })
        }
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body)
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSpecificVehicle = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
        const result = await vehicleServices.getSpecificVehicle(id as string)
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No such Vehicle found"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows[0]
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err.message
        })
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params
        const result = await vehicleServices.updateVehicle(Number(vehicleId), req.body)

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "Vehicle not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
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

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params
        const result = await vehicleServices.deleteVehicle(Number(vehicleId))

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
                errors: "Vehicle not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        })
    } catch (err: any) {
        if (err.message === "Vehicle has active bookings and cannot be deleted") {
            return res.status(409).json({
                success: false,
                message: err.message,
                errors: err.message
            })
        }

        res.status(500).json({
            success: false,
            message: err.message,
            errors: err.message
        })
    }
}

export const vehiclesController = {
    getAllVehicles, createVehicle, getSpecificVehicle, updateVehicle, deleteVehicle
}