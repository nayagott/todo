import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TodoInput } from './TodoInput'

const defaultProps = {
  onAdd: vi.fn(),
  onToggleAll: vi.fn(),
  hasItems: false,
  allCompleted: false,
}

describe('TodoInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('텍스트 입력', () => {
    it('텍스트 입력 후 Enter를 누르면 onAdd가 해당 텍스트와 함께 호출된다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} />)

      await user.type(screen.getByPlaceholderText('할 일을 입력하세요...'), '장보기{Enter}')

      expect(defaultProps.onAdd).toHaveBeenCalledTimes(1)
      expect(defaultProps.onAdd).toHaveBeenCalledWith('장보기', undefined)
    })

    it('빈 문자열로 Enter를 누르면 onAdd가 호출되지 않는다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} />)

      await user.click(screen.getByPlaceholderText('할 일을 입력하세요...'))
      await user.keyboard('{Enter}')

      expect(defaultProps.onAdd).not.toHaveBeenCalled()
    })

    it('공백만 입력하고 Enter를 누르면 onAdd가 호출되지 않는다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} />)

      await user.type(screen.getByPlaceholderText('할 일을 입력하세요...'), '   {Enter}')

      expect(defaultProps.onAdd).not.toHaveBeenCalled()
    })

    it('Enter 후 텍스트 입력 필드가 초기화된다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('할 일을 입력하세요...')
      await user.type(input, '장보기{Enter}')

      expect(input).toHaveValue('')
    })
  })

  describe('기한 입력', () => {
    it('기한을 설정하면 onAdd에 dueDate가 함께 전달된다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} />)

      await user.type(screen.getByPlaceholderText('할 일을 입력하세요...'), '장보기')
      fireEvent.change(screen.getByLabelText('기한 설정'), { target: { value: '2099-12-31' } })
      await user.keyboard('{Enter}')

      expect(defaultProps.onAdd).toHaveBeenCalledWith('장보기', '2099-12-31')
    })

    it('기한을 설정하지 않으면 onAdd에 dueDate가 undefined로 전달된다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} />)

      await user.type(screen.getByPlaceholderText('할 일을 입력하세요...'), '장보기{Enter}')

      expect(defaultProps.onAdd).toHaveBeenCalledWith('장보기', undefined)
    })

    it('Enter 후 기한 입력 필드가 초기화된다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} />)

      const dateInput = screen.getByLabelText('기한 설정')
      await user.type(screen.getByPlaceholderText('할 일을 입력하세요...'), '장보기')
      fireEvent.change(dateInput, { target: { value: '2099-12-31' } })
      await user.keyboard('{Enter}')

      expect(dateInput).toHaveValue('')
    })
  })

  describe('전체 토글 버튼', () => {
    it('hasItems가 false이면 전체 토글 버튼이 렌더링되지 않는다', () => {
      render(<TodoInput {...defaultProps} hasItems={false} />)

      expect(screen.queryByLabelText('Toggle all')).not.toBeInTheDocument()
    })

    it('hasItems가 true이면 전체 토글 버튼이 렌더링된다', () => {
      render(<TodoInput {...defaultProps} hasItems={true} />)

      expect(screen.getByLabelText('Toggle all')).toBeInTheDocument()
    })

    it('전체 토글 버튼 클릭 시 onToggleAll이 호출된다', async () => {
      const user = userEvent.setup()
      render(<TodoInput {...defaultProps} hasItems={true} />)

      await user.click(screen.getByLabelText('Toggle all'))

      expect(defaultProps.onToggleAll).toHaveBeenCalledTimes(1)
    })

    it('allCompleted가 true이면 전체 토글 버튼에 active 클래스가 적용된다', () => {
      render(<TodoInput {...defaultProps} hasItems={true} allCompleted={true} />)

      expect(screen.getByLabelText('Toggle all')).toHaveClass('active')
    })

    it('allCompleted가 false이면 전체 토글 버튼에 active 클래스가 없다', () => {
      render(<TodoInput {...defaultProps} hasItems={true} allCompleted={false} />)

      expect(screen.getByLabelText('Toggle all')).not.toHaveClass('active')
    })
  })
})
