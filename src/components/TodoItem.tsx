import { Todo } from '@/types/todo';
import { useState } from 'react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleEditSubmit = () => {
    if (editTitle.trim() !== '') {
      onEdit(todo.id, editTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-4 w-4 text-blue-600 rounded"
        />
        
        {isEditing ? (
          <div className="ml-3 flex-1 flex gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 p-1 border rounded"
              autoFocus
            />
            <button
              onClick={handleEditSubmit}
              className="text-green-500 hover:text-green-700 px-2"
            >
              保存
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              取消
            </button>
          </div>
        ) : (
          <span className={`ml-3 flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </span>
        )}
      </div>
      
      {!isEditing && (
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-700"
          >
            删除
          </button>
        </div>
      )}
    </div>
  );
} 