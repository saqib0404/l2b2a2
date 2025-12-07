import { pool } from "../../config/db"
import bcrypt from "bcrypt";

const createUser = async (payload: Record<string, any>) => {
    const { name, role, email, password, phone } = payload
    const hashedPassword = await bcrypt.hash(password as string, 10)

    const result = await pool.query(
        `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
        [name, email.toLowerCase(), hashedPassword, phone, role]
    )

    return result
}

export const authServices = {
    createUser
}