export class Footer extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.id = 'app-footer';
        this.innerHTML = `testesteste`;
    }
}

customElements.define('app-footer', Footer)