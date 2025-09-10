import express from 'express';
import { ExerciseController } from '../controller/exercise.controller';
import { validateUser } from '../middleware/validateUser';

const router = express.Router();

router.post("/:id/exercises",validateUser, ExerciseController.createExercise);
router.get("/:id/logs",validateUser, ExerciseController.getUserExerciseLog);

export default router;
