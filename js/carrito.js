"use strict";
(function () {
    const STORAGE_KEY = 'damisburguer_carrito';
    const MAX_QTY = 20;
    function readCart() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    function writeCart(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
    function formatPrice(value) {
        return `$${value.toFixed(2)}`;
    }
    function addToCart(id, name, price, quantity) {
        const items = readCart();
        const existing = items.find((item) => item.id === id);
        if (existing) {
            existing.quantity = Math.min(MAX_QTY, existing.quantity + quantity);
        }
        else {
            items.push({ id, name, price, quantity });
        }
        writeCart(items);
        renderCart();
    }
    function removeFromCart(id) {
        const items = readCart().filter((item) => item.id !== id);
        writeCart(items);
        renderCart();
    }
    function clearCart() {
        writeCart([]);
        renderCart();
    }
    function renderCart() {
        const list = document.getElementById('carrito-lista');
        const emptyMsg = document.getElementById('carrito-vacio');
        const totalEl = document.getElementById('carrito-total');
        const clearBtn = document.getElementById('carrito-vaciar');
        if (!list || !emptyMsg || !totalEl)
            return;
        const items = readCart();
        list.textContent = '';
        if (items.length === 0) {
            emptyMsg.hidden = false;
            totalEl.textContent = '';
            if (clearBtn instanceof HTMLElement)
                clearBtn.hidden = true;
            return;
        }
        emptyMsg.hidden = true;
        if (clearBtn instanceof HTMLElement)
            clearBtn.hidden = false;
        let total = 0;
        items.forEach((item) => {
            total += item.price * item.quantity;
            const li = document.createElement('li');
            li.className = 'cart-summary__item';
            const name = document.createElement('span');
            name.className = 'cart-summary__item-name';
            name.textContent = `${item.name} × ${item.quantity}`;
            const price = document.createElement('span');
            price.className = 'cart-summary__item-price';
            price.textContent = formatPrice(item.price * item.quantity);
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'cart-summary__remove';
            removeBtn.textContent = 'Quitar';
            removeBtn.setAttribute('aria-label', `Quitar ${item.name} del pedido`);
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            li.append(name, price, removeBtn);
            list.append(li);
        });
        totalEl.textContent = `Total: ${formatPrice(total)}`;
    }
    function initQuantityControls() {
        document.querySelectorAll('.menu-card').forEach((card) => {
            const minusBtn = card.querySelector('.qty-btn--minus');
            const plusBtn = card.querySelector('.qty-btn--plus');
            const input = card.querySelector('.qty-input');
            const addBtn = card.querySelector('.btn--add-to-cart');
            if (!minusBtn || !plusBtn || !input || !addBtn)
                return;
            minusBtn.addEventListener('click', () => {
                const current = parseInt(input.value, 10) || 1;
                input.value = String(Math.max(1, current - 1));
            });
            plusBtn.addEventListener('click', () => {
                const current = parseInt(input.value, 10) || 1;
                input.value = String(Math.min(MAX_QTY, current + 1));
            });
            input.addEventListener('change', () => {
                const current = parseInt(input.value, 10);
                if (!current || current < 1)
                    input.value = '1';
                else if (current > MAX_QTY)
                    input.value = String(MAX_QTY);
            });
            addBtn.addEventListener('click', () => {
                const id = addBtn.dataset.itemId;
                const name = addBtn.dataset.itemName;
                const price = Number(addBtn.dataset.itemPrice);
                const quantity = parseInt(input.value, 10) || 1;
                if (!id || !name || Number.isNaN(price))
                    return;
                addToCart(id, name, price, quantity);
                input.value = '1';
                const originalText = addBtn.textContent;
                addBtn.textContent = 'Agregado ✓';
                window.setTimeout(() => {
                    addBtn.textContent = originalText;
                }, 1200);
            });
        });
    }
    function initClearButton() {
        const clearBtn = document.getElementById('carrito-vaciar');
        if (clearBtn instanceof HTMLElement) {
            clearBtn.addEventListener('click', clearCart);
        }
    }
    initQuantityControls();
    initClearButton();
    renderCart();
})();
