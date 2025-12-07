import { pool } from "../../config/db"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import config from "../../config/config";

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

const loginUser = async (email: string, password: string) => {
    // ✅ 1. Find user by email
    const result = await pool.query(
        `
    SELECT id, name, email, password, phone, role 
    FROM users 
    WHERE email = $1
    `,
        [email.toLowerCase()]
    )

    if (result.rowCount === 0) {
        throw new Error("Invalid email")
    }

    const user = result.rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new Error("Invalid password")
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        config.jwt_secret as string,
        { expiresIn: "7d" }
    )
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    }
}

export const authServices = {
    createUser, loginUser
}