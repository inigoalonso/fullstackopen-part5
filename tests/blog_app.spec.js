// import axios from 'axios'
const { describe, test, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the DB here
    try {
      await request.post('/api/testing/reset')
      console.log('Database reset')
    }
    catch (error) {
      console.error(error)
      console.log('Error resetting the database')
    }

    // create a "tester" user for the backend here
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'tester',
        password: '420',
      }
    })
    // Check that the user was created
    const response = await request.get('/api/users')
    const users = await response.json()
    // console.log('users', users)

    await page.goto('/')
  })

  test('the blogs database is empty at start', async ({ page, request }) => {
    const response = await request.get('/api/blogs')
    // console.log('response status', response.status())
    expect(response.status()).toBe(200)

    const responseBody = await response.json();
    // console.log('response', responseBody);
    expect(responseBody).toEqual([]);
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('Blog App')).toBeVisible()
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('valid user can login', async ({ page }) => {
    try {
      await loginWith(page, 'tester', '420')
      // console.log('Test User logged-in in theory')
    }
    catch (error) {
      console.error(error)
    }
  
    // await expect(page.getByText('tester logged-in')).toBeVisible()
    await expect(page.getByTestId('notification')).toHaveText('Test User logged-in')
    // alternative 1
    // await expect(page.locator('text=tester logged-in')).toBeVisible()
    // alternative 2
    // const successDiv = await page.locator('.success')
    // await expect(successDiv).toContainText('tester logged-in')
  })

  test('invalid user cannot login', async ({ page }) => {
    await loginWith(page, 'tester', 'wrong')
  
    await expect(page.getByText('wrong username or password')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', '420')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'With a Great Title', 'tester', 'https://example.com')
      await expect(page.getByText('a new blog With a Great Title by Test User added')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'With a Great Title', 'tester', 'https://example.com')
      })

      test('user can like a blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Liked With a Great Title by Test User')).toBeVisible()
      })
    })
  })
})