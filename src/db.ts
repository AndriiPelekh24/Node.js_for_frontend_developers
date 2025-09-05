import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";

interface RunResult extends sqlite3.RunResult {
  lastID: number;
  changes: number;
}

export const db = (() => {
  const dbPath = path.join(__dirname, "../my.db");
  const database = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error opening database:", err);
    else console.log("Database opened at", dbPath);
  });

  database.serialize(() => {
    database.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS Exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        description TEXT NOT NULL,
        duration INTEGER NOT NULL,
        date TEXT,
        FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);
  });

  return {
    run: (...args: [string, ...any[]]): Promise<RunResult> =>
      new Promise((resolve, reject) => {
        database.run(...args, function (this: RunResult, err: Error | null) {
          if (err) reject(err);
          else resolve(this);
        });
      }),
    get: promisify(database.get.bind(database)) as (
      sql: string,
      ...params: any[]
    ) => Promise<any>,
    all: promisify(database.all.bind(database)) as (
      sql: string,
      ...params: any[]
    ) => Promise<any[]>,
  };
})();

export default db;
