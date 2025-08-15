'use client';

import { useState } from 'react';
import { Check, X, Star, Edit, Trash2, GripVertical, Image, Plus } from 'lucide-react';
import { ITodo } from '@/models/Todo';

interface TodoItemProps {
  todo: ITodo;
  onUpdate: (id: string, updates: Partial<ITodo>) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
}

export default function TodoItem({ todo, onUpdate, onDelete, onClick }: TodoItemProps) {
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
    if (todo._id) {
      onUpdate(todo._id, { completed: !todo.completed });
    }
  };

  const handlePriorityChange = (newPriority: number) => {
    if (todo._id) {
      onUpdate(todo._id, { priority: newPriority });
    }
  };

  const handleSaveEdit = () => {
    if (todo._id) {
      onUpdate(todo._id, { title: editTitle, notes: editNotes });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditNotes(todo.notes);
    setIsEditing(false);
  };

  const handleAddMedia = () => {
    const url = prompt('Enter media URL (image, video, etc.):');
    if (url && todo._id) {
      const newMedia = [...todo.media, url];
      onUpdate(todo._id, { media: newMedia });
    }
  };

  const handleRemoveMedia = (index: number) => {
    if (todo._id) {
      const newMedia = todo.media.filter((_, i) => i !== index);
      onUpdate(todo._id, { media: newMedia });
    }
  };

  const handleDelete = () => {
    if (todo._id) {
      onDelete(todo._id);
    }
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
                className={`${todo.priority >= 1 ? 'text-yellow-400' : 'text-gray-600'}`} 
              />
              <Star 
                size={16} 
                className={`${todo.priority >= 2 ? 'text-yellow-400' : 'text-gray-600'}`} 
              />
              <Star 
                size={16} 
                className={`${todo.priority >= 3 ? 'text-yellow-400' : 'text-gray-600'}`} 
              />
              <Star 
                size={16} 
                className={`${todo.priority >= 4 ? 'text-yellow-400' : 'text-gray-600'}`} 
              />
              <Star 
                size={16} 
                className={`${todo.priority >= 5 ? 'text-yellow-400' : 'text-gray-600'}`} 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Media Section */}
        {todo.media.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <Image size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">Media:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {todo.media.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border border-gray-600"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <button
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Media Button */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button
            onClick={handleAddMedia}
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Plus size={14} />
            <span>Add Media</span>
          </button>
        </div>
      </div>
    </div>
  );
}
