import { useState, KeyboardEvent } from 'react';

interface Props {
  onAdd: (text: string) => void;
  onToggleAll: () => void;
  hasItems: boolean;
  allCompleted: boolean;
}

export function TodoInput({ onAdd, onToggleAll, hasItems, allCompleted }: Props) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAdd(value);
      setValue('');
    }
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
    </div>
  );
}
