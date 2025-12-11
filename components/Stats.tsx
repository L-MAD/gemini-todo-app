import React from 'react';
import { Todo } from '../types';

const Stats: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter(t => t.isCompleted).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
        <div className="text-2xl font-bold text-slate-800">{total}</div>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Tasks</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
        <div className="text-2xl font-bold text-indigo-600">{completed}</div>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Completed</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-2xl font-bold text-green-600">{percentage}%</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Progress</div>
        </div>
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Stats;