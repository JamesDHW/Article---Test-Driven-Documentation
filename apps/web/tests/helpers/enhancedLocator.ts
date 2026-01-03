import type { Locator, Page } from '@playwright/test';

export function createEnhancedLocator(
    locator: Locator,
    page: Page,
    isDocMode: boolean
): Locator {
    if (!isDocMode) {
        return locator;
    }

    return new Proxy(locator, {
        get(target, prop) {
            if (prop === 'click') {
                return async (options?: Parameters<Locator['click']>[0]) => {
                    const box = await target.boundingBox();
                    if (box) {
                        await page.mouse.move(
                            box.x + box.width / 2,
                            box.y + box.height / 2,
                            { steps: 12 }
                        );
                    }
                    return target.click({ ...options, delay: options?.delay ?? 150 });
                };
            }
            if (prop === 'type') {
                return async (
                    text: string,
                    options?: Parameters<Locator['type']>[1]
                ) => {
                    return target.type(text, { ...options, delay: options?.delay ?? 50 });
                };
            }
            return (target as any)[prop];
        },
    }) as Locator;
}

