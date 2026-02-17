const products = [
  { id: 1, name: 'Campera Urban', category: 'Moda', price: 89999, oldPrice: 109999, rating: 4.5, stock: 4, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Auriculares Pro', category: 'Tecnología', price: 45999, oldPrice: 62999, rating: 4.2, stock: 1, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Lámpara Nordic', category: 'Hogar', price: 32999, oldPrice: 39999, rating: 4.8, stock: 2, img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80' }
];

const state = { cart: [] };
const grid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const drawer = document.getElementById('mobile-cart');

function money(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}

function toast(message, type = 'ok') {
  const root = document.getElementById('toast-root');
  const t = document.createElement('div');
  t.className = `toast ${type === 'error' ? 'error' : ''}`;
  t.textContent = message;
  root.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function render() {
  grid.innerHTML = products.map((p) => `
    <article class="card" aria-label="${p.name}">
      <div class="thumb-wrap loading">
        <span class="badge">${p.category}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async" />
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="rating" style="--rating:${p.rating}" aria-label="Calificación ${p.rating} de 5"></div>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <span class="price-old">${money(p.oldPrice)}</span>
        </div>
        <button class="add-btn" data-id="${p.id}" aria-label="Agregar ${p.name} al carrito">Agregar</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('img').forEach((img) => {
    img.addEventListener('load', () => img.closest('.thumb-wrap')?.classList.remove('loading'), { once: true });
  });
}

function updateCart() {
  cartCount.textContent = String(state.cart.length);
  cartItems.innerHTML = state.cart.length
    ? state.cart.map((item) => `<li>${item.name} · ${money(item.price)}</li>`).join('')
    : '<li>Tu carrito está vacío.</li>';
}

grid.addEventListener('click', (event) => {
  const btn = event.target.closest('.add-btn');
  if (!btn) return;
  const product = products.find((p) => p.id === Number(btn.dataset.id));
  if (!product) return;

  const addedQty = state.cart.filter((p) => p.id === product.id).length;
  if (addedQty >= product.stock) {
    toast('No hay más stock disponible.', 'error');
    return;
  }

  state.cart.push(product);
  updateCart();
  toast('Producto agregado al carrito.');
});

document.getElementById('cart-toggle').addEventListener('click', () => {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
});

document.getElementById('drawer-close').addEventListener('click', () => {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
});

render();
updateCart();
