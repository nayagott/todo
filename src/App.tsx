import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';

function App() {
  const {
    todos,
    allTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleAll,
    clearCompleted,
    activeCount,
    completedCount,
    allCompleted,
  } = useTodos();

  const emptyMessage =
    allTodos.length === 0
      ? '할 일을 추가해 보세요!'
      : filter === 'active'
      ? '진행 중인 할 일이 없습니다.'
      : '완료된 할 일이 없습니다.';

  return (
    <div className="app">
      <h1 className="app-title">todos</h1>

      <div className="card">
        <TodoInput
          onAdd={addTodo}
          onToggleAll={toggleAll}
          hasItems={allTodos.length > 0}
          allCompleted={allCompleted}
        />

        {todos.length > 0 ? (
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onEdit={text => editTodo(todo.id, text)}
              />
            ))}
          </ul>
        ) : (
          <p className="empty">{emptyMessage}</p>
        )}

        {allTodos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <p className="hint">더블클릭으로 수정 · Enter로 저장 · Esc로 취소</p>
    </div>
  );
}

export default App;
