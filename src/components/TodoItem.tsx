import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEdit = () => {
    setEditValue(todo.text);
    setEditing(true);
  };

  const commitEdit = () => {
    onEdit(editValue);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setEditValue(todo.text);
      setEditing(false);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      {editing ? (
        <input
          ref={inputRef}
          className="edit-input"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
        />
      ) : (
        <>
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.completed}
            onChange={onToggle}
            aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`}
          />
          <label className="todo-label" onDoubleClick={startEdit}>
            {todo.text}
          </label>
          <button className="delete-btn" onClick={onDelete} aria-label="Delete">
            ×
          </button>
        </>
      )}
    </li>
  );
}
