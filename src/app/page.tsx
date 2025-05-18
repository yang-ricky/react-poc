'use client';

import { useState, useEffect } from 'react';
import TodoItem from '@/components/TodoItem';
import { Todo } from '@/types/todo';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, searchTerm, filter]);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  };

  const filterTodos = () => {
    let filtered = [...todos];
    
    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTodos(filtered);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodo }),
    });

    const data = await response.json();
    setTodos([...todos, data]);
    setNewTodo('');
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        completed: !todo.completed,
      }),
    });

    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const editTodo = async (id: string, title: string) => {
    await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        title,
      }),
    });

    setTodos(todos.map(t =>
      t.id === id ? { ...t, title } : t
    ));
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos?id=${id}`, {
      method: 'DELETE',
    });

    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">Todo List</h1>
                
                <form onSubmit={addTodo} className="flex gap-2 mb-8">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="添加新的待办事项..."
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    添加
                  </button>
                </form>

                <div className="mb-4">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="搜索待办事项..."
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => setFilter('active')}
                      className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      未完成
                    </button>
                    <button
                      onClick={() => setFilter('completed')}
                      className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      已完成
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredTodos.length > 0 ? (
                    filteredTodos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500">没有待办事项</p>
                  )}
                </div>
                
                {todos.length > 0 && (
                  <div className="text-sm text-gray-500 text-center mt-4">
                    总共: {todos.length} | 已完成: {todos.filter(t => t.completed).length} | 未完成: {todos.filter(t => !t.completed).length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
