import { Todo } from '@/types/todo';

export interface AddTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  completed?: boolean;
}

export interface TodoResponse {
  success: boolean;
  data?: Todo | Todo[];
  message?: string;
} 