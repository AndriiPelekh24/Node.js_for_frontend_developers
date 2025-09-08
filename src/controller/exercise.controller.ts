import { ExerciseModel } from "../models/exercise.model";
import { Request, Response } from "express";
import { UserExerciseLog } from "../interfaces/interfaces";
import { UserModel } from "../models/user.model";

export const createExercise = async (req: Request, res: Response) => {
  try {
    const { description, duration, date } = req.body;
        const userId = req.params.id;
    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: "Description is required" });
    }

    if (!duration || Number(duration) <= 0) {
      return res
        .status(400)
        .json({ error: "Duration must be a positive number" });
    }

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }
    const exerciseDate = date ? new Date(date) : new Date();

    
    const exercise = await ExerciseModel.createExercise(
      userId,
      duration,
      description,
      date
    );

    if (exercise && exercise.lastID) {
      res.status(201).json({
        userId: userId,
        exerciseId: exercise.lastID,
        description: description,
        duration: duration,
        date: exerciseDate.toDateString(),
        message: "Exercise created succesfully",
      });
    } else {
      res.status(400).json({ error: "Failed to create exercise" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getUserExerciseLog = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.getById(userId);
    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const exerciseLog = await ExerciseModel.getUserExerciseLog(userId);

    if (!exerciseLog) {
      return res.status(404).json({ error: "User not found" });
    }

    const response: UserExerciseLog = {
      ...exerciseLog,
      logs: exerciseLog.logs.map((ex) => ({
        description: ex.description,
        duration: ex.duration,
        id: ex.id,
        date: new Date(ex.date).toDateString(),
      })),
    };

    return res.json(response);
  } catch (error) {
    console.error("Error in getUserExerciseLog:", error);
    return res.status(500).json({ error: "Failed to request exerciseLog" });
  }
};


export const ExerciseController = {
    createExercise,
    getUserExerciseLog
}