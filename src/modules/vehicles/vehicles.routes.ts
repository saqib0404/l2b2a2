import { Router } from "express";
import { auth } from "../middleware/auth";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

// ! Add authorization properly

router.get("/vehicles", vehiclesController.getAllVehicles)

router.post("/vehicles", vehiclesController.createVehicle)

router.get("/vehicles/:vehicleId", vehiclesController.getSpecificVehicle)

router.put("/vehicles/:vehicleId", vehiclesController.updateVehicle)

router.delete("/vehicles/:vehicleId", vehiclesController.deleteVehicle)

export const vehiclesRoutes = router