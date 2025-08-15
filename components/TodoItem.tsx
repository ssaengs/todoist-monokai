'use client';

import { useState } from 'react';
import { GripVertical, Trash2, Edit3, Check, X, Star } from 'lucide-react';
import { ITodo } from '@/models/Todo';

interface TodoItemProps {
  todo: ITodo;
  onUpdate: (id: string, updates: Partial<ITodo>) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export default function TodoItem({ todo, onUpdate, onDelete, onClick }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editNotes, setEditNotes] = useState(todo.notes);

  const priorityColors = {
    1: 'bg-gray-800 border-red-500 text-red-400',
    2: 'bg-gray-800 border-orange-500 text-orange-400',
    3: 'bg-gray-800 border-yellow-500 text-yellow-400',
    4: 'bg-gray-800 border-blue-500 text-blue-400',
    5: 'bg-gray-800 border-green-500 text-green-400',
  };

  const handleToggleComplete = () => {
    onUpdate(todo._id, { completed: !todo.completed });
  };

  const handlePriorityChange = (newPriority: number) => {
    onUpdate(todo._id, { priority: newPriority });
  };

  const handleSaveEdit = () => {
    onUpdate(todo._id, { title: editTitle, notes: editNotes });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditNotes(todo.notes);
    setIsEditing(false);
  };

  const handleAddMedia = () => {
    const url = prompt('Enter media URL (image, video, etc.):');
    if (url) {
      const newMedia = [...todo.media, url];
      onUpdate(todo._id, { media: newMedia });
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = todo.media.filter((_, i) => i !== index);
    onUpdate(todo._id, { media: newMedia });
  };

  return (
    <div className={`bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 ${
      priorityColors[todo.priority as keyof typeof priorityColors]
    } ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <GripVertical className="text-gray-400 cursor-grab" size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100"
                />
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="w-full px-3 py-1 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-800 text-gray-100 placeholder-gray-400"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1"
                  >
                    <Check size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center space-x-1"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div 
                  className={`text-lg font-medium cursor-pointer hover:text-blue-400 transition-colors ${
                    todo.completed ? 'line-through' : ''
                  }`}
                  onClick={onClick}
                >
                  {todo.title}
                </div>
                {todo.notes && (
                  <p className="text-sm text-gray-400 mt-1">{todo.notes}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Priority Display */}
            <div className="flex items-center space-x-1">
              <Star 
                size={16} 
                className={`${
                  todo.priority >= 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`} 
              />
              <span className="text-sm font-medium">{todo.priority}</span>
            </div>

            {/* Complete Checkbox */}
            <button
              onClick={handleToggleComplete}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                todo.completed 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'border-gray-500 hover:border-green-500'
              }`}
            >
              {todo.completed && <Check size={14} />}
            </button>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Edit3 size={16} />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(todo._id)}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && !isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-600 space-y-4">
            {/* Priority Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Priority Level
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handlePriorityChange(level)}
                    className={`w-8 h-8 rounded-full text-white font-bold transition-all ${
                      level === 1 ? 'bg-red-500' :
                      level === 2 ? 'bg-orange-500' :
                      level === 3 ? 'bg-yellow-500' :
                      level === 4 ? 'bg-blue-500' :
                      'bg-green-500'
                    } ${todo.priority === level ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:opacity-80'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Notes
              </label>
              <textarea
                value={todo.notes}
                onChange={(e) => onUpdate(todo._id, { notes: e.target.value })}
                placeholder="Add notes..."
                className="w-full px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-800 text-gray-100 placeholder-gray-400"
                rows={3}
              />
            </div>

            {/* Media */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-200">
                  Media
                </label>
                <button
                  onClick={handleAddMedia}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  + Add Media
                </button>
              </div>
              {todo.media.length > 0 && (
                <div className="space-y-2">
                  {todo.media.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1 min-w-0">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 truncate block"
                        >
                          {url}
                        </a>
                      </div>
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {!isEditing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
        )}
      </div>
    </div>
  );
}
