export class Header extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add('app-header');
        this.innerHTML = `
            <div class="container">
                <div class="header-content">
                    <nav class="header-nav">
                        <a href="/index.html">Zetta Core</a>
                    </nav>
                    <div class="header-actions">
                        <span class="cart-count" id="cartCount">0</span>
                        <a href="/carrinho.html" class="header-cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="8" cy="21" r="1"></circle>
                                <circle cx="19" cy="21" r="1"></circle>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `;

        const cartItems = JSON.parse(localStorage.getItem('app_carrinho') || '[]');
        this.updateCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    }

    updateCartCount(count) {
        const cartCount = this.querySelector('#cartCount');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }
}

customElements.define('app-header', Header)