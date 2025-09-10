import { ExerciseModel } from "../models/exercise.model";
import { Request, Response } from "express";
import {
  ExerciseBody,
  ExerciseLogQuery,
  UserExerciseLog,
} from "../interfaces/interfaces";
import {
  isDateDiapasonValid,
  isEmpty,
  isValidDateString,
} from "../utils/utils";

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

    if (date && !isValidDateString(date)) {
      res.status(400).json({
        error: "Date should be valid, format of date should be as YYYY-MM-DD",
      });
      return;
    }

    const exerciseDate: Date = date ? new Date(date) : new Date();

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

export const getUserExerciseLog = async (
  req: Request<{ id: string }, {}, {}, ExerciseLogQuery>,
  res: Response
) => {
  try {
    const userId = req.params.id;
    const { from, to, limit } = req.query;

    if (from && to && !isDateDiapasonValid(from, to)) {
      return res
        .status(400)
        .json({ error: "From date should be earlier than to date" });
    }
    if (to && !isValidDateString(to)) {
      return res.status(400).json({
        error: "To date should be valid, format should be YYYY-MM-DD",
      });
    }
    if (from && !isValidDateString(from)) {
      return res.status(400).json({
        error: "From date should be valid, format should be YYYY-MM-DD",
      });
    }

    const totalCount = await ExerciseModel.getUserExerciseCount(
      userId,
      from,
      to
    );
    const exerciseLog = await ExerciseModel.getUserExerciseLogWithFilters(
      userId,
      from,
      to,
      limit ? Number(limit) : undefined
    );
    if (!exerciseLog) {
      return res
        .status(404)
        .json({ error: "No exercise log found for this user" });
    }

    if (Number(limit) > totalCount || 1 > Number(limit)) {
      console.log(from, typeof from);
      return res.status(400).json({
        error: `Maximum limit can be ${totalCount} and limit should be positive number`,
      });
    }
    const response: UserExerciseLog = {
      ...exerciseLog,
      logs: exerciseLog.logs.map((ex) => {
        const dateObj = ex.date ? new Date(ex.date) : new Date();
        return {
          description: ex.description,
          duration: ex.duration,
          id: ex.id,
          date: dateObj.toDateString(),
        };
      }),
      count: totalCount,
    };
    if (isEmpty(response.logs) && totalCount === 0) {
      return res.status(404).json({ error: `No Exercises founded` });
    }
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
