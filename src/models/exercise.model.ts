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

const getUserExerciseCount = async (
  userId: string,
  from?: string,
  to?: string
): Promise<number> => {
  try {
    let sql = 'SELECT COUNT(*) as count FROM Exercises WHERE userId = ?';
    const params: any[] = [userId];

    if (from) {
      sql += ' AND DATE(date) >= ?';
      params.push(from);
    }

    if (to) {
      sql += ' AND DATE(date) <= ?';
      params.push(to);
    }

    const result = await db.get(sql, params);
    
    return result?.count || 0;
  } catch (err) {
    console.error('Error counting user exercises:', err);
    throw err;
  }
};

const getUserExerciseLogWithFilters = async (
  userId: string,
  from?: string,
  to?: string,
  limit?: number
): Promise<UserExerciseLog | null> => {
  try {
    const user = await db.get('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!user) return null;

    let sql = 'SELECT id, description, duration, date FROM Exercises WHERE userId = ?';
    const params: any[] = [userId];

    if (from) {
      sql += ' AND DATE(date) >= ?';
      params.push(from);
    }

    if (to) {
      sql += ' AND DATE(date) <= ?';
      params.push(to);
    }

    sql += ' ORDER BY date DESC';

    if (limit && limit > 0) {
      sql += ' LIMIT ?';
      params.push(limit);
    }

    const logs = await db.all(sql, params);

    return {
      ...user,
      logs,
      count: logs.length, 
    };
  } catch (err) {
    console.error('Error fetching filtered user exercise log:', err);
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
    getUserExerciseLog,
    getUserExerciseCount,
    getUserExerciseLogWithFilters,
}