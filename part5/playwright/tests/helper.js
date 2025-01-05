const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const addBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'Add a blog' }).click()
    await page.getByRole('textbox', { name: 'Title' }).fill(title)
    await page.getByRole('textbox', { name: 'Author' }).fill(author)
    await page.getByRole('textbox', { name: 'URL' }).fill(url)
    await page.getByRole('button', { name: 'Add' }).click()
}

export { loginWith, addBlog }