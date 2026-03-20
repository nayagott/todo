import { useState, KeyboardEvent } from 'react';

interface Props {
  onAdd: (text: string, dueDate?: string) => void;
  onToggleAll: () => void;
  hasItems: boolean;
  allCompleted: boolean;
}

export function TodoInput({ onAdd, onToggleAll, hasItems, allCompleted }: Props) {
  const [value, setValue] = useState('');
  const [dueDate, setDueDate] = useState('');

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value, dueDate || undefined);
    setValue('');
    setDueDate('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="input-row">
      {hasItems && (
        <button
          className={`toggle-all ${allCompleted ? 'active' : ''}`}
          onClick={onToggleAll}
          aria-label="Toggle all"
        >
          ▾
        </button>
      )}
      <input
        className="todo-input"
        type="text"
        placeholder="할 일을 입력하세요..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <input
        className="due-input"
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        aria-label="기한 설정"
      />
    </div>
  );
}
