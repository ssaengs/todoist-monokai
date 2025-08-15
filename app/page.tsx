'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TodoItem from '@/components/TodoItem';
import AddTodoForm from '@/components/AddTodoForm';
import { ITodo } from '@/models/Todo';

export default function Home() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string, priority: number) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, priority }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const updateTodo = async (id: string, updates: Partial<ITodo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(todo => 
          todo._id === id ? updatedTodo : todo
        ));
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Sort by priority (highest first) while maintaining drag order within same priority
    const sortedItems = items.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Highest priority first
      }
      return items.indexOf(a) - items.indexOf(b); // Maintain drag order within same priority
    });

    setTodos(sortedItems);

    // Update order in database
    try {
      await fetch('/api/todos/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos: sortedItems }),
      });
    } catch (error) {
      console.error('Failed to reorder todos:', error);
    }
  };

  const handleTodoClick = async (id: string) => {
    // Move clicked todo to the bottom of its priority group
    const clickedTodo = todos.find(todo => todo._id === id);
    if (clickedTodo) {
      const otherTodos = todos.filter(todo => todo._id !== id);
      const newTodos = [...otherTodos, clickedTodo];
      
      // Sort by priority (highest first) while maintaining the clicked todo at bottom of its priority group
      const sortedTodos = newTodos.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority; // Highest priority first
        }
        // If same priority, put clicked todo at the end
        if (a._id === id) return 1;
        if (b._id === id) return -1;
        return newTodos.indexOf(a) - newTodos.indexOf(b);
      });
      
      setTodos(sortedTodos);

      // Update order in database
      try {
        await fetch('/api/todos/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ todos: sortedTodos }),
        });
      } catch (error) {
        console.error('Failed to reorder todos:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-100">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-100">
          Todo List
        </h1>
        
        <AddTodoForm onAdd={addTodo} />
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 mt-6"
              >
                {todos.map((todo, index) => (
                  <Draggable key={todo._id || `temp-${index}`} draggableId={todo._id || `temp-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoItem
                          todo={todo}
                          onUpdate={updateTodo}
                          onDelete={deleteTodo}
                          onClick={() => handleTodoClick(todo._id || '')}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
