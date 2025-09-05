import db from '../db';
import { User } from '../interfaces/interfaces';

const getAll = (): Promise<User[]> => {
    return db.all('SELECT * FROM Users ORDER BY id DESC');
}

const getById = (id: string): Promise<User[]> => {
    return db.all('SELECT * FROM Users WHERE id = ?', [id]);
}

const createUser = (name: string): Promise<any> => {
    return db.run('INSERT INTO Users (name) VALUES (?)', [name]);
}

export const UserModel = {
    getAll,
    getById,
    createUser
};

