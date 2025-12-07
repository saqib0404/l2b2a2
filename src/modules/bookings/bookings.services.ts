import { pool } from "../../config/db"

const createBooking = async (payload: Record<string, unknown>) => {
    const {
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date
    } = payload

    const vehicleResult = await pool.query(
        `
    SELECT vehicle_name, daily_rent_price, availability_status
    FROM vehicles
    WHERE id = $1
    `,
        [vehicle_id]
    )

    if ((vehicleResult.rowCount ?? 0) === 0) {
        throw new Error("Vehicle not found")
    }

    const vehicle = vehicleResult.rows[0]

    if (vehicle.availability_status !== "available") {
        throw new Error("Vehicle is not available for booking")
    }

    const startDate = new Date(rent_start_date as string)
    const endDate = new Date(rent_end_date as string)

    const diffTime = endDate.getTime() - startDate.getTime()
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (numberOfDays <= 0) {
        throw new Error("Invalid rental date range")
    }

    const totalPrice = vehicle.daily_rent_price * numberOfDays

    const bookingResult = await pool.query(
        `
    INSERT INTO bookings (
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    )
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING 
      id,
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    `,
        [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            totalPrice
        ]
    )

    await pool.query(
        `
    UPDATE vehicles
    SET availability_status = 'booked'
    WHERE id = $1
    `,
        [vehicle_id]
    )

    return {
        ...bookingResult.rows[0],
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    }
}

const getAllBookingsForAdmin = async () => {
    const result = await pool.query(`
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'name', u.name,
        'email', u.email
      ) AS customer,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number
      ) AS vehicle
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id DESC
  `)

    return result
}

const getBookingsForCustomer = async (customerId: number) => {
    const result = await pool.query(
        `
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
      ) AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
    `,
        [customerId]
    )

    return result
}

const updateBookingStatus = async (
    bookingId: number,
    newStatus: "cancelled" | "returned",
    userRole: string,
    userId: number
) => {
    const bookingResult = await pool.query(
        `
    SELECT *
    FROM bookings
    WHERE id = $1
    `,
        [bookingId]
    )

    if ((bookingResult.rowCount ?? 0) === 0) {
        throw new Error("Booking not found")
    }

    const booking = bookingResult.rows[0]

    if (newStatus === "cancelled") {
        if (userRole !== "customer") {
            throw new Error("Only customers can cancel bookings")
        }

        const today = new Date()
        const startDate = new Date(booking.rent_start_date)

        if (today >= startDate) {
            throw new Error("Booking cannot be cancelled after start date")
        }

        if (booking.customer_id !== userId) {
            throw new Error("You can only cancel your own booking")
        }
    }

    if (newStatus === "returned") {
        if (userRole !== "admin") {
            throw new Error("Only admin can mark booking as returned")
        }
    }

    const updatedBookingResult = await pool.query(
        `
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING
      id,
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    `,
        [newStatus, bookingId]
    )

    const updatedBooking = updatedBookingResult.rows[0]

    const vehicleUpdateResult = await pool.query(
        `
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id = $1
    RETURNING availability_status
    `,
        [updatedBooking.vehicle_id]
    )

    return {
        booking: updatedBooking,
        vehicle: vehicleUpdateResult.rows[0]
    }
}

export const bookingsServices = {
    createBooking, getAllBookingsForAdmin, getBookingsForCustomer, updateBookingStatus
}
