"use strict";
(function () {
    const nav = document.getElementById('menu-principal');
    if (!nav)
        return;
    const maybeList = nav.querySelector('ul');
    if (!maybeList)
        return;
    const list = maybeList;
    const links = Array.from(list.querySelectorAll('a'));
    if (links.length === 0)
        return;
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    pill.setAttribute('aria-hidden', 'true');
    list.prepend(pill);
    function getActiveLink() {
        return links.find((link) => link.getAttribute('aria-current') === 'page') || null;
    }
    function movePillTo(target) {
        const listRect = list.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        // Si el <nav> está oculto (menú móvil cerrado), el rect mide 0 — no
        // sirve de nada animar hacia ahí, se recalcula cuando se abra.
        if (targetRect.width === 0 && targetRect.height === 0)
            return;
        pill.style.width = `${targetRect.width}px`;
        pill.style.height = `${targetRect.height}px`;
        pill.style.transform = `translate(${targetRect.left - listRect.left}px, ${targetRect.top - listRect.top}px)`;
        pill.style.opacity = '1';
    }
    function showActivePill() {
        const active = getActiveLink();
        if (active) {
            movePillTo(active);
        }
        else {
            pill.style.opacity = '0';
        }
    }
    function placeInstantly(fn) {
        const previousTransition = pill.style.transition;
        pill.style.transition = 'none';
        fn();
        // Fuerza el reflow para que el navegador "vea" la posición sin
        // transición antes de reactivarla en el próximo frame.
        void pill.offsetWidth;
        pill.style.transition = previousTransition;
    }
    links.forEach((link) => {
        link.addEventListener('mouseenter', () => movePillTo(link));
        link.addEventListener('focus', () => movePillTo(link));
        link.addEventListener('click', () => movePillTo(link));
    });
    list.addEventListener('mouseleave', showActivePill);
    nav.addEventListener('focusout', (event) => {
        const related = event.relatedTarget;
        if (!(related instanceof Node) || !nav.contains(related)) {
            showActivePill();
        }
    });
    window.addEventListener('resize', () => {
        placeInstantly(showActivePill);
    });
    // El botón hamburguesa vive fuera de este archivo (script inline
    // existente); al abrir el menú móvil, el <nav> pasa de display:none a
    // visible recién ahí, así que recién ahí se puede medir su posición real.
    const toggleBtn = document.getElementById('btn-menu');
    toggleBtn?.addEventListener('click', () => {
        requestAnimationFrame(() => {
            placeInstantly(showActivePill);
        });
    });
    placeInstantly(showActivePill);
    window.addEventListener('load', () => placeInstantly(showActivePill));
    if ('fonts' in document) {
        document.fonts.ready.then(() => placeInstantly(showActivePill));
    }
})();
