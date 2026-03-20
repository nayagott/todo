export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // 'YYYY-MM-DD'
}

export type DueDateStatus = 'overdue' | 'today' | 'upcoming';

export function getDueDateStatus(dueDate: string): DueDateStatus {
  const today = new Date().toISOString().split('T')[0];
  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';
  return 'upcoming';
}

export type Filter = 'all' | 'active' | 'completed';
