import { getBrawlers } from './api.js';

class BrawlerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const brawler = JSON.parse(this.getAttribute('data-brawler'));
    this.shadowRoot.innerHTML = `
      <style>
        .card-container {
          perspective: 1000px;
          width: 250px;
          height: 350px;
        }

        .card {
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          position: relative;
        }

        .card.flip {
          transform: rotateY(180deg);
        }

        .front, .back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border: 1px solid #ccc;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background: white;
        }

        .back {
          transform: rotateY(180deg);
        }

        img {
          max-width: 100%;
          height: 150px;
          object-fit: contain;
        }

        button {
          margin-top: 10px;
          padding: 8px 12px;
          border: none;
          background-color: #007BFF;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }

        .info {
          text-align: center;
          font-size: 14px;
        }
      </style>

      <div class="card-container">
        <div class="card">
          <div class="front">
            <img src="${brawler.imagen}" alt="${brawler.nombre}">
            <h3>${brawler.nombreClave}</h3>
            <button class="info-btn">Info</button>
          </div>
          <div class="back">
            <div class="info">
              <h3>${brawler.nombre}</h3>
              <p>${brawler.descripcion}</p>
              <p><strong>Clave:</strong> ${brawler.nombreClave}</p>
              <p><strong>Trajes:</strong> ${brawler.trajes.join(', ')}</p>
              <button class="close-btn">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const card = this.shadowRoot.querySelector('.card');
    this.shadowRoot.querySelector('.info-btn').addEventListener('click', () => {
      card.classList.add('flip');
    });

    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
      card.classList.remove('flip');
    });
  }
}

customElements.define('brawler-card', BrawlerCard);

// 🔁 Cargar brawlers desde el servicio API
getBrawlers().then(brawlers => {
  const container = document.body;
  brawlers.forEach(brawler => {
    const card = document.createElement('brawler-card');
    card.setAttribute('data-brawler', JSON.stringify(brawler));
    container.appendChild(card);
  });
});