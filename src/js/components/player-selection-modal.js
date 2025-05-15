// Componente para el modal de selección de jugadores
export class PlayerSelectionModal extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: "open" })
      this.player1Selection = null
      this.player2Selection = null
      this._brawlers = []
    }
  
    get mode() {
      return this.getAttribute("mode")
    }
  
    set mode(value) {
      this.setAttribute("mode", value)
    }
  
    set brawlers(value) {
      this._brawlers = value
      this.render()
    }
  
    get brawlers() {
      return this._brawlers
    }
  
    connectedCallback() {
      this.render()
    }
  
    render() {
      const player1Brawler = this.player1Selection ? this.getCharacterById(this.player1Selection) : null
      const player2Brawler = this.player2Selection ? this.getCharacterById(this.player2Selection) : null
  
      this.shadowRoot.innerHTML = `
        <style>
          :host { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
          .modal { background-color: white; border-radius: 8px; padding: 2rem; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; }
          .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
          .modal-title { font-size: 1.5rem; font-weight: bold; }
          .close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
          .players-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
          .player-selection { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; }
          .player-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; text-align: center; }
          .character-display { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; background-color: #f5f5f5; border-radius: 8px; margin-bottom: 1rem; }
          .character-image { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem; }
          .character-name { font-weight: bold; }
          .no-character { color: #999; }
          .button-group { display: flex; justify-content: center; gap: 0.5rem; }
          button { padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
          .primary-button { background-color: #4a90e2; color: white; }
          .secondary-button { background-color: #e2e2e2; color: #333; }
          .fight-button { background-color: #ff3333; color: white; padding: 0.75rem 2rem; font-size: 1.2rem; margin-top: 1rem; }
          .actions { display: flex; justify-content: flex-end; gap: 1rem; }
          .disabled { opacity: 0.5; cursor: not-allowed; }
        </style>
        
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Selección de Personajes</div>
            <button class="close-button" id="close-button">&times;</button>
          </div>
          
          <div class="players-container">
            <!-- Player 1 Selection -->
            <div class="player-selection">
              <div class="player-title">Jugador 1</div>
              <div class="character-display" id="player1-display">
                ${
                  player1Brawler
                    ? `
                  <img class="character-image" src="${player1Brawler.imagen || "https://via.placeholder.com/120"}" alt="${player1Brawler.nombre}" onerror="this.src='https://via.placeholder.com/120'">
                  <div class="character-name">${player1Brawler.nombre}</div>
                `
                    : `
                  <div class="no-character">Ningún personaje seleccionado</div>
                `
                }
              </div>
              <div class="button-group">
                <button class="primary-button" id="player1-select">Elegir Carta</button>
                <button class="secondary-button" id="player1-random">Random</button>
              </div>
            </div>
            
            ${
              this.mode === "pvp"
                ? `
              <!-- Player 2 Selection (only for PVP mode) -->
              <div class="player-selection">
                <div class="player-title">Jugador 2</div>
                <div class="character-display" id="player2-display">
                  ${
                    player2Brawler
                      ? `
                    <img class="character-image" src="${player2Brawler.imagen || "https://via.placeholder.com/120"}" alt="${player2Brawler.nombre}" onerror="this.src='https://via.placeholder.com/120'">
                    <div class="character-name">${player2Brawler.nombre}</div>
                  `
                      : `
                    <div class="no-character">Ningún personaje seleccionado</div>
                  `
                  }
                </div>
                <div class="button-group">
                  <button class="primary-button" id="player2-select">Elegir Carta</button>
                  <button class="secondary-button" id="player2-random">Random</button>
                </div>
              </div>
            `
                : `
              <!-- PC Selection (for PVC mode) -->
              <div class="player-selection">
                <div class="player-title">PC</div>
                <div class="character-display">
                  <div class="no-character">Selección aleatoria</div>
                </div>
                <div class="button-group" style="justify-content: center;">
                  <div style="text-align: center; color: #666; font-size: 0.9rem;">
                    La PC elegirá un personaje aleatorio
                  </div>
                </div>
              </div>
            `
            }
          </div>
          
          <div class="actions">
            <button class="secondary-button" id="cancel-button">Cancelar</button>
            <button class="fight-button ${this.canFight() ? "" : "disabled"}" id="fight-button" ${this.canFight() ? "" : "disabled"}>
              ¡LUCHAR!
            </button>
          </div>
        </div>
      `
  
      // Agregar event listeners
      this.addEventListeners()
    }
  
    addEventListeners() {
      this.shadowRoot.getElementById("close-button").addEventListener("click", () => this.close())
      this.shadowRoot.getElementById("cancel-button").addEventListener("click", () => this.close())
  
      this.shadowRoot.getElementById("player1-select").addEventListener("click", () => this.openBrawlerSelection(1))
      this.shadowRoot.getElementById("player1-random").addEventListener("click", () => this.selectRandomBrawler(1))
  
      if (this.mode === "pvp") {
        this.shadowRoot.getElementById("player2-select").addEventListener("click", () => this.openBrawlerSelection(2))
        this.shadowRoot.getElementById("player2-random").addEventListener("click", () => this.selectRandomBrawler(2))
      }
  
      const fightButton = this.shadowRoot.getElementById("fight-button")
      if (fightButton) {
        fightButton.addEventListener("click", () => this.startBattle())
      }
    }
  
    getCharacterById(id) {
      // Asegurarse de que id sea un número para la comparación
      const numericId = typeof id === "string" ? Number.parseInt(id, 10) : id
  
      // Buscar el personaje y asegurarse de que existe
      const character = this.brawlers.find((b) => Number(b.id) === numericId)
  
      // Devolver el personaje o un objeto vacío si no se encuentra
      return character || {}
    }
  
    canFight() {
      if (this.mode === "pvp") {
        return this.player1Selection && this.player2Selection
      } else {
        return this.player1Selection
      }
    }
  
    openBrawlerSelection(playerNumber) {
      const brawlerModal = document.createElement("brawler-selection-modal")
      brawlerModal.brawlers = this.brawlers
      brawlerModal.addEventListener("select", (e) => {
        if (playerNumber === 1) {
          this.player1Selection = e.detail.brawlerId
        } else {
          this.player2Selection = e.detail.brawlerId
        }
        this.render()
      })
      document.body.appendChild(brawlerModal)
    }
  
    selectRandomBrawler(playerNumber) {
      const randomIndex = Math.floor(Math.random() * this.brawlers.length)
      const randomBrawlerId = this.brawlers[randomIndex].id
  
      if (playerNumber === 1) {
        this.player1Selection = randomBrawlerId
      } else {
        this.player2Selection = randomBrawlerId
      }
  
      this.render()
    }
  
    startBattle() {
      if (!this.canFight()) return
  
      let player2Id = this.player2Selection
  
      // Si es modo PVC, seleccionar un brawler aleatorio para el PC
      if (this.mode === "pvc") {
        const randomIndex = Math.floor(Math.random() * this.brawlers.length)
        player2Id = this.brawlers[randomIndex].id
      }
  
      // Disparar evento para iniciar la batalla
      this.dispatchEvent(
        new CustomEvent("battle", {
          detail: {
            player1Id: this.player1Selection,
            player2Id: player2Id,
          },
        }),
      )
  
      this.close()
    }
  
    close() {
      this.remove()
    }
  }