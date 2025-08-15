'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (title: string, priority: number) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), priority);
      setTitle('');
      setPriority(3);
      setIsExpanded(false);
    }
  };

  const priorityColors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-blue-500',
    5: 'bg-green-500',
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-100 placeholder-gray-400"
            onFocus={() => setIsExpanded(true)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add</span>
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Priority Level
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level)}
                    className={`w-8 h-8 rounded-full ${
                      priorityColors[level as keyof typeof priorityColors]
                    } text-white font-bold hover:opacity-80 transition-opacity ${
                      priority === level ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {priority === 1 && 'Lowest priority'}
                {priority === 2 && 'Low priority'}
                {priority === 3 && 'Medium priority'}
                {priority === 4 && 'High priority'}
                {priority === 5 && 'Highest priority'}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
