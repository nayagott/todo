import { Filter } from '../types';

interface Props {
  activeCount: number;
  completedCount: number;
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  onClearCompleted: () => void;
}

const FILTERS: Filter[] = ['all', 'active', 'completed'];
const FILTER_LABELS: Record<Filter, string> = {
  all: '전체',
  active: '진행 중',
  completed: '완료',
};

export function Footer({ activeCount, completedCount, filter, onFilterChange, onClearCompleted }: Props) {
  return (
    <footer className="todo-footer">
      <span className="item-count">
        <strong>{activeCount}</strong>개 남음
      </span>

      <div className="filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button className="clear-btn" onClick={onClearCompleted}>
          완료 삭제 ({completedCount})
        </button>
      )}
    </footer>
  );
}
