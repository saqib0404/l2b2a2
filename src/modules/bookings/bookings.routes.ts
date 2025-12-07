import { Router } from "express";
import { auth } from "../middleware/auth";
import { bookingsController } from "./bookings.controller";

const router = Router();

router.post("/bookings", auth.verifyJWT(), bookingsController.createBooking)

router.get("/bookings", auth.verifyJWT(), bookingsController.getAllBookings)

router.get("/bookings/:bookingId", auth.verifyJWT(), bookingsController.updateBookingStatus)

export const bookingRoutes = router