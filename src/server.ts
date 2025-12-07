import express, { Request, Response } from 'express';
import initDb from './config/db';
import { usersRoutes } from './modules/users/users.routes';
import { authRoutes } from './modules/auth/auth.routes';
const app = express()
const port = 3000;

// parsing req.body
app.use(express.json());

// initializing Database
initDb();

// APIS
app.use("/api/v1/auth", authRoutes)

app.use("/api/v1", usersRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
