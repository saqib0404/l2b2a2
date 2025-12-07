import { pool } from "../config/db"

export const autoReturnBookings = async () => {
    try {
        const expiredBookings = await pool.query(
            `
      SELECT id, vehicle_id
      FROM bookings
      WHERE status = 'active'
      AND rent_end_date < CURRENT_DATE
      `
        )

        if ((expiredBookings.rowCount ?? 0) === 0) {
            return
        }

        // ✅ 2. Mark each booking as returned & free vehicle
        for (const booking of expiredBookings.rows) {
            await pool.query(
                `
        UPDATE bookings
        SET status = 'returned'
        WHERE id = $1
        `,
                [booking.id]
            )

            await pool.query(
                `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id = $1
        `,
                [booking.vehicle_id]
            )
        }

    } catch (err) {
        console.error(err)
    }
}
