import React, { useState } from 'react';
import { Priority, Todo } from '../types';
import { 
  TODO_TITLE_MIN_LENGTH, 
  TODO_TITLE_MAX_LENGTH, 
  TODO_DESC_MAX_LENGTH, 
  MIN_ESTIMATED_HOURS,
  MAX_ESTIMATED_HOURS,
  ERROR_MESSAGES 
} from '../constants';
import Button from './Button';
import { Plus, Calendar, Clock } from 'lucide-react';

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt' | 'isCompleted'>) => boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedTitle = title.trim();

    // BVA: Title Length
    if (trimmedTitle.length < TODO_TITLE_MIN_LENGTH) {
      newErrors.title = ERROR_MESSAGES.TITLE_TOO_SHORT;
    }
    if (trimmedTitle.length > TODO_TITLE_MAX_LENGTH) {
      newErrors.title = ERROR_MESSAGES.TITLE_TOO_LONG;
    }
    if (trimmedTitle.length === 0) {
      newErrors.title = ERROR_MESSAGES.TITLE_REQUIRED;
    }

    // BVA: Desc Length
    if (description.length > TODO_DESC_MAX_LENGTH) {
      newErrors.description = ERROR_MESSAGES.DESC_TOO_LONG;
    }

    // BVA: Date (Past vs Today)
    if (dueDate) {
      const selectedDate = new Date(dueDate + 'T00:00:00'); // Force local time start of day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = ERROR_MESSAGES.DUE_DATE_PAST;
      }
    }

    // BVA: Numerical Input (Estimated Hours)
    // Valid boundaries: 0 (Min) and 100 (Max)
    // Invalid boundaries: -1 and 101
    const hoursNum = parseFloat(estimatedHours);
    if (estimatedHours !== '') {
        if (isNaN(hoursNum)) {
             newErrors.estimatedHours = "Must be a number";
        } else if (hoursNum < MIN_ESTIMATED_HOURS) {
             newErrors.estimatedHours = ERROR_MESSAGES.ESTIMATE_NEGATIVE;
        } else if (hoursNum > MAX_ESTIMATED_HOURS) {
             newErrors.estimatedHours = ERROR_MESSAGES.ESTIMATE_TOO_HIGH;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const success = onAdd({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0
      });

      if (success) {
        setTitle('');
        setDescription('');
        setPriority(Priority.MEDIUM);
        setDueDate('');
        setEstimatedHours('');
        setErrors({});
        setIsExpanded(false);
      }
    }
  };

  const getCharCountColor = (current: number, max: number) => {
    if (current > max) return 'text-red-500 font-bold';
    if (current >= max * 0.9) return 'text-amber-500 font-medium';
    return 'text-slate-400';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex flex-col gap-4">
          <div className="relative group">
             <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if(errors.title) setErrors({...errors, title: ''});
              }}
              onFocus={() => setIsExpanded(true)}
              placeholder="What needs to be done?"
              className={`w-full text-lg px-4 py-3 rounded-lg border transition-all outline-none text-slate-900 ${errors.title ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'bg-white border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500'}`}
            />
            <span className={`absolute right-3 top-4 text-xs transition-colors ${getCharCountColor(title.length, TODO_TITLE_MAX_LENGTH)}`}>
              {title.length}/{TODO_TITLE_MAX_LENGTH}
            </span>
          </div>
          
          {errors.title && (
            <p className="text-sm text-red-600 -mt-2 ml-1 font-medium">{errors.title}</p>
          )}

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className={`w-full px-4 py-2 text-sm rounded-lg border outline-none resize-none text-slate-900 ${errors.description ? 'border-red-300 bg-red-50' : 'bg-white border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500'}`}
                />
                <span className={`absolute right-2 bottom-2 text-xs transition-colors ${getCharCountColor(description.length, TODO_DESC_MAX_LENGTH)}`}>
                  {description.length}/{TODO_DESC_MAX_LENGTH}
                </span>
              </div>
              
              {errors.description && (
                <p className="text-sm text-red-600 -mt-2 ml-1 font-medium">{errors.description}</p>
              )}

              <div className="flex flex-wrap gap-3 items-start justify-between">
                <div className="flex flex-wrap gap-3">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="h-10 px-3 py-2 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <option value={Priority.LOW}>Low Priority</option>
                    <option value={Priority.MEDIUM}>Medium Priority</option>
                    <option value={Priority.HIGH}>High Priority</option>
                  </select>

                  <div className="flex flex-col">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className={`h-4 w-4 ${errors.dueDate ? 'text-red-400' : 'text-slate-400'}`} />
                      </div>
                      <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => {
                            setDueDate(e.target.value);
                            if(errors.dueDate) setErrors({...errors, dueDate: ''});
                          }}
                          className={`h-10 pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.dueDate ? 'border-red-300 text-red-600' : 'text-slate-900 border-slate-200'}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className={`h-4 w-4 ${errors.estimatedHours ? 'text-red-400' : 'text-slate-400'}`} />
                      </div>
                      <input
                          type="number"
                          value={estimatedHours}
                          onChange={(e) => {
                            setEstimatedHours(e.target.value);
                            if(errors.estimatedHours) setErrors({...errors, estimatedHours: ''});
                          }}
                          placeholder="Est. Hours"
                          className={`h-10 pl-9 pr-3 py-2 w-32 text-sm bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.estimatedHours ? 'border-red-300 text-red-600 placeholder-red-300' : 'text-slate-900 border-slate-200'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-1 sm:mt-0">
                  <Button type="button" variant="ghost" onClick={() => setIsExpanded(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                 {errors.dueDate && (
                    <p className="text-sm text-red-600 ml-1 font-medium">{errors.dueDate}</p>
                )}
                {errors.estimatedHours && (
                    <p className="text-sm text-red-600 ml-1 font-medium">{errors.estimatedHours}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;