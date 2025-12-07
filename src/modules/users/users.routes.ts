import { Router } from "express";
import { usersController } from "./users.controller";

const router = Router();

// ! Needs To authenticate all the routes

router.get("/users", usersController.getAllUsers)

router.put("/users/:userId", usersController.updateUser)

router.put("/users/:userId", usersController.deleteUser)

export const usersRoutes = router