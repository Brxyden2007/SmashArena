import { getBrawlers } from "./api.js" // Asegurar para mostrar los brawlers tenga el json.server activo

class BrawlerCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    const brawler = JSON.parse(this.getAttribute("data-brawler"))

    // Determinar el color de fondo basado en el personaje
    const cardColor = this.getCardColor(brawler.nombre)

    this.shadowRoot.innerHTML = `
      <style>
        .card-container {
          perspective: 1000px;
          width: 250px;
          height: 350px;
          margin: 0 auto;
        }

        .card {
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          position: relative;
        }

        .front, .back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
        }

        .front {
          background-color: ${cardColor};
          padding: 20px;
          justify-content: space-between;
          align-items: center;
        }

        .back {
          background-color: ${cardColor};
          transform: rotateY(180deg);
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brawler-name {
          font-size: 24px;
          text-align: center;
          margin-bottom: 10px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
          color: white;
        }

        img {
          max-width: 80%;
          height: auto;
          object-fit: contain;
          margin: 10px auto;
          max-height: 180px; /* Limitar altura de la imagen */
        }

        .info {
          font-size: 14px;
          color: white;
          flex-grow: 1;
          overflow-y: auto;
          margin-bottom: 15px;
        }

        .info h3 {
          font-size: 24px;
          text-align: center;
          margin-bottom: 15px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
        }

        .info p {
          margin-bottom: 10px;
        }

        .section-title {
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 5px;
          border-bottom: 1px solid rgba(255,255,255,0.3);
          padding-bottom: 5px;
        }

        ul {
          list-style-type: disc;
          padding-left: 20px;
          margin-bottom: 10px;
        }

        li {
          margin-bottom: 5px;
        }

        .strength-bar {
          width: 100%;
          height: 10px;
          background-color: rgba(255,255,255,0.3);
          border-radius: 5px;
          margin-top: 5px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          width: ${brawler.fuerza}%;
          background-color: white;
          border-radius: 5px;
        }

        .info-btn, .close-btn {
          background-color: #007BFF;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
          align-self: center;
          width: 100px;
          text-align: center;
        }

        .info-btn:hover, .close-btn:hover {
          background-color: #0056b3;
        }
        
        .close-btn {
          background-color: #dc3545;
          margin-top: 10px;
        }
        
        .close-btn:hover {
          background-color: #c82333;
        }
        
        .button-container {
          display: flex;
          justify-content: center;
        }
      </style>

      <div class="card-container">
        <div class="card">
          <div class="front">
            <h3 class="brawler-name">${brawler.nombre}</h3>
            <img src="${brawler.imagen}" alt="${brawler.nombre}">
            <div class="button-container">
              <button class="info-btn">Info</button>
            </div>
          </div>
          <div class="back">
            <div class="info">
              <h3>${brawler.nombre}</h3>
              <p>${brawler.descripcion}</p>
              
              <div class="section-title">Poderes:</div>
              <ul>
                ${brawler.ataques
                  .map(
                    (ataque) => `
                  <li>${ataque.nombre} ${ataque.tipo === "ataque" ? `(${ataque.daño} daño)` : `(${ataque.efecto})`}</li>
                `,
                  )
                  .join("")}
              </ul>
              
              <div class="section-title">Debilidades:</div>
              <ul>
                ${brawler.debilidades.map((debilidad) => `<li>${debilidad}</li>`).join("")}
              </ul>
              
              <div class="section-title">Fuerza: ${brawler.fuerza}/100</div>
              <div class="strength-bar">
                <div class="strength-fill"></div>
              </div>
            </div>
            <div class="button-container">
              <button class="close-btn">Close</button>
            </div>
          </div>
        </div>
      </div>
    `

    // Añadir evento al botón Info para voltear la tarjeta
    const infoBtn = this.shadowRoot.querySelector(".info-btn")
    const closeBtn = this.shadowRoot.querySelector(".close-btn")
    const card = this.shadowRoot.querySelector(".card")

    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      card.style.transform = "rotateY(180deg)"
    })

    // Usar el botón Close para volver a la parte frontal
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      card.style.transform = ""
    })
  }

  // Función para determinar el color de la tarjeta basado en el personaje
  getCardColor(nombre) {
    const colorMap = {
      Mario: "#e53935", // Rojo
      Link: "#43a047", // Verde
      Yoshi: "#7cb342", // Verde claro
      Kirby: "#ff80ab", // Rosa
      Peach: "#f06292", // Rosa claro
      Bayonetta: "#5e35b1", // Púrpura
      "Pac-Man": "#ffb300", // Amarillo
      Sonic: "#1976d2", // Azul
      Samus: "#fb8c00", // Naranja
      Pikachu: "#fdd835", // Amarillo claro
      Kazuya: "#424242", // Gris oscuro
      Sephiroth: "#263238", // Casi negro
    }

    return colorMap[nombre] || "#9e9e9e" // Color gris por defecto si no se encuentra
  }
}

customElements.define("brawler-card", BrawlerCard)

// Función para manejar el menú hamburguesa
function setupMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const menu = document.querySelector(".menu")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("active")
    })
  }
}

// Cargar brawlers desde el servicio API
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu()

  // Limpiar el contenido existente
  const header = document.querySelector("header")
  const existingCard = document.querySelector("brawler-card")

  if (existingCard) {
    existingCard.remove()
  }

  getBrawlers()
    .then((brawlers) => {
      const container = document.getElementById("brawlers-container")
      brawlers.forEach((brawler) => {
        const card = document.createElement("brawler-card")
        card.setAttribute("data-brawler", JSON.stringify(brawler))
        container.appendChild(card)
      })
    })
    .catch((error) => {
      console.error("Error al cargar los brawlers:", error)
      const container = document.getElementById("brawlers-container")
      const errorMsg = document.createElement("div")
      errorMsg.textContent = "Error al cargar los brawlers. Failed to Fetch. Asegúrate de que el servidor JSON esté activo."
      errorMsg.style.color = "red"
      errorMsg.style.padding = "10px"
      errorMsg.style.fontSize = "32px"
      errorMsg.style.textAlign = "left"
      errorMsg.style.marginLeft = "-320px"
      errorMsg.style.fontWeight = "800"
      errorMsg.style.whiteSpace = "pre"
      container.appendChild(errorMsg)
    })
})