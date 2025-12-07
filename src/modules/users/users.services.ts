import { pool } from "../../config/db"

const getAllUsers = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`)
    return result
}

const updateUser = async (id: number, payload: Record<string, unknown>) => {
    const { name, email, phone, role } = payload
    const result = await pool.query(
        `
    UPDATE users SET
      name  = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role  = COALESCE($4, role)
    WHERE id = $5
    RETURNING id, name, email, phone, role
    `,
        [name, email, phone, role, id]
    )
    return result
}

const deleteUser = async (id: number) => {
    const result = await pool.query(
        `
    DELETE FROM users 
    WHERE id = $1
    RETURNING id
    `,
        [id]
    )
    return result
}

export const usersServices = {
    getAllUsers, updateUser, deleteUser
}