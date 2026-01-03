import { test, expect } from '@playwright/test';

test('@doc Create a project and add your first task', async ({ page }) => {
    await test.step('Sign in', async () => {
        await page.goto('/login');
        await page.getByLabel('Email').fill('alex@example.com');
        await page.getByRole('button', { name: 'Sign in' }).click()
        await page.waitForURL(/\/projects/)
    });

    await test.step('Create a new project', async () => {
        await page.getByRole('link', { name: 'New project' }).click()
        await page.waitForURL(/\/projects\/new/)
        await page.getByLabel('Project name').fill('Website Redesign');
        await page.getByRole('button', { name: 'Create project' }).click()
        await page.waitForURL(/\/projects\/[^/]+/)
        await expect(page.getByRole('heading', { name: 'Website Redesign' })).toBeVisible();
    });

    await test.step('Add your first task', async () => {
        await page.getByRole('button', { name: 'Add task' }).click();
        await page.getByLabel('Task name').waitFor();
        await page.getByLabel('Task name').fill('Draft homepage layout');
        await page.getByRole('button', { name: 'Add task' }).click();
        await expect(page.getByText('Draft homepage layout')).toBeVisible();
    });
});
