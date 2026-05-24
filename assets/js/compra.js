import { products } from "./produtos.js";

const CART_STORAGE_KEY = 'app_carrinho';
const PURCHASE_HISTORY_KEY = 'app_historico_compras';

function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.querySelector('#cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

function getPurchaseHistory() {
  const raw = localStorage.getItem(PURCHASE_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePurchaseHistory(history) {
  localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(history));
}

function addToCart(product) {
  if (!product || !product.id) {
    return { success: false, message: 'Produto inválido.' };
  }

  const cart = getCart();
  const item = cart.find((entry) => entry.id === product.id);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      id: String(product.id),
      name: product.name || 'Produto',
      price: Number(product.price) || 0,
      quantity: 1,
    });
  }

  saveCart(cart);
  return { success: true, message: 'Produto adicionado ao carrinho.', cart };
}

function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== String(productId));
  saveCart(updatedCart);
  return { success: true, message: 'Produto removido do carrinho.', cart: updatedCart };
}

function updateCartQuantity(productId, action) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === String(productId));

  if (!item) {
    return { success: false, message: 'Produto não encontrado no carrinho.' };
  }

  if (action === 'increase') {
    item.quantity += 1;
  } else if (action === 'decrease') {
    if (item.quantity <= 1) {
      return removeFromCart(productId);
    }
    item.quantity = Math.max(1, item.quantity - 1);
  }

  saveCart(cart);
  return { success: true, message: 'Quantidade atualizada.', cart };
}

function clearCart() {
  saveCart([]);
}

function getCartTotals() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { cart, totalItems, totalPrice };
}

function checkoutCart() {
  const cart = getCart();
  if (cart.length === 0) {
    return { success: false, message: 'Carrinho vazio. Adicione produtos antes de finalizar.' };
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const purchase = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    items: cart,
    total: totalPrice,
  };

  const history = getPurchaseHistory();
  history.push(purchase);
  savePurchaseHistory(history);
  clearCart();

  return { success: true, message: 'Compra finalizada com sucesso!', purchase };
}

function renderCart({ tableSelector = '#cartContainer', totalSelector = '#cartTotal', countSelector = '#cartItemCount' } = {}) {
  const cart = getCart();
  const cartContainer = document.querySelector(tableSelector);
  const subTotalElement = document.querySelector('#cartSubtotal');
  const btnPayment = document.querySelector('#btnPay');
  const totalElement = document.querySelector(totalSelector);
  const countElement = document.querySelector(countSelector);

  if (cartContainer) {
    cartContainer.innerHTML = '';
    cart.forEach((item) => {
      const cartItem = document.createElement('div')
      const product = products.find(p => String(p.id) === String(item.id));
      if (product) {
        item.image = product.imagem_url;
        item.category = product.categoria;
      }
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.image || ''}" alt="${item.name}" class="item-img">
        <div class="item-info">
            <div class="item-text">
                <h2 class="item-name">${item.name}</h2>
                <p class="item-category">${item.category || ''}</p>
            </div>
            
            <div class="qty-control">
                <button class="qty-btn cart-quantity-input minus" data-product-id="${item.id}">&minus;</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn cart-quantity-input plus" data-product-id="${item.id}">&plus;</button>
            </div>
        </div>

        <div class="item-price-action">
            <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
            <button class="remove-btn" data-product-id="${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Excluir
            </button>
        </div>
      `;
      cartContainer.appendChild(cartItem);
    });
  }

  const getPrice = getCartTotals().totalPrice.toFixed(2).replace('.', ',');
  if (subTotalElement) {
    subTotalElement.textContent = `R$ ${getPrice}`;
  }

  if (totalElement) {
    totalElement.textContent = `R$ ${getPrice}`;
  }

  if (btnPayment) {
    btnPayment.textContent = `Pagar R$ ${getPrice}`;
  }

  if (countElement) {
    countElement.textContent = getCartTotals().totalItems;
  }
}

function renderSummary({ containerSelector = '#summary-product-list' } = {}) {
  const cart = getCart();
  const summaryContainer = document.querySelector(containerSelector);

  if (summaryContainer) {
    summaryContainer.innerHTML = '';
    cart.forEach((item) => {
      const summaryItem = document.createElement('div');
      summaryItem.classList.add('summary-product');
      summaryItem.innerHTML = `
        <span>${item.name} &times; ${item.quantity}</span>
        <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
      `;
      summaryContainer.appendChild(summaryItem);
    });
  }
}

function connectCartActions(options = {}) {
  const addButtonSelector = options.addButtonSelector || '.add-to-cart';
  const formCheckoutSelector = options.formCheckoutSelector || '#checkoutForm';
  const cartContainerSelector = options.cartContainerSelector || '#cartContainer';

  document.querySelectorAll(addButtonSelector).forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const productId = button.dataset.productId;
      const product = products.find((p) => String(p.id) === String(productId));

      if (!product) {
        alert('Produto não encontrado.');
        return;
      }

      const result = addToCart({
        id: productId,
        name: product.nome,
        price: Number(product.preco),
      });

      alert(result.message);
      renderCart({ tableSelector: cartContainerSelector });
    });
  });

  const checkoutForm = document.querySelector(formCheckoutSelector);
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const result = checkoutCart();
      alert(result.message);
      renderCart({ tableSelector: cartContainerSelector });
      window.location.href = 'index.html';
    });
  }

  const cartContainer = document.querySelector(cartContainerSelector);
  if (cartContainer) {
    cartContainer.addEventListener('click', (event) => {
      const target = event.target;
      if (target.matches('.remove-btn')) {
        const productId = target.dataset.productId;
        removeFromCart(productId);
        renderCart({ tableSelector: cartContainerSelector });
      } else if (target.matches('.cart-quantity-input')) {
        const productId = target.dataset.productId;
        const action = target.classList.contains('plus') ? 'increase' : 'decrease';
        updateCartQuantity(productId, action);
        renderCart({ tableSelector: cartContainerSelector });
      }
    });
  }

  renderCart({ tableSelector: cartContainerSelector });
  renderSummary();
}

window.cartStore = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getCartTotals,
  checkoutCart,
  getPurchaseHistory,
  renderCart,
  renderSummary,
  connectCartActions,
};
