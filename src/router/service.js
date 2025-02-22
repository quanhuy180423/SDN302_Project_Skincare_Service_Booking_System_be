import express from "express";
import serviceController from "../controllers/serviceController";

const router = express.Router();

router.get("/", serviceController.getAllServices);
router.post("/", serviceController.createService);
router.put("/:id", serviceController.updateService);
router.put("/delete/:id", serviceController.deleteService);
router.get("/single", serviceController.getAllSingleServices);
router.get("/combo", serviceController.getAllComboServices);
router.get("/:id", serviceController.getServiceById);

export default router;
