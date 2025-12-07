import { Request, Response } from "express"
import { bookingsServices } from "./bookings.services"

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.createBooking(req.body)

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err.message
        })
    }
}

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const user = req.user

        if (user?.role === "admin") {
            const result = await bookingsServices.getAllBookingsForAdmin()

            return res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: result.rows
            })
        }

        const result = await bookingsServices.getBookingsForCustomer(user?.id)

        return res.status(200).json({
            success: true,
            message: "Your bookings retrieved successfully",
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

const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params
        const { status } = req.body
        const user = req.user

        if (status !== "cancelled" && status !== "returned") {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
                errors: "Invalid status value"
            })
        }

        const result = await bookingsServices.updateBookingStatus(
            Number(bookingId),
            status,
            user?.role,
            user?.id
        )

        if (status === "cancelled") {
            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result.booking
            })
        }

        if (status === "returned") {
            return res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: {
                    ...result.booking,
                    vehicle: {
                        availability_status: result.vehicle.availability_status
                    }
                }
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

export const bookingsController = {
    createBooking, getAllBookings, updateBookingStatus
}
