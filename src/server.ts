import express, { Request, Response } from 'express';
import cron from "node-cron"
import initDb from './config/db';
import { usersRoutes } from './modules/users/users.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { vehiclesRoutes } from './modules/vehicles/vehicles.routes';
import { bookingRoutes } from './modules/bookings/bookings.routes';
import { autoReturnBookings } from './jobs/autoReturningbookings';
const app = express()
const port = 3000;

// parsing req.body
app.use(express.json());

// initializing Database
initDb();

// APIS
app.use("/api/v1/auth", authRoutes)

app.use("/api/v1", usersRoutes)

app.use("/api/v1", vehiclesRoutes)

app.use("/api/v1", bookingRoutes)



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

cron.schedule("0 0 * * *", async () => {
    await autoReturnBookings()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
