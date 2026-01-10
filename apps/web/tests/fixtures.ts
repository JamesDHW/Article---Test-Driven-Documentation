import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createEnhancedLocator } from './helpers/enhancedLocator';
import { enableCursorOverlay } from './helpers/cursorOverlay';

export const test = base.extend<{
    page: Page & {
        enableCursorOverlay: () => Promise<void>;
    };
}>({
    page: async ({ page }, use, testInfo) => {
        const isDocMode = testInfo.project.name === 'docs';

        const enhancedPage = Object.create(page) as Page & {
            enableCursorOverlay: () => Promise<void>;
        };

        enhancedPage.enableCursorOverlay = async () => {
            if (isDocMode) {
                await enableCursorOverlay(page);
            }
        };

        const originalGetByRole = page.getByRole.bind(page);
        const originalGetByLabel = page.getByLabel.bind(page);
        const originalGetByText = page.getByText.bind(page);
        const originalGetByPlaceholder = page.getByPlaceholder.bind(page);
        const originalGetByTestId = page.getByTestId.bind(page);

        enhancedPage.getByRole = (
            role: Parameters<Page['getByRole']>[0],
            options?: Parameters<Page['getByRole']>[1]
        ) => {
            const locator = originalGetByRole(role, options);
            return createEnhancedLocator(locator, page, isDocMode);
        };

        enhancedPage.getByLabel = (
            text: Parameters<Page['getByLabel']>[0],
            options?: Parameters<Page['getByLabel']>[1]
        ) => {
            const locator = originalGetByLabel(text, options);
            return createEnhancedLocator(locator, page, isDocMode);
        };

        enhancedPage.getByText = (
            text: Parameters<Page['getByText']>[0],
            options?: Parameters<Page['getByText']>[1]
        ) => {
            const locator = originalGetByText(text, options);
            return createEnhancedLocator(locator, page, isDocMode);
        };

        enhancedPage.getByPlaceholder = (
            text: Parameters<Page['getByPlaceholder']>[0],
            options?: Parameters<Page['getByPlaceholder']>[1]
        ) => {
            const locator = originalGetByPlaceholder(text, options);
            return createEnhancedLocator(locator, page, isDocMode);
        };

        enhancedPage.getByTestId = (
            testId: Parameters<Page['getByTestId']>[0]
        ) => {
            const locator = originalGetByTestId(testId);
            return createEnhancedLocator(locator, page, isDocMode);
        };

        if (isDocMode) {
            await enableCursorOverlay(page);
        }

        await use(enhancedPage);
    },
});

export { expect } from '@playwright/test';

