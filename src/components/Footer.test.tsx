import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Footer } from './Footer'

const defaultProps = {
  activeCount: 2,
  completedCount: 0,
  filter: 'all' as const,
  onFilterChange: vi.fn(),
  onClearCompleted: vi.fn(),
}

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('남은 항목 수', () => {
    it('activeCount 값을 표시한다', () => {
      render(<Footer {...defaultProps} activeCount={3} />)

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('activeCount가 0이면 0을 표시한다', () => {
      render(<Footer {...defaultProps} activeCount={0} />)

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('"개 남음" 텍스트가 표시된다', () => {
      render(<Footer {...defaultProps} activeCount={2} />)

      expect(screen.getByText(/개 남음/)).toBeInTheDocument()
    })
  })

  describe('필터 버튼', () => {
    it('전체, 진행 중, 완료 버튼이 모두 렌더링된다', () => {
      render(<Footer {...defaultProps} />)

      expect(screen.getByText('전체')).toBeInTheDocument()
      expect(screen.getByText('진행 중')).toBeInTheDocument()
      expect(screen.getByText('완료')).toBeInTheDocument()
    })

    it('filter가 "all"이면 전체 버튼에만 active 클래스가 적용된다', () => {
      render(<Footer {...defaultProps} filter="all" />)

      expect(screen.getByText('전체')).toHaveClass('active')
      expect(screen.getByText('진행 중')).not.toHaveClass('active')
      expect(screen.getByText('완료')).not.toHaveClass('active')
    })

    it('filter가 "active"이면 진행 중 버튼에만 active 클래스가 적용된다', () => {
      render(<Footer {...defaultProps} filter="active" />)

      expect(screen.getByText('진행 중')).toHaveClass('active')
      expect(screen.getByText('전체')).not.toHaveClass('active')
      expect(screen.getByText('완료')).not.toHaveClass('active')
    })

    it('filter가 "completed"이면 완료 버튼에만 active 클래스가 적용된다', () => {
      render(<Footer {...defaultProps} filter="completed" />)

      expect(screen.getByText('완료')).toHaveClass('active')
      expect(screen.getByText('전체')).not.toHaveClass('active')
      expect(screen.getByText('진행 중')).not.toHaveClass('active')
    })

    it('전체 버튼 클릭 시 onFilterChange가 "all"과 함께 호출된다', async () => {
      const user = userEvent.setup()
      render(<Footer {...defaultProps} filter="active" />)

      await user.click(screen.getByText('전체'))

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('all')
    })

    it('진행 중 버튼 클릭 시 onFilterChange가 "active"와 함께 호출된다', async () => {
      const user = userEvent.setup()
      render(<Footer {...defaultProps} />)

      await user.click(screen.getByText('진행 중'))

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('active')
    })

    it('완료 버튼 클릭 시 onFilterChange가 "completed"와 함께 호출된다', async () => {
      const user = userEvent.setup()
      render(<Footer {...defaultProps} />)

      await user.click(screen.getByText('완료'))

      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('completed')
    })

    it('각 필터 버튼은 정확히 한 번씩 클릭 당 한 번 호출된다', async () => {
      const user = userEvent.setup()
      render(<Footer {...defaultProps} />)

      await user.click(screen.getByText('진행 중'))
      await user.click(screen.getByText('완료'))

      expect(defaultProps.onFilterChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('완료 항목 삭제 버튼', () => {
    it('completedCount가 0이면 완료 삭제 버튼이 표시되지 않는다', () => {
      render(<Footer {...defaultProps} completedCount={0} />)

      expect(screen.queryByText(/완료 삭제/)).not.toBeInTheDocument()
    })

    it('completedCount가 1 이상이면 완료 삭제 버튼이 표시된다', () => {
      render(<Footer {...defaultProps} completedCount={1} />)

      expect(screen.getByText(/완료 삭제/)).toBeInTheDocument()
    })

    it('완료 삭제 버튼에 completedCount 숫자가 표시된다', () => {
      render(<Footer {...defaultProps} completedCount={3} />)

      expect(screen.getByText(/완료 삭제 \(3\)/)).toBeInTheDocument()
    })

    it('완료 삭제 버튼 클릭 시 onClearCompleted가 호출된다', async () => {
      const user = userEvent.setup()
      render(<Footer {...defaultProps} completedCount={2} />)

      await user.click(screen.getByText(/완료 삭제/))

      expect(defaultProps.onClearCompleted).toHaveBeenCalledTimes(1)
    })
  })
})
