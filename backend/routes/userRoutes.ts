import express from 'express';
const router = express.Router();
import { deleteUser, getUserById, getUserProfile, getUsers, logInUser, logoutUser, registerUser, updateUser, updateUserProfile } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, admin, getUsers);

router.post('/logout', logoutUser);
router.post('/login', logInUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);



export default router;