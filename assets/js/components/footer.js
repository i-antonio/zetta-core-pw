export class Footer extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'app-footer';
        this.innerHTML = `
            <div class="container footer-container">
                <div class="footer-content">
                    <div>
                        <h3>Zetta Core</h3>
                        <p>Sua loja especializada em informática e tecnologia.</p>
                    </div>
                    <div>
                        <h4>Loja</h4>
                        <ul>
                            <li>Todos os Produtos</li>
                            <li>Categorias</li>
                            <li>Novidades</li>
                            <li>Promoções</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Suporte</h4>
                        <ul>
                            <li>Contato</li>
                            <li>Informações de Entrega</li>
                            <li>Trocas e Devoluções</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Empresa</h4>
                        <ul>
                            <li>Sobre Nós</li>
                            <li>Trabalhe Conosco</li>
                            <li>Política de Privacidade</li>
                            <li>Termos de Uso</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-copy">
                    <p>&copy; 2026 Zetta Core. Todos os direitos reservados.</p>
                </div>
            </div>
        `;
    }
}

customElements.define('app-footer', Footer)