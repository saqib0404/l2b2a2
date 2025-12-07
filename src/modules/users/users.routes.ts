import { Router } from "express";
import { usersController } from "./users.controller";
import { auth } from "../middleware/auth";

const router = Router();

// ! Add authorization properly

router.get("/users", auth.verifyJWT(), auth.verifyAdmin(), usersController.getAllUsers)

router.put("/users/:userId", auth.verifyJWT(), usersController.updateUser)

router.put("/users/:userId", auth.verifyJWT(), auth.verifyAdmin(), usersController.deleteUser)

export const usersRoutes = router