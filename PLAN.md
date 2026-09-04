# PLAN.md

Plan de producto para completar el flujo de Dami's Burguer, aprobado el 2026-08-18. Este archivo es la fuente de verdad del alcance acordado — antes de implementar algo que no esté acá, hay que actualizar este plan primero.

## Contexto del producto

- **Usuario final:** clientes locales de una hamburguesería, navegando mayormente desde el celular (el sitio ya es mobile-first), que llegan buscando decidir qué pedir y pedirlo.
- **Acción principal esperada:** "Hacer pedido" — el CTA vivía repetido en hero, nav y header de las 5 páginas; por decisión del 2026-08-22 se quitó de nav y header (quedaba redundante con el nuevo flujo del carrito en `menu.html`), y se mantiene solo en el hero de `index.html`. El plan sigue apuntando a convertirlo en un flujo real (aunque simulado) en vez de redirigir a un formulario de contacto genérico.
- **Acción secundaria:** dejar un mensaje por el formulario de contacto (consultas generales, no pedidos), o crear cuenta / iniciar sesión.

## Decisiones de alcance (ya acordadas)

- **Pedido simulado, no e-commerce real.** Carrito + checkout sin pasarela de pago ni servidor. Se confirma con un número de pedido simulado.
- **Sitio 100% estático.** Sin backend ni base de datos. Login, registro, carrito e "historial de pedidos" se resuelven con `localStorage` en el navegador — no hay persistencia entre dispositivos ni usuarios reales.
- **Contenido de ejemplo.** El menú completo y la historia de marca para `menu.html`/`nosotros.html` se redactan como contenido de ejemplo (mismo tono que `index.html`), pensado para reemplazarse después con datos reales del negocio.
- **Alcance académico.** Prioriza cerrar un recorrido coherente y demostrable con lo ya construido, sin abrir frentes que impliquen backend o pagos reales.
- **`precios.html`:** no existe en el proyecto ni está enlazada en ningún nav (se verificó con grep antes de escribir este plan). Se descarta del alcance — el precio de cada producto ya vive en las tarjetas del menú (`.menu-card .price`), no amerita una página aparte.

## Fase 1 — Cerrar el producto core

1. ✅ **`menu.html` con contenido real** — menú completo por categorías (Clásicas, BBQ, Veggie, Acompañamientos, Bebidas), 12 productos en total, reutilizando el diseño `.menu-card` ya existente en el CSS compartido.
2. ✅ **`nosotros.html` con contenido real** — historia de la marca, valores (`.value-grid`), "nuestro equipo" (`.team-grid`) — desarrollando el tono ya usado en la sección `#nosotros` de `index.html`.
3. **Flujo de pedido simulado** — parcialmente hecho:
   - ✅ Cada item del menú en `menu.html` suma un control de cantidad + "Agregar al pedido".
   - ✅ El carrito se guarda en `localStorage` (`damisburguer_carrito`), gestionado por `ts/carrito.ts`, con un resumen visible en `#tu-pedido` (agregar, quitar, vaciar, total).
   - ⬜ Página `pedido.html` todavía no existe: elegir retiro/entrega, datos de contacto, botón "Confirmar pedido".
   - ⬜ Estado de confirmación con número de pedido simulado — pendiente (depende de `pedido.html`).
   - ⬜ El botón "Hacer pedido" que queda (hero de `index.html`) sigue apuntando a `#contacto` — falta redirigirlo a `pedido.html` cuando exista. Los de nav/header se eliminaron (ver Contexto del producto).
   - El formulario de contacto se mantiene igual; falta aclarar en el copy que es para consultas generales, no para pedidos.

## Fase 2 — Completar lo que quedó a medias

4. **`cuenta.html`** simple post-login: saludo + "historial de pedidos" simulado desde `localStorage`.
5. **`privacidad.html` y `terminos.html`** con contenido real (genérico pero honesto) — corregir los enlaces `href="#"` del footer en las 5 páginas existentes.
6. **`404.html`** con el mismo header/nav/footer del resto del sitio.
7. ✅ **Testimonios:** ampliados de 1 a 3 reseñas en `index.html#testimonios` (`.testimonial-list`).
8. **Mapa de contacto:** reemplazar la foto estática (que hoy aparenta ser un mapa interactivo y no lo es) por un `<iframe>` real de Google Maps — sigue siendo 100% estático.
9. **Login:** agregar enlace "¿Olvidaste tu contraseña?" con una página simple que explica que es una demo sin backend.

## Fuera de alcance (explícito)

- Pagos reales o pasarela de checkout.
- Cuentas de usuario persistentes entre dispositivos.
- Página de precios independiente (ver decisión arriba).
- FAQ y enlaces reales de redes sociales — quedan pendientes salvo que se pida explícitamente más adelante.

## Estado

- [ ] Fase 1
- [ ] Fase 2

Este plan todavía no se ha ejecutado. La implementación empieza recién cuando se apruebe arrancar con la Fase 1 (o un ítem específico de ella).
