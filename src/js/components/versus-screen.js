// Componente para la pantalla de VS
export class VersusScreen extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this._player1 = null
    this._player2 = null
    this._eventDispatched = false // Flag para controlar que el evento solo se dispare una vez
  }

  set player1(value) {
    this._player1 = value
    this.render()
  }

  get player1() {
    return this._player1
  }

  set player2(value) {
    this._player2 = value
    this.render()
  }

  get player2() {
    return this._player2
  }

  connectedCallback() {
    this.render()

    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      this.close()
    }, 3000)
  }

  render() {
    if (!this._player1 || !this._player2) {
      this.shadowRoot.innerHTML = `<div>Error: No se encontraron los personajes</div>`
      return
    }

    // Obtener los ataques y debilidades para mostrar en las tarjetas
    const player1Attacks = this._player1.ataques && this._player1.ataques.filter((a) => a.tipo === "ataque").slice(0, 2)
    const player1Attack = player1Attacks && player1Attacks.length > 0 ? player1Attacks[0].nombre : "Sin ataque"
    const player1Weakness =
      this._player1.debilidades && this._player1.debilidades.length > 0 ? this._player1.debilidades[0] : "Sin debilidad"

    const player2Attacks = this._player2.ataques && this._player2.ataques.filter((a) => a.tipo === "ataque").slice(0, 2)
    const player2Attack = player2Attacks && player2Attacks.length > 0 ? player2Attacks[0].nombre : "Sin ataque"
    const player2Weakness =
      this._player2.debilidades && this._player2.debilidades.length > 0 ? this._player2.debilidades[0] : "Sin debilidad"

    // Asegurarse de que las imágenes tengan valores predeterminados
    const player1Image = this._player1.imagen || "https://via.placeholder.com/400x300?text=PLAYER+1"
    const player2Image = this._player2.imagen || "https://via.placeholder.com/400x300?text=PLAYER+2"

    this.shadowRoot.innerHTML = `
      <style>
        :host { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          background-color: rgba(0, 0, 0, 0.8); 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          z-index: 1300;
          animation: fadeIn 0.5s ease-in-out;
          font-family: 'Arial', sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .versus-container {
          width: 90%;
          max-width: 1000px;
          height: 80%;
          max-height: 600px;
          background-color: #2e0a6c;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          box-shadow: 0 0 50px rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }
        
        .versus-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://via.placeholder.com/1000x600?text=BACKGROUND');
          background-size: cover;
          background-position: center;
          opacity: 0.1;
          z-index: -1;
        }
        
        .versus-title {
          position: absolute;
          top: 20px;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          z-index: 10;
          animation: titlePulse 2s infinite alternate;
        }
        
        @keyframes titlePulse {
          from { transform: scale(1); text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
          to { transform: scale(1.05); text-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
        }
        
        .versus-cards {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 20px;
          box-sizing: border-box;
        }
        
        .versus-card {
          width: 45%;
          height: 80%;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .player1-card {
          background-color: #ff3333;
          animation: cardInLeft 0.7s ease-out forwards;
          transform: translateX(-100%);
        }
        
        .player2-card {
          background-color: #ff9ecd;
          animation: cardInRight 0.7s ease-out forwards;
          transform: translateX(100%);
        }
        
        @keyframes cardInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes cardInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .card-image-container {
          width: 100%;
          height: 60%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .card-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
        }
        
        .card-content {
          padding: 20px;
          color: white;
        }
        
        .card-name {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .card-stats {
          font-size: 1rem;
        }
        
        .stat-row {
          margin-bottom: 5px;
        }
        
        .versus-symbol {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 5rem;
          font-weight: bold;
          color: #ffcc00;
          text-shadow: 
            0 0 10px rgba(255, 204, 0, 0.7),
            0 0 20px rgba(255, 204, 0, 0.5);
          z-index: 20;
          opacity: 0;
          animation: vsAppear 0.5s 0.7s forwards, vsAnimation 1s 1.2s infinite alternate;
        }
        
        @keyframes vsAppear {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes vsAnimation {
          from { transform: translate(-50%, -50%) scale(1); }
          to { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        .versus-image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: auto;
          z-index: 20;
          opacity: 0;
          animation: vsAppear 0.5s 0.7s forwards;
        }
      </style>
      
      <div class="versus-container">
        <div class="versus-title">SUPER SMASH BROS</div>
        
        <div class="versus-cards">
          <!-- Player 1 Card -->
          <div class="versus-card player1-card">
            <div class="card-image-container">
              <img class="card-image" src="${player1Image}" 
                   alt="${this._player1.nombre}" 
                   onerror="this.src='https://via.placeholder.com/400x300?text=PLAYER+1'">
            </div>
            <div class="card-content">
              <div class="card-name">${this._player1.nombre}</div>
              <div class="card-stats">
                <div class="stat-row">Fuerza: ${this._player1.fuerza || "N/A"}</div>
                <div class="stat-row">Ataque: ${player1Attack}</div>
                <div class="stat-row">Debilidad: ${player1Weakness}</div>
              </div>
            </div>
          </div>
          
          <!-- VS Symbol -->
          <div class="versus-symbol">VS</div>
          
          <!-- Player 2 Card -->
          <div class="versus-card player2-card">
            <div class="card-image-container">
              <img class="card-image" src="${player2Image}" 
                   alt="${this._player2.nombre}" 
                   onerror="this.src='https://via.placeholder.com/400x300?text=PLAYER+2'">
            </div>
            <div class="card-content">
              <div class="card-name">${this._player2.nombre}</div>
              <div class="card-stats">
                <div class="stat-row">Fuerza: ${this._player2.fuerza || "N/A"}</div>
                <div class="stat-row">Ataque: ${player2Attack}</div>
                <div class="stat-row">Debilidad: ${player2Weakness}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  close() {
    // Evitar que se dispare el evento más de una vez
    if (this._eventDispatched) return

    // Añadir animación de salida
    const container = this.shadowRoot.querySelector(".versus-container")
    if (container) {
      container.style.animation = "fadeOut 0.5s ease-in forwards"

      // Crear keyframes para la animación de salida
      const style = document.createElement("style")
      style.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `
      this.shadowRoot.appendChild(style)

      // Esperar a que termine la animación antes de remover
      setTimeout(() => {
        // Marcar que el evento ya se disparó
        this._eventDispatched = true

        // Disparar un evento personalizado antes de remover el elemento
        this.dispatchEvent(new CustomEvent("versus-complete"))
        this.remove()
      }, 500)
    } else {
      // Marcar que el evento ya se disparó
      this._eventDispatched = true

      // Disparar un evento personalizado antes de remover el elemento
      this.dispatchEvent(new CustomEvent("versus-complete"))
      this.remove()
    }
  }
}