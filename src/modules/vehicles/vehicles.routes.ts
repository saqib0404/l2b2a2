import { Router } from "express";
import { auth } from "../middleware/auth";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.get("/vehicles", vehiclesController.getAllVehicles)

router.post("/vehicles", auth.verifyJWT(), auth.verifyAdmin(), vehiclesController.createVehicle)

router.get("/vehicles/:vehicleId", vehiclesController.getSpecificVehicle)

router.put("/vehicles/:vehicleId", auth.verifyJWT(), auth.verifyAdmin(), vehiclesController.updateVehicle)

router.delete("/vehicles/:vehicleId", auth.verifyJWT(), auth.verifyAdmin(), vehiclesController.deleteVehicle)

export const vehiclesRoutes = router