const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, addBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                username: 'ptzburn',
                name: 'Milan Hokkanen',
                password: 'secret'
            }
        })

        await page.goto('/')
    })
    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('Login')
        await expect(locator).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'ptzburn', 'secret')
    
            await expect(page.getByText("You're logged in as: Milan Hokkanen")).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'ptzburn', 'wrong')
    
            await expect(page.getByTestId('notification')).toContainText('Wrong username or password')
            await expect(page.getByTestId('notification')).toHaveCSS('border-style', 'solid')
            await expect(page.getByTestId('notification')).toHaveCSS('color', 'rgb(255, 0, 0)')
    
            await expect(page.getByText("You're logged in as: Milan Hokkanen")).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'ptzburn', 'secret')
        })

        test('a new blog can be created', async ({ page }) => {
            await addBlog(page, 'Playwright Test', 'Tester', 'http://playwright.dev')

            await expect(page.getByTestId('Playwright Test')).toBeVisible()
        })

        test('an existing blog can be liked', async ({ page }) => {
            await addBlog(page, 'You will like it', 'Tester', 'http://playwright.dev')

            await page.getByRole('button', { name: 'View' }).click()

            await expect(page.getByTestId('likes')).toHaveText(/Likes: 0/)

            await page.getByRole('button', { name: 'LIKE' }).click()

            await expect(page.getByTestId('likes')).toHaveText(/Likes: 1/)
        })

        test('the user can delete their blog', async ({ page }) => {
            await addBlog(page, "You don't need it", 'Tester', 'http://playwright.dev')

            await expect(page.getByTestId("You don't need it")).toHaveText(/You don't need it by Tester/)

            await page.getByRole('button', { name: 'View' }).click()

            page.on('dialog', async (dialog) => {
                await dialog.accept();
            })

            await page.getByRole('button', { name: 'Delete' }).click()
            await page.waitForTimeout(100)
            await expect(page.getByText("You don't need it by TesterView")).not.toBeVisible()
        })

        test('user cannot see Delete button for others blogs', async ({ page, request }) => {
            await addBlog(page, 'You cannot delete it', 'Tester', 'http://playwright.dev')
            await page.getByRole('button', { name: 'logout' }).click()

            await request.post('/api/users', {
                data: {
                    username: 'tester',
                    name: 'Matti Tester',
                    password: 'secret'
                }
            })
            await loginWith(page, 'tester', 'secret')

            await page.getByRole('button', { name: 'View' }).click()

            await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
        })

        test('blogs are arranged according to likes', async ({ page }) => {
            await addBlog(page, 'No likes', 'Nyng', 'http://playwright.dev')
            await page.getByTestId('No likes').waitFor({ state: 'visible' })
            await addBlog(page, '1 like', 'Song', 'http://playwright.dev')
            await page.getByTestId('1 like').waitFor({ state: 'visible' })
            await addBlog(page, '2 likes', 'Sam', 'http://playwright.dev')
            await page.getByTestId('2 likes').waitFor({ state: 'visible' })

            const firstElement = await page.getByTestId('No likes')
            const secondElement = await page.getByTestId('1 like')
            const thirdElement = await page.getByTestId('2 likes')

            await secondElement.getByRole('button', { name: 'View' }).click()
            await secondElement.getByRole('button', { name: 'LIKE' }).click()

            await thirdElement.getByRole('button', { name: 'View' }).click()
            await thirdElement.getByRole('button', { name: 'LIKE' }).click()
            await expect(thirdElement).toHaveText(/Likes: 1/)
            await thirdElement.getByRole('button', { name: 'LIKE' }).click()
            await expect(thirdElement).toHaveText(/Likes: 2/)

            await page.reload()
            await expect(thirdElement).toHaveText(/2 likes by Sam/)

            const blogs = await page.getByTestId('blogs')
            const content = await blogs.evaluateAll(elements => elements.map(e => e.textContent))
            const formattedContent = content[0]
                .replace(/^Blogs/, '')
                .split(/View/)
                .map(blog => blog.trim())
                .filter(blog => blog !== '')
            console.log(formattedContent)

            expect(formattedContent).toEqual([
                '2 likes by Sam',
                '1 like by Song',
                'No likes by Nyng'
            ])
        })
    })
})