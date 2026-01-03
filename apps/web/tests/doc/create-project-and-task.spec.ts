import { test, expect } from '@playwright/test';
import { enableCursorOverlay } from '../helpers/cursorOverlay';

test('@doc Create a project and add your first task', async ({ page }) => {
    await enableCursorOverlay(page);

    await test.step('Sign in', async () => {
        await page.goto('/login');
        await page.getByLabel('Email').type('alex@example.com', { delay: 50 });
        const btn = page.getByRole('button', { name: 'Sign in' });
        const box = await btn.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
        }
        await btn.click({ delay: 150 });
        await page.waitForURL(/\/projects/)
    });

    await test.step('Create a new project', async () => {
        const link = page.getByRole('link', { name: 'New project' });
        const linkBox = await link.boundingBox();
        if (linkBox) {
            await page.mouse.move(linkBox.x + linkBox.width / 2, linkBox.y + linkBox.height / 2, { steps: 12 });
        }
        await link.click({ delay: 150 });
        await page.waitForURL(/\/projects\/new/)
        await page.getByLabel('Project name').type('Website Redesign', { delay: 50 });
        const btn = page.getByRole('button', { name: 'Create project' });
        const box = await btn.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
        }
        await btn.click({ delay: 150 });
        await page.waitForURL(/\/projects\/[^/]+/)
        await expect(page.getByRole('heading', { name: 'Website Redesign' })).toBeVisible();
    });

    await test.step('Add your first task', async () => {
        const btn = page.getByRole('button', { name: 'Add task' });
        const box = await btn.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
        }
        await btn.click({ delay: 150 });
        await page.getByLabel('Task name').waitFor();
        await page.getByLabel('Task name').type('Draft homepage layout', { delay: 50 });
        const btn2 = page.getByRole('button', { name: 'Add task' });
        const box2 = await btn2.boundingBox();
        if (box2) {
            await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2, { steps: 12 });
        }
        await btn2.click({ delay: 150 });
        await expect(page.getByText('Draft homepage layout')).toBeVisible();
    });
});
