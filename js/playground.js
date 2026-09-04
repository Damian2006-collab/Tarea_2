"use strict";
(function () {
    // ---------- Dialogs ----------
    // Comportamiento nativo del elemento <dialog> abierto con .showModal():
    // Escape lo cierra y el foco queda atrapado dentro mientras está abierto.
    // Acá reforzamos explícitamente que el foco vuelva al botón que lo abrió.
    function initDialogs() {
        const dialog = document.getElementById('dialog-confirmar-eliminar');
        const trigger = document.getElementById('btn-eliminar-recurso');
        if (!(dialog instanceof HTMLDialogElement) || !(trigger instanceof HTMLButtonElement))
            return;
        const cancelBtn = dialog.querySelector('[data-dialog-cancel]');
        const confirmBtn = dialog.querySelector('[data-dialog-confirm]');
        trigger.addEventListener('click', () => {
            dialog.showModal();
        });
        cancelBtn?.addEventListener('click', () => {
            dialog.close('cancel');
        });
        confirmBtn?.addEventListener('click', () => {
            dialog.close('confirm');
            showToast('Recurso eliminado correctamente.', 'success');
        });
        // Cubre el cierre por Escape, por Cancelar y por Eliminar: en los tres
        // casos el navegador dispara "close" y acá devolvemos el foco al trigger.
        dialog.addEventListener('close', () => {
            trigger.focus();
        });
    }
    function getMenuPairs() {
        const pairs = [];
        document.querySelectorAll('.c-menu-account-toggle').forEach((trigger) => {
            const menuId = trigger.getAttribute('aria-controls');
            const menu = menuId ? document.getElementById(menuId) : null;
            if (menu instanceof HTMLUListElement) {
                pairs.push({ trigger, menu });
            }
        });
        return pairs;
    }
    function isMenuOpen(pair) {
        return pair.trigger.getAttribute('aria-expanded') === 'true';
    }
    function openMenu(pair) {
        pair.menu.hidden = false;
        pair.trigger.setAttribute('aria-expanded', 'true');
    }
    function closeMenu(pair, returnFocusToTrigger) {
        pair.menu.hidden = true;
        pair.trigger.setAttribute('aria-expanded', 'false');
        if (returnFocusToTrigger)
            pair.trigger.focus();
    }
    function initMenus() {
        const pairs = getMenuPairs();
        pairs.forEach((pair) => {
            // Enter/Space activan el <button> de forma nativa y disparan "click".
            pair.trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                const wasOpen = isMenuOpen(pair);
                // Abrir un menú cierra cualquier otro que haya quedado abierto.
                pairs.forEach((other) => closeMenu(other, false));
                if (!wasOpen)
                    openMenu(pair);
            });
        });
        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape')
                return;
            pairs.forEach((pair) => {
                if (isMenuOpen(pair))
                    closeMenu(pair, true);
            });
        });
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Node))
                return;
            pairs.forEach((pair) => {
                if (!isMenuOpen(pair))
                    return;
                const clickedInside = pair.trigger.contains(target) || pair.menu.contains(target);
                if (!clickedInside)
                    closeMenu(pair, false);
            });
        });
    }
    const TOAST_DURATION_MS = 4000;
    const MAX_VISIBLE_TOASTS = 3;
    function getToastContainer() {
        return document.querySelector('.c-toast-container');
    }
    function showToast(message, variant) {
        const container = getToastContainer();
        if (!container)
            return;
        const existing = container.querySelectorAll('.c-toast');
        if (existing.length >= MAX_VISIBLE_TOASTS) {
            existing[0]?.remove();
        }
        const toast = document.createElement('div');
        toast.className = `c-toast c-toast--${variant}`;
        toast.setAttribute('role', 'status');
        const text = document.createElement('p');
        text.textContent = message;
        toast.appendChild(text);
        container.appendChild(toast);
        window.setTimeout(() => {
            toast.remove();
        }, TOAST_DURATION_MS);
    }
    function initToastDemoButtons() {
        const successBtn = document.getElementById('btn-demo-toast-success');
        const errorBtn = document.getElementById('btn-demo-toast-error');
        successBtn?.addEventListener('click', () => {
            showToast('Recurso guardado correctamente.', 'success');
        });
        errorBtn?.addEventListener('click', () => {
            showToast('No se pudo completar la acción.', 'error');
        });
    }
    initDialogs();
    initMenus();
    initToastDemoButtons();
})();
