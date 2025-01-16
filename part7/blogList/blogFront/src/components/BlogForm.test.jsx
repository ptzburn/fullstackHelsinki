import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    const authorInput = screen.getByRole('textbox', { name: 'Author' })
    const urlInput = screen.getByRole('textbox', { name: 'URL' })
    const sendButton = screen.getByText('Add')

    await user.type(titleInput, 'Testing a Form')
    await user.type(authorInput, 'Matti Tester')
    await user.type(urlInput, 'https://www.vitest.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing a Form')
    expect(createBlog.mock.calls[0][0].author).toBe('Matti Tester')
    expect(createBlog.mock.calls[0][0].url).toBe('https://www.vitest.com')
})