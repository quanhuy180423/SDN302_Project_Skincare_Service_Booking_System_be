import express from 'express';
import userController from '../controllers/userController';
import { checkTokenWithCookie } from '../middleware/JWTAction'
const router = express.Router();

router.post('/createByAdmin', userController.createUser);

router.get('/getMe', checkTokenWithCookie, userController.getMe)
router.patch('/changePassword', userController.changePassword);

router.put('/delete/:id', userController.deleteUserById);
router.patch('/update/:id', userController.updateUserById);
router.patch('/updateStatus/:id', userController.updateStatusUserById);

router.get('/:id', userController.getUserById);

export default router;


