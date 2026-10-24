import { render, screen, fireEvent } from '@testing-library/react'
import NameForm from './NameForm.jsx'

const input = () => screen.getByPlaceholderText(/tên của bạn/i)
const button = () => screen.getByRole('button', { name: /vào quay quà/i })

test('nút bị vô hiệu khi tên rỗng hoặc chỉ khoảng trắng', () => {
  render(<NameForm onSubmit={() => {}} />)
  expect(button()).toBeDisabled()
  fireEvent.change(input(), { target: { value: '    ' } })
  expect(button()).toBeDisabled()
})

test('submit truyền tên đã trim', () => {
  const onSubmit = vi.fn()
  render(<NameForm onSubmit={onSubmit} />)
  fireEvent.change(input(), { target: { value: '  Lan ' } })
  fireEvent.click(button())
  expect(onSubmit).toHaveBeenCalledWith('Lan')
})

test('tên 50 ký tự được cắt còn 30', () => {
  const onSubmit = vi.fn()
  render(<NameForm onSubmit={onSubmit} />)
  fireEvent.change(input(), { target: { value: 'a'.repeat(50) } })
  fireEvent.click(button())
  expect(onSubmit.mock.calls[0][0]).toHaveLength(30)
})
