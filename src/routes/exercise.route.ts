import express from 'express';
import { ExerciseController } from '../controller/exercise.controller';

const router = express.Router();

router.post("/:id", ExerciseController.createExercise);
router.get("/:id/logs", ExerciseController.getUserExerciseLog);

export default router;
