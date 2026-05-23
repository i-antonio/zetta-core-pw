export class ProductCard extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const data = this.getAttribute('data') ? JSON.parse(this.getAttribute('data')) : {};
        this.innerHTML = `
            <a href="/produto.html?id=${data.id}" class="product-card">
                <article class="card-container">
                    <div class="card-image-wrapper">
                        <img src="${data.imagem_url}" alt="${data.nome}" class="card-image">
                    </div>

                    <div class="card-content">
                        <span class="card-category">${data.categoria}</span>
                        <h3 class="card-title">${data.nome}</h3>
                        <p class="card-price">R$ ${data.preco.toFixed(2).replace('.', ',')}</p>
                    </div>

                    <div class="card-footer">
                        <button class="btn-primary add-to-cart" data-product-id="${data.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
                                <circle cx="8" cy="21" r="1"></circle>
                                <circle cx="19" cy="21" r="1"></circle>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                            </svg>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </article>
            </a>
        `;
    }
}

customElements.define('product-card', ProductCard)