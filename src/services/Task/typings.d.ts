export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'doing' | 'done';

export interface Task {
	id: string;
	name: string;
	assignedTo: string;
	priority: Priority;
	status: Status;
}
