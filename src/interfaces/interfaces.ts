export interface User {
  id: number;
  name: string;
}

export interface CreatedExerciseResponse {
	userId: number;
	exerciseId: number;
	duration: number;
	description: string;
	date: string;
}

export interface ExerciseBody  {
	description: string;
	duration: number;
	date?: string;
}
export interface Exercise extends ExerciseBody {
	id: number;
}

export interface UserExerciseLog extends User {
	logs: Exercise[];
	count: number;
}

export const BASE_URL = '/api/users'
