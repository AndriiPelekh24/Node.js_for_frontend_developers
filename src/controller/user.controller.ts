import { UserModel } from "../models/user.model";
import { Request, Response } from "express";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.getById(req.params.id);
    if (!user) {
      res.status(404).json("Not Found user");
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.body;
    console.log("BODY:", req.body);
    if (!username || username.trim().length === 0) {
      res
        .status(400)
        .json({ error: "username is required and must be a non-empty string" });
      return;
    }

    const result = await UserModel.createUser(username.trim());

    if (result && result.lastID) {
      res.status(201).json({
        id: result.lastID,
        username: username.trim(),
        message: "User created successfully",
      });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error: any) {
    console.error("Error in createUser:", error);

    if (
      error.code === "SQLITE_CONSTRAINT_UNIQUE" ||
      error.message?.includes("UNIQUE constraint failed")
    ) {
      res.status(400).json({
        error: "User with this username already exists",
      });
    } else {
      res.status(500).json({
        error: "Failed to create user",
      });
    }
  }
};

export const UserController = {
  getAll,
  getById,
  createUser,
};
