import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ClipboardList, CreditCard as Edit2, Check, X } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem('todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<Priority>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showClearAll, setShowClearAll] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [
      { id: crypto.randomUUID(), text, completed: false, priority, createdAt: Date.now() },
      ...prev,
    ]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id: string) => {
    if (editingText.trim()) {
      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, text: editingText.trim() } : t))
      );
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const clearAll = () => {
    setTodos([]);
    setShowClearAll(false);
  };

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high':
        return 'bg-rose-100 border-rose-300';
      case 'medium':
        return 'bg-amber-100 border-amber-300';
      case 'low':
        return 'bg-emerald-100 border-emerald-300';
    }
  };

  const getPriorityDot = (p: Priority) => {
    switch (p) {
      case 'high':
        return 'bg-rose-400';
      case 'medium':
        return 'bg-amber-400';
      case 'low':
        return 'bg-emerald-400';
    }
  };

  const getPriorityLabel = (p: Priority) => {
    switch (p) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-teal-50 flex items-start justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">我的待办清单</h1>
          <p className="text-gray-400 mt-1 text-sm">保持专注，逐一完成</p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm border border-blue-50 text-center">
            <div className="text-2xl font-bold text-blue-500">{activeCount}</div>
            <div className="text-xs text-gray-400 mt-0.5">待完成</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm border border-blue-50 text-center">
            <div className="text-2xl font-bold text-emerald-500">{completedCount}</div>
            <div className="text-xs text-gray-400 mt-0.5">已完成</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm border border-blue-50 text-center">
            <div className="text-2xl font-bold text-gray-600">{todos.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">全部</div>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
              placeholder="今天要做什么？"
              className="flex-1 bg-white border border-blue-100 rounded-2xl px-5 py-3.5 text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
            />
            <button
              onClick={addTodo}
              className="px-4 h-12 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 active:scale-95 rounded-2xl shadow-md shadow-blue-200 transition-all duration-150 font-medium text-white text-sm flex items-center gap-1"
            >
              <span>➕</span>
              <span className="hidden sm:inline">添加任务</span>
            </button>
          </div>

          {/* Priority Select */}
          <div className="flex gap-2">
            <span className="text-xs text-gray-500 py-2">优先级：</span>
            {(['high', 'medium', 'low'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  priority === p
                    ? `${getPriorityColor(p)} border-2`
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}
              >
                {getPriorityLabel(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-blue-50 mb-4">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                filter === f
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f === 'all' ? '全部' : f === 'active' ? '待完成' : '已完成'}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-gray-400 text-sm">
                {filter === 'completed'
                  ? '还没有已完成的任务'
                  : filter === 'active'
                  ? '没有待完成的任务，好好休息一下吧！'
                  : '添加你的第一个任务吧'}
              </p>
            </div>
          ) : (
            filtered.map(todo => (
              <div
                key={todo.id}
                className={`group flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border transition-all duration-200 ${
                  todo.completed
                    ? 'border-gray-50 opacity-60'
                    : `border-blue-50 hover:shadow-md hover:border-blue-100 ${getPriorityColor(todo.priority)}`
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 transition-transform active:scale-90"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors" />
                  )}
                </button>

                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityDot(todo.priority)}`} />

                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(todo.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                    className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                ) : (
                  <span
                    className={`flex-1 text-sm leading-relaxed ${
                      todo.completed ? 'line-through text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="text-emerald-400 hover:text-emerald-600 active:scale-90 transition-all"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-300 hover:text-gray-400 active:scale-90 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-gray-300 hover:text-blue-400 active:scale-90 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-200 hover:text-rose-400 active:scale-90 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        {todos.length > 0 && (
          <div className="mt-6 flex gap-2 justify-center flex-wrap">
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-2xl text-sm font-medium transition-all active:scale-95"
              >
                清空已完成 ({completedCount})
              </button>
            )}
            <button
              onClick={() => setShowClearAll(true)}
              className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl text-sm font-medium transition-all active:scale-95"
            >
              全部清空
            </button>
          </div>
        )}

        {/* Clear All Modal */}
        {showClearAll && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-lg font-bold text-gray-800">确定清空全部任务？</h3>
                <p className="text-sm text-gray-400 mt-2">此操作无法撤销，所有任务将被永久删除</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearAll(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium transition-all active:scale-95"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
