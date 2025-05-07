import { Task } from '@/services/Task/typings';

export const loadTasks = (): Task[] => {
	const tasks = localStorage.getItem('tasks');
	return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]) => {
	localStorage.setItem('tasks', JSON.stringify(tasks));
};
