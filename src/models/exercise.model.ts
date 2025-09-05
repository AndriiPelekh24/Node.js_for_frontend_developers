import db from "../db";
import { UserExerciseLog } from "../interfaces/interfaces";


const getUserExerciseLog = async (userId: string): Promise<UserExerciseLog | null> => {
  try {
    const user = await db.get('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!user) return null;

    const logs = await db.all(
      'SELECT id, description, duration, date FROM Exercises WHERE userId = ? ORDER BY date ASC',
      [userId]
    );
    const count = logs.length;

    return {
      ...user,
      logs,
      count,
    };
  } catch (err) {
    console.error('Error fetching user exercise log:', err);
    throw err;
  }
};




 const createExercise = (
    userId: string,
    duration: number,
    description: string,
    date: string
): Promise<{ lastID: number }> => {
    return db.run(
        'INSERT INTO Exercises (userId, duration, description, date) VALUES (?, ?, ?, ?)',
        [userId, duration, description, date]
    );
};

export const ExerciseModel = {
    createExercise,
    getUserExerciseLog
}