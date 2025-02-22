const express = require("express");
import adminController from "../controllers/adminController";
const router = express.Router();

router.get("/service/", adminController.getAllServices);
router.get("/service/single/", adminController.getAllSingleServices);
router.get("/service/combo/", adminController.getAllComboServices);
router.get("/service/:id", adminController.getServiceByIdByAdmin);
router.put("/service/:id", adminController.updateStatusByAdmin);

export default router;
