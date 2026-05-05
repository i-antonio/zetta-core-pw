export class Footer extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.classList.add('app-footer');
    }
}

customElements.define('app-footer', Footer)