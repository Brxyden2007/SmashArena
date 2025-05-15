class NavButtons extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .navigation-buttons {
                    text-align: center;
                    margin: 40px 0;
                }
                .navigation-buttons button {
                    background-color: #ff4d4d;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    margin: 10px;
                    font-size: 1rem;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: background-color 0.3s ease;
                }
                .navigation-buttons button:hover {
                    background-color: #cc0000;
                }
            </style>
            <div class="navigation-buttons">
                <button id="go-to-brawlers">Ir a Brawlers</button>
                <button id="go-to-arena">Ir a la Arena</button>
            </div>
        `;
    }

    setupEvents() {
        const brawlersButton = this.shadowRoot.getElementById('go-to-brawlers');
        const arenaButton = this.shadowRoot.getElementById('go-to-arena');

        brawlersButton.addEventListener('click', () => {
            window.location.href = 'brawlers.html';
        });

        arenaButton.addEventListener('click', () => {
            window.location.href = 'arena.html';
        });
    }
}

customElements.define('nav-buttons', NavButtons);
