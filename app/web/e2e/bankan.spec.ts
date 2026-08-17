import { expect, test } from '@playwright/test';

test.describe('Bankan Board E2E Flow', () => {
    test('user can open modal, fill out add ticket form, and submit', async ({
        page,
    }) => {
        await page.goto('/');

        const addTicketBtn = page.locator('button', { hasText: '+ Add Ticket' });
        await addTicketBtn.click();

        const modalContent = page.locator('.modal-content');
        await expect(modalContent).toBeVisible();

        await page.fill(
            'input[placeholder="e.g., Fix login bug"]',
            'Add E2E Test Ticket'
        );
        await page.fill('input[name="priority"]', 'High');
        await page.fill(
            'textarea[placeholder="Details of the login bug..."]',
            'Testing end-to-end integration via Playwright.'
        );

        const submitBtn = page.locator('button', { hasText: 'Create Ticket' });
        await submitBtn.click();

        await expect(modalContent).not.toBeVisible();
        await expect(page.locator('text=Add E2E Test Ticket')).toBeVisible();
    });

    test('user can create a ticket and drag it from To Do to Done', async ({ page }) => {
        await page.goto('/');

        const addTicketBtn = page.locator('button', { hasText: '+ Add Ticket' });
        await addTicketBtn.click();

        const modalContent = page.locator('.modal-content');
        await expect(modalContent).toBeVisible();

        await page.fill(
            'input[placeholder="e.g., Fix login bug"]',
            'Drag/Drop E2E Test Ticket'
        );
        await page.fill('input[name="priority"]', 'High');
        await page.fill(
            'textarea[placeholder="Details of the login bug..."]',
            'Testing end-to-end integration via Playwright.'
        );

        const submitBtn = page.locator('button', { hasText: 'Create Ticket' });
        await submitBtn.click();

        await expect(modalContent).not.toBeVisible();

        const ticket = page.locator('text=Drag/Drop E2E Test Ticket');
        await expect(ticket).toBeVisible();

        const done = page.locator('text=Done');

        await ticket.hover();
        await page.mouse.down();

        await done.hover();
        await page.mouse.up();

        const doneColumn = page.locator('section, div').filter({
            has: page.getByText('Done'),
        });

        await expect(doneColumn.getByText('Drag/Drop E2E Test Ticket')).toBeVisible();
    });
});
