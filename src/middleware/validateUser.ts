import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";

export const validateUser = async (
  req: Request<{ id: string }>, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      res.status(400).json({ error: "UserId is required" });
      return;
    }

    const user = await UserModel.getById(userId);
    if (!user || user.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error("Error in validateUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }

};

