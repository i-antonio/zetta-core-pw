import { products } from "./produtos.js";

const CART_STORAGE_KEY = 'app_carrinho';
const PURCHASE_HISTORY_KEY = 'app_historico_compras';

function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
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

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.querySelector('#cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }

  return { success: true, message: 'Produto adicionado ao carrinho.', cart };
}

function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== String(productId));
  saveCart(updatedCart);
  return { success: true, message: 'Produto removido do carrinho.', cart: updatedCart };
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === String(productId));

  if (!item) {
    return { success: false, message: 'Produto não encontrado no carrinho.' };
  }

  item.quantity = Number(quantity) > 0 ? Number(quantity) : 1;
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

function renderCart({ tableSelector = '#cartTable', totalSelector = '#cartTotal', countSelector = '#cartItemCount' } = {}) {
  const cart = getCart();
  const cartTable = document.querySelector(tableSelector);
  const totalElement = document.querySelector(totalSelector);
  const countElement = document.querySelector(countSelector);

  if (cartTable) {
    cartTable.innerHTML = '';
    cart.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>R$ ${item.price.toFixed(2)}</td>
        <td><input type="number" min="1" value="${item.quantity}" data-product-id="${item.id}" class="cart-quantity-input"></td>
        <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
        <td><button type="button" data-remove-id="${item.id}" class="remove-from-cart">Remover</button></td>
      `;
      cartTable.appendChild(row);
    });
  }

  if (totalElement) {
    totalElement.textContent = `Total: R$ ${getCartTotals().totalPrice.toFixed(2)}`;
  }

  if (countElement) {
    countElement.textContent = getCartTotals().totalItems;
  }
}

function connectCartActions(options = {}) {
  const addButtonSelector = options.addButtonSelector || '.add-to-cart';
  const checkoutButtonSelector = options.checkoutButtonSelector || '#checkoutButton';
  const cartTableSelector = options.cartTableSelector || '#cartTable';

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
      renderCart({ tableSelector: cartTableSelector });
    });
  });

  const checkoutButton = document.querySelector(checkoutButtonSelector);
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      const result = checkoutCart();
      alert(result.message);
      renderCart({ tableSelector: cartTableSelector });
    });
  }

  const cartTable = document.querySelector(cartTableSelector);
  if (cartTable) {
    cartTable.addEventListener('change', (event) => {
      const target = event.target;
      if (target.matches('.cart-quantity-input')) {
        const productId = target.dataset.productId;
        updateCartQuantity(productId, target.value);
        renderCart({ tableSelector: cartTableSelector });
      }
    });

    cartTable.addEventListener('click', (event) => {
      const target = event.target;
      if (target.matches('.remove-from-cart')) {
        const productId = target.dataset.removeId;
        removeFromCart(productId);
        renderCart({ tableSelector: cartTableSelector });
      }
    });
  }

  renderCart({ tableSelector: cartTableSelector });
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
  connectCartActions,
};
