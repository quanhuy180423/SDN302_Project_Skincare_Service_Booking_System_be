import express from 'express';
import userController from '../controllers/userController';
const router = express.Router();

router.post('/createByAdmin', userController.createUser);

router.get('/', userController.getAllUsers);
router.get('/getCustomer', userController.getUserByRoleCustomer);
router.get('/getStaff', userController.getUserByRoleStaff);
router.get('/getTherapist', userController.getUserByRoleTherapist);

router.put('/delete/:id', userController.deleteUserById);
router.patch('/update/:id', userController.updateUserById);
router.get('/:id', userController.getUserById);
router.patch('/updateStatus/:id', userController.updateStatusUserById);

router.patch('/changePassword', userController.changePassword);

export default router;


