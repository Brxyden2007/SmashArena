// Componente principal de la Arena
const API_URL = "http://localhost:3000/brawlers" // URL de la API

export class ArenaApp extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.brawlers = []
  }

  async connectedCallback() {
    try {
      // Cargar los datos de los brawlers desde la API
      const response = await fetch(API_URL)
      this.brawlers = await response.json()
      this.render()
    } catch (error) {
      console.error("Error cargando los datos:", error)
      this.shadowRoot.innerHTML = `<div style="color: red; padding: 20px;">Error cargando los datos: ${error.message}</div>`
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { 
          display: block; 
          font-family: 'Arial', sans-serif;
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
        }
        
        /* Estilos para el header de Smash Bros */
        .smash-header {
          background-color: #ff3333;
          color: white;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        
        .smash-logo {
          width: 50px;
          height: 50px;
          transition: transform 0.3s;
        }
        
        .smash-logo:hover {
          transform: scale(1.1);
        }
        
        .smash-nav {
          display: flex;
          gap: 50px;
        }
        
        .smash-nav-item {
          font-size: 20px;
          font-weight: bold;
          color: black;
          text-decoration: none;
          position: relative;
          transition: color 0.3s;
        }
        
        .smash-nav-item:hover {
          color: white;
        }
        
        .smash-nav-item::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 3px;
          background-color: white;
          transition: width 0.3s;
        }
        
        .smash-nav-item:hover::after {
          width: 100%;
        }
        
        /* Estilos para el contenido principal */
        .main {
           background: url(/img/backgroundArena.webp);
          background-repeat: no-repeat;
          background-size: cover;
          padding: 2rem;
          min-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }
        
        /* Estilos para las tarjetas de modo de juego */
        .mode-cards-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .mode-row {
          display: flex;
          justify-content: space-around;
          gap: 30px;
        }
        
        .mode-card {
          background-color: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
          width: 100%;
          max-width: 450px;
          position: relative;
        }
        
        .mode-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }
        
        .mode-card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s;
        }
        
        .mode-card:hover img {
          transform: scale(1.05);
        }
        
        .mode-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 30px;
          height: 30px;
          background-color: black;
          border-top-left-radius: 20px;
        }
        
        /* AnimaciÃ³n para las tarjetas */
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mode-card:nth-child(1) {
          animation: cardEntrance 0.5s ease-out 0.1s both;
        }
        
        .mode-card:nth-child(2) {
          animation: cardEntrance 0.5s ease-out 0.3s both;
        }
        
        .mode-row:last-child .mode-card {
          animation: cardEntrance 0.5s ease-out 0.5s both;
        }
      </style>
    
      <div class="main">
        <div class="mode-cards-container">
          <div class="mode-row">
            <div class="mode-card" id="pvp-mode">
              <img src="./img/mario-sonic.jpg" alt="Player vs Player" onerror="this.src='https://via.placeholder.com/450x200?text=MARIO+Y+SONIC'">
            </div>
            
            <div class="mode-card" id="pvc-mode">
              <img src="./img/kazuya-samus.jpg" alt="Player vs PC" onerror="this.src='https://via.placeholder.com/450x200?text=KAZUYA+Y+SAMUS'">
            </div>
          </div>
          
          <div class="mode-row" style="justify-content: center;">
            <div class="mode-card" id="cvc-mode" style="max-width: 600px;">
              <img src="./img/bayonetta-rob.jpg" alt="PC vs PC" onerror="this.src='https://via.placeholder.com/600x200?text=BAYONETTA+Y+ROB'">
            </div>
          </div>
        </div>
      </div>
    `

    // Agregar event listeners para los modos de juego
    this.shadowRoot.getElementById("pvp-mode").addEventListener("click", () => this.openSelectionModal("pvp"))
    this.shadowRoot.getElementById("pvc-mode").addEventListener("click", () => this.openSelectionModal("pvc"))
    this.shadowRoot.getElementById("cvc-mode").addEventListener("click", () => this.startCvcBattle())
  }

  openSelectionModal(mode) {
    const selectionModal = document.createElement("player-selection-modal")
    selectionModal.mode = mode
    selectionModal.brawlers = this.brawlers
    selectionModal.addEventListener("battle", (e) => {
      this.startBattle(e.detail.player1Id, e.detail.player2Id, mode)
    })
    document.body.appendChild(selectionModal)
  }

  startCvcBattle() {
    // Seleccionar dos brawlers aleatorios para el modo CvC
    const randomBrawler1 = this.getRandomBrawler()
    let randomBrawler2 = this.getRandomBrawler()
    // Asegurarse de que no sean el mismo
    while (randomBrawler2.id === randomBrawler1.id) {
      randomBrawler2 = this.getRandomBrawler()
    }

    // Mostrar la pantalla VS antes de iniciar la batalla
    this.showVersusScreen(randomBrawler1, randomBrawler2, () => {
      this.startBattle(randomBrawler1.id, randomBrawler2.id, "cvc")
    })
  }

  startBattle(player1Id, player2Id, mode) {
    const player1 = this.brawlers.find((b) => Number(b.id) === Number(player1Id))
    const player2 = this.brawlers.find((b) => Number(b.id) === Number(player2Id))

    // Mostrar la pantalla VS antes de iniciar la batalla
    this.showVersusScreen(player1, player2, () => {
      const battleModal = document.createElement("battle-modal")
      battleModal.player1 = player1
      battleModal.player2 = player2
      battleModal.mode = mode
      document.body.appendChild(battleModal)
    })
  }

  showVersusScreen(player1, player2, callback) {
    const versusScreen = document.createElement("versus-screen")
    versusScreen.player1 = player1
    versusScreen.player2 = player2

    // Usar un flag para asegurar que el callback solo se ejecute una vez
    let callbackExecuted = false

    versusScreen.addEventListener("versus-complete", () => {
      if (!callbackExecuted) {
        callbackExecuted = true
        callback()
      }
    })

    document.body.appendChild(versusScreen)
  }

  getRandomBrawler() {
    const randomIndex = Math.floor(Math.random() * this.brawlers.length)
    return this.brawlers[randomIndex]
  }
}
