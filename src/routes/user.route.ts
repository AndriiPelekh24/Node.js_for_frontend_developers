import express from 'express';
import { UserController } from '../controller/user.controller';

const router = express.Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.post("/", UserController.createUser);

export default router;
