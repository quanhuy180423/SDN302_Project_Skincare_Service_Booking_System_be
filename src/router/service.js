import express from 'express';
import serviceController from '../controllers/serviceController';

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.put('/delete/:id', serviceController.deleteService);
router.get('/admin/', serviceController.getAllServicesByAdmin);
router.get('/admin/:id', serviceController.getServiceByIdByAdmin);
router.put('/admin/:id', serviceController.updateStatusByAdmin);
router.get('/:id', serviceController.getServiceById);

export default router;


