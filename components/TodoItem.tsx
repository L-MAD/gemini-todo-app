import React, { useState } from 'react';
import { Todo, Priority } from '../types';
import { Trash2, CheckCircle, Circle, AlertCircle, Sparkles, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import Button from './Button';
import { breakdownTask } from '../services/geminiService';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtasks: (subtasks: string[]) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onAddSubtasks }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiBreakdown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    setError(null);
    try {
      const subtasks = await breakdownTask(todo.title);
      if (subtasks.length > 0) {
        onAddSubtasks(subtasks);
      } else {
        setError("AI couldn't generate relevant subtasks.");
      }
    } catch (err) {
      setError("AI service unavailable.");
    } finally {
      setIsGenerating(false);
    }
  };

  const priorityColor = {
    [Priority.HIGH]: 'text-red-600 bg-red-50 border-red-200',
    [Priority.MEDIUM]: 'text-amber-600 bg-amber-50 border-amber-200',
    [Priority.LOW]: 'text-blue-600 bg-blue-50 border-blue-200',
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;

  return (
    <div className={`group relative bg-white border rounded-xl shadow-sm transition-all hover:shadow-md ${todo.isCompleted ? 'opacity-75 bg-slate-50' : ''}`}>
      <div className="p-4 flex items-start gap-3">
        <button 
          onClick={() => onToggle(todo.id)}
          className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
          aria-label={todo.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`text-base font-medium truncate max-w-full ${todo.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
              {todo.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor[todo.priority]}`}>
              {todo.priority}
            </span>
            {todo.estimatedHours > 0 && (
                <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <Clock className="w-3 h-3" /> {todo.estimatedHours}h
                </span>
            )}
            {isOverdue && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" /> Overdue
              </span>
            )}
          </div>
          
          <div className="text-sm text-slate-500 flex items-center gap-4">
            {todo.dueDate && (
              <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
           {/* Only show AI button if not completed */}
           {!todo.isCompleted && process.env.API_KEY && (
            <button
              onClick={handleAiBreakdown}
              disabled={isGenerating}
              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
              title="AI Break Down"
            >
              {isGenerating ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/> : <Sparkles className="w-4 h-4" />}
            </button>
          )}

          <button 
            onClick={() => onDelete(todo.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full sm:hidden"
          >
             {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Expanded Details */}
      {(isExpanded || todo.description) && (
        <div className={`px-4 pb-4 pl-12 ${!isExpanded && 'hidden sm:block'}`}>
           {todo.description && (
             <p className="text-sm text-slate-600 mb-2">{todo.description}</p>
           )}
           {error && (
             <p className="text-xs text-red-500 flex items-center gap-1">
               <AlertCircle className="w-3 h-3" /> {error}
             </p>
           )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;