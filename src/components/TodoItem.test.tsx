import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TodoItem } from './TodoItem'
import { Todo } from '../types'

// 오늘 날짜 기준으로 동적 생성 — 날짜를 상수로 하드코딩하지 않는다
function getDateOffset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const baseTodo: Todo = {
  id: '1',
  text: '우유 사기',
  completed: false,
}

describe('TodoItem', () => {
  const defaultProps = {
    todo: baseTodo,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('기본 렌더링', () => {
    it('할 일 텍스트가 표시된다', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByText('우유 사기')).toBeInTheDocument()
    })

    it('체크박스가 렌더링된다', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('완료되지 않은 항목의 체크박스는 체크되지 않은 상태다', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('완료된 항목의 체크박스는 체크된 상태다', () => {
      render(<TodoItem {...defaultProps} todo={{ ...baseTodo, completed: true }} />)

      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('완료된 항목의 li 요소에 completed 클래스가 적용된다', () => {
      render(<TodoItem {...defaultProps} todo={{ ...baseTodo, completed: true }} />)

      expect(screen.getByRole('listitem')).toHaveClass('completed')
    })

    it('완료되지 않은 항목의 li 요소에 completed 클래스가 없다', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByRole('listitem')).not.toHaveClass('completed')
    })
  })

  describe('완료 토글', () => {
    it('체크박스 클릭 시 onToggle이 호출된다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.click(screen.getByRole('checkbox'))

      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1)
    })

    it('onToggle은 체크박스를 클릭할 때만 호출되고 라벨 클릭으로는 호출되지 않는다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.click(screen.getByText('우유 사기'))

      expect(defaultProps.onToggle).not.toHaveBeenCalled()
    })
  })

  describe('삭제', () => {
    it('삭제 버튼이 존재한다', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByLabelText('Delete')).toBeInTheDocument()
    })

    it('삭제 버튼 클릭 시 onDelete가 호출된다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.click(screen.getByLabelText('Delete'))

      expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
    })
  })

  describe('인라인 편집', () => {
    it('라벨 더블클릭 시 편집 입력 필드가 나타난다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.dblClick(screen.getByText('우유 사기'))

      expect(screen.getByDisplayValue('우유 사기')).toBeInTheDocument()
    })

    it('라벨 더블클릭 시 기존 라벨이 사라진다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.dblClick(screen.getByText('우유 사기'))

      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
      // label 요소 자체가 사라지고 input으로 교체됨
      expect(screen.getByRole('listitem')).toHaveClass('editing')
    })

    it('편집 후 Enter를 누르면 onEdit이 새 텍스트와 함께 호출된다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.dblClick(screen.getByText('우유 사기'))
      const editInput = screen.getByDisplayValue('우유 사기')
      await user.clear(editInput)
      await user.type(editInput, '두유 사기{Enter}')

      expect(defaultProps.onEdit).toHaveBeenCalledWith('두유 사기')
    })

    it('편집 중 Esc를 누르면 onEdit이 호출되지 않고 원래 텍스트가 유지된다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.dblClick(screen.getByText('우유 사기'))
      const editInput = screen.getByDisplayValue('우유 사기')
      await user.clear(editInput)
      await user.type(editInput, '두유 사기')
      await user.keyboard('{Escape}')

      expect(defaultProps.onEdit).not.toHaveBeenCalled()
      expect(screen.getByText('우유 사기')).toBeInTheDocument()
    })

    it('편집 필드에서 blur 시 onEdit이 현재 입력값과 함께 호출된다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.dblClick(screen.getByText('우유 사기'))
      const editInput = screen.getByDisplayValue('우유 사기')
      await user.clear(editInput)
      await user.type(editInput, '두유 사기')
      await user.tab()

      expect(defaultProps.onEdit).toHaveBeenCalledWith('두유 사기')
    })

    it('편집 시작 시 입력 필드에 기존 텍스트가 채워진다', async () => {
      const user = userEvent.setup()
      render(<TodoItem {...defaultProps} />)

      await user.dblClick(screen.getByText('우유 사기'))

      expect(screen.getByDisplayValue('우유 사기')).toBeInTheDocument()
    })
  })

  describe('기한 배지', () => {
    it('dueDate가 없으면 기한 배지가 표시되지 않는다', () => {
      const { container } = render(<TodoItem {...defaultProps} />)

      expect(container.querySelector('.due-badge')).not.toBeInTheDocument()
    })

    it('기한이 지난 항목에 due-overdue 클래스가 적용된다', () => {
      const yesterday = getDateOffset(-1)
      const { container } = render(
        <TodoItem {...defaultProps} todo={{ ...baseTodo, dueDate: yesterday }} />
      )

      expect(container.querySelector('.due-badge')).toHaveClass('due-overdue')
    })

    it('오늘이 기한인 항목에 due-today 클래스가 적용된다', () => {
      const today = getDateOffset(0)
      const { container } = render(
        <TodoItem {...defaultProps} todo={{ ...baseTodo, dueDate: today }} />
      )

      expect(container.querySelector('.due-badge')).toHaveClass('due-today')
    })

    it('기한이 남은 항목에 due-upcoming 클래스가 적용된다', () => {
      const tomorrow = getDateOffset(1)
      const { container } = render(
        <TodoItem {...defaultProps} todo={{ ...baseTodo, dueDate: tomorrow }} />
      )

      expect(container.querySelector('.due-badge')).toHaveClass('due-upcoming')
    })

    it('기한 배지에 날짜가 "N월 N일" 형식으로 표시된다', () => {
      const tomorrow = getDateOffset(1)
      const [, month, day] = tomorrow.split('-')
      const { container } = render(
        <TodoItem {...defaultProps} todo={{ ...baseTodo, dueDate: tomorrow }} />
      )

      expect(container.querySelector('.due-badge')?.textContent).toContain(
        `${parseInt(month)}월 ${parseInt(day)}일`
      )
    })

    it('완료된 항목은 기한이 초과되었어도 기한 배지가 표시되지 않는다', () => {
      const yesterday = getDateOffset(-1)
      const { container } = render(
        <TodoItem
          {...defaultProps}
          todo={{ ...baseTodo, completed: true, dueDate: yesterday }}
        />
      )

      expect(container.querySelector('.due-badge')).not.toBeInTheDocument()
    })
  })
})
