import type { Page } from '@playwright/test';

export async function enableCursorOverlay(page: Page) {
    await page.addInitScript(() => {
        const cursor = document.createElement('div');
        cursor.id = '__doc_cursor';
        cursor.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 14px; height: 14px;
      border: 2px solid rgba(0,0,0,0.7);
      border-radius: 999px;
      transform: translate(-100px, -100px);
      pointer-events: none;
      z-index: 2147483647;
      box-sizing: border-box;
      background: rgba(255,255,255,0.6);
    `;
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(cursor));

        let lastX = -100, lastY = -100;
        const move = (x: number, y: number) => {
            lastX = x; lastY = y;
            const el = document.getElementById('__doc_cursor');
            if (el) el.style.transform = `translate(${x}px, ${y}px)`;
        };

        // Listen to real mouse movements when present
        window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY), { passive: true });

        // Click ripple
        window.addEventListener('mousedown', (e) => {
            lastX = e.clientX;
            lastY = e.clientY;
            const cursorEl = document.getElementById('__doc_cursor');
            if (cursorEl) cursorEl.style.transform = `translate(${lastX}px, ${lastY}px)`;
            const ring = document.createElement('div');
            ring.className = '__doc_click_ripple';
            ring.style.cssText = `
        position: fixed;
        width: 10px; height: 10px;
        border: 3px solid rgba(255,0,0,0.8);
        border-radius: 999px;
        left: ${lastX - 5}px;
        top: ${lastY - 5}px;
        pointer-events: none;
        z-index: 2147483647;
        animation: __doc_click 450ms ease-out forwards;
      `;
            document.body.appendChild(ring);
            const removeRing = () => {
                if (ring.parentNode) {
                    ring.remove();
                }
            };
            ring.addEventListener('animationend', removeRing);
            setTimeout(removeRing, 500);
        });

        const style = document.createElement('style');
        style.textContent = `
      @keyframes __doc_click {
        from { transform: scale(1); opacity: 0.9; }
        to { transform: scale(4); opacity: 0; }
      }
    `;
        document.head.appendChild(style);
    });
}
