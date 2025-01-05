import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import helper from './testHelper'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders only the title and author by default', () => {
	render(<Blog blog={helper.blog} user={helper.user} />)

	const titleAndAuthor = screen.getByText('Testing with Vite by Matti Tester')
	const url = screen.queryByTestId('url')
	const likes = screen.queryByTestId('likes')

	expect(titleAndAuthor).toBeDefined()
	expect(url).toBeNull()
	expect(likes).toBeNull()
})

test('renders all content when the View button is clicked', async () => {
	render(<Blog blog={helper.blog} user={helper.user} />)

	const user = userEvent.setup()
	const viewButton = screen.getByText('View')

	await user.click(viewButton)

	const titleAndAuthor = screen.getByText('Testing with Vite by Matti Tester')
	const url = screen.getByTestId('url')
	const likes = screen.getByTestId('likes')

	expect(titleAndAuthor).toBeDefined()
	expect(url).toHaveTextContent('https://www.vitest.com')
	expect(likes).toHaveTextContent('Likes: 10')
})

test('clicking the Like button twice calls event handler twice', async () => {
	const mockHandler = vi.fn()

	render(
		<Blog blog={helper.blog} user={helper.user} handleLike={mockHandler} />
	)

	const user = userEvent.setup()
	const viewButton = screen.getByText('View')

	await user.click(viewButton)

	const likeButton = screen.getByText('LIKE')

	await user.click(likeButton)
	await user.click(likeButton)

	expect(mockHandler.mock.calls).toHaveLength(2)
})