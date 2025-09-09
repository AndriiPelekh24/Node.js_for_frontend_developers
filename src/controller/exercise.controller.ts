import { ExerciseModel } from "../models/exercise.model";
import { Request, Response } from "express";
import { ExerciseBody, UserExerciseLog } from "../interfaces/interfaces";
import { UserModel } from "../models/user.model";
import { isValidDateString } from "../utils/utils";

export const createExercise = async (
  req: Request<{ id: string }, {}, ExerciseBody>,
  res: Response
): Promise<void> => {
  try {
    const { description, duration, date } = req.body;
    const userId = req.params.id;

    if (!description || description.trim().length === 0) {
      res.status(400).json({ error: "Description is required" });
      return;
    }

    if (
      duration === undefined ||
      isNaN(Number(duration)) ||
      Number(duration) <= 0
    ) {
      res.status(400).json({ error: "Duration must be a positive number" });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: "UserId is required" });
      return;
    }

    const exerciseDate: Date = date ? new Date(date) : new Date();

    if (date && !isValidDateString(date)) {
      res.status(400).json({ error: "Date should be valid, format of date should be as YYYY-MM-DD" });
      return;
    }
    const exercise = await ExerciseModel.createExercise(
      userId,
      Number(duration),
      description.trim(),
      exerciseDate.toISOString()
    );

    if (exercise?.lastID) {
      res.status(201).json({
        userId,
        exerciseId: exercise.lastID,
        description: description.trim(),
        duration: Number(duration),
        date: exerciseDate.toDateString(),
        message: "Exercise created successfully",
      });
    } else {
      res.status(500).json({ error: "Failed to create exercise" });
    }
  } catch (error) {
    console.error("Error in createExercise:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserExerciseLog = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { from, to, limit } = req.query;

    const user = await UserModel.getById(userId);
    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let exerciseLog = await ExerciseModel.getUserExerciseLog(userId);

    if (!exerciseLog) {
      return res.status(404).json({ error: "User not found" });
    }

    let filteredLogs = exerciseLog.logs.filter((ex) => {
      const exDate = ex.date ? new Date(ex.date) : new Date();
      const fromDate = from ? new Date(from as string) : null;
      const toDate = to ? new Date(to as string) : null;

      if (fromDate && exDate < fromDate) return false;
      if (toDate && exDate > toDate) return false;
      return true;
    });

    if (limit && !isNaN(Number(limit))) {
      filteredLogs = filteredLogs.slice(0, Number(limit));
    }

    const response: UserExerciseLog = {
      ...exerciseLog,
      logs: filteredLogs.map((ex) => {
        const dateObj = ex.date ? new Date(ex.date) : new Date();
        return {
          description: ex.description,
          duration: ex.duration,
          id: ex.id,
          date: dateObj.toDateString(),
        };
      }),
      count: filteredLogs.length,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error in getUserExerciseLog:", error);
    return res.status(500).json({ error: "Failed to request exerciseLog" });
  }
};

export const ExerciseController = {
  createExercise,
  getUserExerciseLog,
};
