// Componente para el modal de batalla
export class BattleModal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.battleState = {
      player1Health: 100,
      player2Health: 100,
      logs: [],
      currentTurn: "player1",
      round: 1,
      gameOver: false,
      // Nuevas propiedades para el sistema de defensa mejorado
      player1DefenseCooldown: 0,
      player2DefenseCooldown: 0,
      player1DefenseActive: false,
      player2DefenseActive: false,
      player1DefenseEffect: null,
      player2DefenseEffect: null,
      // Flag para controlar si hay un efecto en curso
      effectInProgress: false,
    }
  }

  set player1(value) {
    this._player1 = value
  }

  get player1() {
    return this._player1
  }

  set player2(value) {
    this._player2 = value
  }

  get player2() {
    return this._player2
  }

  set mode(value) {
    this._mode = value
  }

  get mode() {
    return this._mode || "pvp"
  }

  connectedCallback() {
    this.render()
  }

  render() {
    if (!this.player1 || !this.player2) {
      this.shadowRoot.innerHTML = `<div>Error: No se encontraron los personajes</div>`
      return
    }

    // Obtener los ataques y defensa de cada jugador
    const player1Attacks = this.player1.ataques && this.player1.ataques.filter((a) => a.tipo === "ataque").slice(0, 2)
    const player1Defense = this.player1.ataques && this.player1.ataques.find((a) => a.tipo === "defensa")

    const player2Attacks = this.player2.ataques && this.player2.ataques.filter((a) => a.tipo === "ataque").slice(0, 2)
    const player2Defense = this.player2.ataques && this.player2.ataques.find((a) => a.tipo === "defensa")

    // Generar HTML para los logs de batalla
    let logsHTML = ""
    this.battleState.logs.forEach((log) => {
      logsHTML += `<div class="log-entry">${log}</div>`
    })

    if (logsHTML === "") {
      logsHTML = `<div class="log-entry">¡El combate está a punto de comenzar! Turno del Jugador 1.</div>`
    }

    // Determinar si hay un ganador
    let winnerHTML = ""
    if (this.battleState.gameOver) {
      let winnerName = ""
      if (this.battleState.player1Health <= 0) {
        winnerName = this.player2.nombre
      } else if (this.battleState.player2Health <= 0) {
        winnerName = this.player1.nombre
      } else if (this.battleState.player1Health > this.battleState.player2Health) {
        winnerName = this.player1.nombre
      } else if (this.battleState.player2Health > this.battleState.player1Health) {
        winnerName = this.player2.nombre
      } else {
        winnerHTML = `
          <div class="winner-announcement">
            <div class="winner-text">¡El combate ha terminado en empate!</div>
          </div>
        `
        winnerName = ""
      }

      if (winnerName) {
        winnerHTML = `
          <div class="winner-announcement">
            <div class="winner-text">¡${winnerName} ha ganado el combate!</div>
          </div>
        `
      }
    }

    // Determinar qué controles de acción mostrar según el modo y el turno actual
    let player1ActionsHTML = ""
    let player2ActionsHTML = ""

    // En modo PvP, mostrar controles para el jugador que tiene el turno
    if (this.mode === "pvp" || this.mode === "pvc") {
      if (this.battleState.currentTurn === "player1" && !this.battleState.gameOver) {
        // Verificar si la defensa está en cooldown
        const defenseDisabled = this.battleState.player1DefenseCooldown > 0
        const defenseCooldownText = defenseDisabled ? `(Cooldown: ${this.battleState.player1DefenseCooldown})` : ""

        player1ActionsHTML = `
          <div class="action-controls">
            <div class="action-title">Elige tu acción:</div>
            <div class="action-buttons">
              <button class="action-button attack-button" data-action="attack1">${player1Attacks && player1Attacks[0] ? player1Attacks[0].nombre : "Ataque 1"}</button>
              <button class="action-button attack-button" data-action="attack2">${player1Attacks && player1Attacks[1] ? player1Attacks[1].nombre : "Ataque 2"}</button>
              <button class="action-button defense-button ${defenseDisabled ? "disabled" : ""}" 
                      data-action="defense" ${defenseDisabled ? "disabled" : ""}>
                ${player1Defense ? player1Defense.nombre : "Defensa"} ${defenseCooldownText}
              </button>
            </div>
          </div>
        `
      }
    }

    // Para player2ActionsHTML, cuando es modo PvP:
    if (this.mode === "pvp") {
      if (this.battleState.currentTurn === "player2" && !this.battleState.gameOver) {
        // Verificar si la defensa está en cooldown
        const defenseDisabled = this.battleState.player2DefenseCooldown > 0
        const defenseCooldownText = defenseDisabled ? `(Cooldown: ${this.battleState.player2DefenseCooldown})` : ""

        player2ActionsHTML = `
          <div class="action-controls">
            <div class="action-title">Elige tu acción:</div>
            <div class="action-buttons">
              <button class="action-button attack-button" data-action="attack1">${player2Attacks && player2Attacks[0] ? player2Attacks[0].nombre : "Ataque 1"}</button>
              <button class="action-button attack-button" data-action="attack2">${player2Attacks && player2Attacks[1] ? player2Attacks[1].nombre : "Ataque 2"}</button>
              <button class="action-button defense-button ${defenseDisabled ? "disabled" : ""}" 
                      data-action="defense" ${defenseDisabled ? "disabled" : ""}>
                ${player2Defense ? player2Defense.nombre : "Defensa"} ${defenseCooldownText}
              </button>
            </div>
          </div>
        `
      }
    }
    // En modo PvC, mostrar controles solo para el jugador 1
    else if (this.mode === "pvc") {
      if (this.battleState.currentTurn === "player1" && !this.battleState.gameOver) {
        // Verificar si la defensa está en cooldown
        const defenseDisabled = this.battleState.player1DefenseCooldown > 0
        const defenseCooldownText = defenseDisabled ? `(Cooldown: ${this.battleState.player1DefenseCooldown})` : ""

        player1ActionsHTML = `
          <div class="action-controls">
            <div class="action-title">Elige tu acción:</div>
            <div class="action-buttons">
              <button class="action-button attack-button" data-action="attack1">${player1Attacks && player1Attacks[0] ? player1Attacks[0].nombre : "Ataque 1"}</button>
              <button class="action-button attack-button" data-action="attack2">${player1Attacks && player1Attacks[1] ? player1Attacks[1].nombre : "Ataque 2"}</button>
              <button class="action-button defense-button ${defenseDisabled ? "disabled" : ""}" 
                      data-action="defense" ${defenseDisabled ? "disabled" : ""}>
                ${player1Defense ? player1Defense.nombre : "Defensa"} ${defenseCooldownText}
              </button>
            </div>
          </div>
        `
      }
    }
    // En modo CvC, mostrar un botón para avanzar el turno
    else if (this.mode === "cvc" && !this.battleState.gameOver) {
      player1ActionsHTML = `
        <div class="action-controls">
          <button class="action-button next-turn-button" id="next-turn-button">Siguiente Turno</button>
        </div>
      `
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal { 
          background-color: white; 
          border-radius: 16px; 
          padding: 2rem; 
          width: 90%; 
          max-width: 900px; 
          max-height: 90vh; 
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .modal-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 1rem;
        }
        .modal-title { 
          font-size: 1.8rem; 
          font-weight: bold;
          color: #ff3333;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .close-button { 
          background: none; 
          border: none; 
          font-size: 1.8rem; 
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }
        .close-button:hover {
          color: #ff3333;
        }
        .battle-container { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 2rem; 
          margin-bottom: 2rem;
        }
        .fighter { 
          border: 1px solid #ddd; 
          border-radius: 12px; 
          padding: 1.5rem; 
          display: flex; 
          flex-direction: column; 
          align-items: center;
          background-color: #f9f9f9;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .fighter.active-turn { 
          box-shadow: 0 0 20px #ffcc00;
          transform: translateY(-5px);
          background-color: #fffbeb;
        }
        .fighter-image-container {
          width: 140px;
          height: 140px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          border: 3px solid white;
          background-color: #f0f0f0;
          margin-bottom: 1rem;
        }
        .fighter-image { 
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .fighter-name { 
          font-weight: bold; 
          font-size: 1.4rem; 
          margin-bottom: 0.25rem;
          color: #ff3333;
        }
        .fighter-codename { 
          color: #666; 
          font-size: 1rem; 
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .health-bar-container { 
          width: 100%; 
          height: 24px; 
          background-color: #f0f0f0; 
          border-radius: 12px; 
          overflow: hidden; 
          margin-bottom: 0.5rem;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        .health-bar { 
          height: 100%; 
          background: linear-gradient(to right, #4caf50, #8bc34a); 
          transition: width 0.5s;
          border-radius: 12px;
        }
        .health-text { 
          font-size: 1rem;
          font-weight: bold;
          color: #555;
        }
        .battle-log { 
          border: 1px solid #ddd; 
          border-radius: 12px; 
          padding: 1.5rem; 
          max-height: 200px; 
          overflow-y: auto; 
          margin-bottom: 1.5rem;
          background-color: #f5f5f5;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
        }
        .log-title { 
          font-weight: bold; 
          margin-bottom: 1rem;
          color: #333;
          font-size: 1.2rem;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
        }
        .log-entry { 
          font-size: 0.95rem; 
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          border-radius: 6px;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .log-entry:nth-child(odd) {
          background-color: #f9f9f9;
        }
        .winner-announcement { 
          background-color: #fff9c4; 
          border-radius: 12px; 
          padding: 1.5rem; 
          text-align: center; 
          margin-bottom: 1.5rem;
          box-shadow: 0 5px 15px rgba(255, 204, 0, 0.2);
          animation: winnerPulse 2s infinite alternate;
        }
        @keyframes winnerPulse {
          from { box-shadow: 0 5px 15px rgba(255, 204, 0, 0.2); }
          to { box-shadow: 0 5px 25px rgba(255, 204, 0, 0.5); }
        }
        .winner-text { 
          font-size: 1.5rem; 
          font-weight: bold;
          color: #ff9800;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .actions { 
          display: flex; 
          justify-content: flex-end; 
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }
        button { 
          padding: 0.7rem 1.2rem; 
          border-radius: 8px; 
          border: none; 
          cursor: pointer; 
          font-weight: bold;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .primary-button { 
          background-color: #4a90e2; 
          color: white;
        }
        .primary-button:hover {
          background-color: #3a80d2;
        }
        .secondary-button { 
          background-color: #e2e2e2; 
          color: #333;
        }
        .secondary-button:hover {
          background-color: #d0d0d0;
        }
        .action-controls { 
          margin-top: 1.5rem;
          width: 100%;
        }
        .action-title { 
          font-weight: bold; 
          margin-bottom: 0.8rem;
          color: #555;
          text-align: center;
        }
        .action-buttons { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 0.8rem;
          justify-content: center;
        }
        .action-button { 
          padding: 0.7rem 1.2rem; 
          border-radius: 8px; 
          border: none; 
          cursor: pointer; 
          font-weight: bold;
          transition: transform 0.2s, box-shadow 0.2s;
          min-width: 120px;
        }
        .attack-button { 
          background-color: #ff6b6b; 
          color: white;
        }
        .attack-button:hover {
          background-color: #ff5252;
        }
        .defense-button { 
          background-color: #4d96ff; 
          color: white;
        }
        .defense-button:hover {
          background-color: #3a85ff;
        }
        .next-turn-button { 
          background-color: #6bcb77; 
          color: white; 
          width: 100%;
        }
        .next-turn-button:hover {
          background-color: #5ab866;
        }
        .disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
          pointer-events: none;
        }
      </style>
      
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">¡Combate! - Ronda ${this.battleState.round}</div>
          <button class="close-button" id="close-button">&times;</button>
        </div>
        
        <div class="battle-container">
          <!-- Player 1 -->
          <div class="fighter ${this.battleState.currentTurn === "player1" ? "active-turn" : ""}">
            <div class="fighter-image-container">
              <img class="fighter-image" src="${this.player1.imagen || "https://via.placeholder.com/140"}" alt="${this.player1.nombre}" onerror="this.src='https://via.placeholder.com/140'">
            </div>
            <div class="fighter-name">${this.player1.nombre}</div>
            <div class="fighter-codename">${this.player1.nombreClave || ""}</div>
            
            <div class="health-bar-container">
              <div class="health-bar" id="player1-health-bar" style="width: ${this.battleState.player1Health}%"></div>
            </div>
            <div class="health-text" id="player1-health-text">Salud: ${this.battleState.player1Health}%</div>
            
            ${player1ActionsHTML}
          </div>
          
          <!-- Player 2 -->
          <div class="fighter ${this.battleState.currentTurn === "player2" ? "active-turn" : ""}">
            <div class="fighter-image-container">
              <img class="fighter-image" src="${this.player2.imagen || "https://via.placeholder.com/140"}" alt="${this.player2.nombre}" onerror="this.src='https://via.placeholder.com/140'">
            </div>
            <div class="fighter-name">${this.player2.nombre}</div>
            <div class="fighter-codename">${this.player2.nombreClave || ""}</div>
            
            <div class="health-bar-container">
              <div class="health-bar" id="player2-health-bar" style="width: ${this.battleState.player2Health}%"></div>
            </div>
            <div class="health-text" id="player2-health-text">Salud: ${this.battleState.player2Health}%</div>
            
            ${player2ActionsHTML}
          </div>
        </div>
        
        <!-- Battle Log -->
        <div class="battle-log" id="battle-log">
          <div class="log-title">Registro de Combate</div>
          ${logsHTML}
        </div>
        
        ${winnerHTML}
        
        <div class="actions">
          ${
            this.battleState.gameOver
              ? `
            <button class="secondary-button" id="restart-button">Reiniciar Combate</button>
          `
              : ""
          }
          <button class="primary-button" id="close-battle-button">Cerrar</button>
        </div>
      </div>
    `

    // Agregar event listeners
    this.shadowRoot.getElementById("close-button").addEventListener("click", () => this.close())
    this.shadowRoot.getElementById("close-battle-button").addEventListener("click", () => this.close())

    if (this.battleState.gameOver) {
      const restartButton = this.shadowRoot.getElementById("restart-button")
      if (restartButton) {
        restartButton.addEventListener("click", () => this.restartBattle())
      }
    }

    // Agregar event listeners para los botones de acción
    const actionButtons = this.shadowRoot.querySelectorAll(".action-button")
    actionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Evitar acciones si hay un efecto en curso
        if (this.battleState.effectInProgress) return

        const action = e.target.dataset.action
        if (action) {
          this.handleAction(action)
        } else if (e.target.id === "next-turn-button") {
          this.handleCvcTurn()
        }
      })
    })

    // Si es modo CvC y es el primer render, iniciar automáticamente
    if (this.mode === "cvc" && this.battleState.logs.length === 0) {
      setTimeout(() => this.handleCvcTurn(), 1000)
    }

    // Si es modo PvC y es turno de la PC, y es el primer turno o después de un reinicio
    // (solo queremos que se ejecute automáticamente si no viene después de un ataque del jugador)
    if (
      this.mode === "pvc" &&
      this.battleState.currentTurn === "player2" &&
      !this.battleState.gameOver &&
      this.battleState.logs.length <= 1
    ) {
      setTimeout(() => this.handleComputerTurn(), 1000)
    }
  }

  handleAction(action) {
    // Marcar que hay un efecto en curso para evitar acciones simultáneas
    this.battleState.effectInProgress = true

    const currentPlayer = this.battleState.currentTurn === "player1" ? this.player1 : this.player2
    const otherPlayer = this.battleState.currentTurn === "player1" ? this.player2 : this.player1

    let actionResult = ""
    let damage = 0
    let showEffect = true

    // Verificar si la defensa está en cooldown
    if (action === "defense") {
      const cooldown =
        this.battleState.currentTurn === "player1"
          ? this.battleState.player1DefenseCooldown
          : this.battleState.player2DefenseCooldown

      if (cooldown > 0) {
        actionResult = `${currentPlayer.nombre} no puede usar defensa (Cooldown: ${cooldown}).`
        showEffect = false
      }
    }

    // Procesar la acción si no hay restricciones
    if (showEffect) {
      // Determinar la acción y su resultado
      if (action === "attack1" || action === "attack2") {
        const attackIndex = action === "attack1" ? 0 : 1
        const attacks = currentPlayer.ataques && currentPlayer.ataques.filter((a) => a.tipo === "ataque")
        const attack =
          attacks && attacks.length > attackIndex ? attacks[attackIndex] : { nombre: "Ataque básico", daño: 10 }

        // Verificar si el oponente tiene una defensa activa
        const opponentDefenseActive =
          this.battleState.currentTurn === "player1"
            ? this.battleState.player2DefenseActive
            : this.battleState.player1DefenseActive

        const opponentDefenseEffect =
          this.battleState.currentTurn === "player1"
            ? this.battleState.player2DefenseEffect
            : this.battleState.player1DefenseEffect

        // Calcular daño basado en la fuerza del personaje
        damage = Math.floor((attack.daño || 10) * ((currentPlayer.fuerza || 50) / 100))

        // Aplicar efectos de defensa si están activos
        if (opponentDefenseActive) {
          // Diferentes efectos según el tipo de defensa
          switch (opponentDefenseEffect) {
            case "esquivar":
              actionResult = `${currentPlayer.nombre} ataca con ${attack.nombre}, pero ${otherPlayer.nombre} esquiva el ataque!`
              damage = 0
              break
            case "reducir":
              const reducción = Math.floor(damage * 0.5) // Reducir el daño en un 50%
              damage -= reducción
              actionResult = `${currentPlayer.nombre} ataca con ${attack.nombre} causando ${damage} de daño (reducido en ${reducción}).`
              break
            case "contraatacar":
              // El oponente recibe daño pero también causa daño al atacante
              const contraataque = Math.floor(damage * 0.3) // 30% del daño original
              actionResult = `${currentPlayer.nombre} ataca con ${attack.nombre} causando ${damage} de daño, pero ${otherPlayer.nombre} contraataca causando ${contraataque} de daño!`

              // Aplicar daño al atacante
              if (this.battleState.currentTurn === "player1") {
                this.battleState.player1Health = Math.max(0, this.battleState.player1Health - contraataque)
              } else {
                this.battleState.player2Health = Math.max(0, this.battleState.player2Health - contraataque)
              }
              break
            default:
              actionResult = `${currentPlayer.nombre} ataca con ${attack.nombre} causando ${damage} de daño.`
          }

          // Desactivar la defensa después de usarla
          if (this.battleState.currentTurn === "player1") {
            this.battleState.player2DefenseActive = false
          } else {
            this.battleState.player1DefenseActive = false
          }
        } else {
          actionResult = `${currentPlayer.nombre} ataca con ${attack.nombre} causando ${damage} de daño.`
        }

        // Aplicar daño al oponente
        if (this.battleState.currentTurn === "player1") {
          this.battleState.player2Health = Math.max(0, this.battleState.player2Health - damage)
        } else {
          this.battleState.player1Health = Math.max(0, this.battleState.player1Health - damage)
        }

        // Mostrar efecto visual
        this.showEffectModal(currentPlayer.nombre, "attack", attack.nombre, () => {
          // Este callback se ejecutará cuando el modal de efecto se cierre

          // Actualizar la UI después del efecto
          this.battleState.effectInProgress = false

          // Verificar si hay un ganador
          this.checkGameState()

          // Solo necesitamos hacer algo especial si es el turno del jugador en modo PvC
          if (this.mode === "pvc" && this.battleState.currentTurn === "player2" && !this.battleState.gameOver) {
            setTimeout(() => this.handleComputerTurn(), 1000)
          }
        })
      } else if (action === "defense") {
        const defenses = currentPlayer.ataques && currentPlayer.ataques.filter((a) => a.tipo === "defensa")
        const defense =
          defenses && defenses.length > 0 ? defenses[0] : { nombre: "Defensa básica", efecto: "Reduce el daño" }

        // Determinar el efecto de la defensa según el nombre o efecto
        let defenseEffect = "reducir" // Efecto por defecto

        // Analizar el nombre o efecto de la defensa para determinar su tipo
        const defenseLower = (defense.nombre + " " + (defense.efecto || "")).toLowerCase()

        if (defenseLower.includes("esquiv") || defenseLower.includes("evasion") || defenseLower.includes("evasión")) {
          defenseEffect = "esquivar"
        } else if (defenseLower.includes("contra") || defenseLower.includes("reflej")) {
          defenseEffect = "contraatacar"
        } else if (
          defenseLower.includes("reduc") ||
          defenseLower.includes("protec") ||
          defenseLower.includes("escudo")
        ) {
          defenseEffect = "reducir"
        }

        // Activar la defensa
        if (this.battleState.currentTurn === "player1") {
          this.battleState.player1DefenseActive = true
          this.battleState.player1DefenseEffect = defenseEffect
          this.battleState.player1DefenseCooldown = 3 // Cooldown de 2 turnos + el turno actual
        } else {
          this.battleState.player2DefenseActive = true
          this.battleState.player2DefenseEffect = defenseEffect
          this.battleState.player2DefenseCooldown = 3 // Cooldown de 2 turnos + el turno actual
        }

        actionResult = `${currentPlayer.nombre} utiliza ${defense.nombre} (${this.getDefenseEffectDescription(defenseEffect)}).`

        // Mostrar efecto visual
        this.showEffectModal(currentPlayer.nombre, "defense", defense.nombre, () => {
          // Este callback se ejecutará cuando el modal de efecto se cierre

          // Actualizar la UI después del efecto
          this.battleState.effectInProgress = false

          // Verificar si hay un ganador
          this.checkGameState()

          // Solo necesitamos hacer algo especial si es el turno del jugador en modo PvC
          if (this.mode === "pvc" && this.battleState.currentTurn === "player2" && !this.battleState.gameOver) {
            setTimeout(() => this.handleComputerTurn(), 1000)
          }
        })
      }
    } else {
      // Si no se muestra efecto, actualizar directamente
      this.battleState.effectInProgress = false

      // Agregar el resultado al log
      this.battleState.logs.push(actionResult)

      // Verificar si hay un ganador
      this.checkGameState()
    }
  }

  // Método para verificar el estado del juego y actualizar la UI
  checkGameState() {
    // Verificar si hay un ganador
    if (this.battleState.player1Health <= 0 || this.battleState.player2Health <= 0) {
      this.battleState.gameOver = true

      if (this.battleState.player1Health <= 0) {
        this.battleState.logs.push(`¡${this.player2.nombre} ha ganado el combate!`)
      } else if (this.battleState.player2Health <= 0) {
        this.battleState.logs.push(`¡${this.player1.nombre} ha ganado el combate!`)
      }
    } else {
      // Cambiar el turno
      this.battleState.currentTurn = this.battleState.currentTurn === "player1" ? "player2" : "player1"

      // Si es el inicio de un nuevo turno del jugador 1, incrementar la ronda
      if (this.battleState.currentTurn === "player1") {
        this.battleState.round++

        // Reducir cooldowns al inicio de cada ronda
        if (this.battleState.player1DefenseCooldown > 0) {
          this.battleState.player1DefenseCooldown--
        }
        if (this.battleState.player2DefenseCooldown > 0) {
          this.battleState.player2DefenseCooldown--
        }
      }

      // Verificar si se alcanzó el límite de rondas (10)
      if (this.battleState.round > 10) {
        this.battleState.gameOver = true

        if (this.battleState.player1Health > this.battleState.player2Health) {
          this.battleState.logs.push(`¡${this.player1.nombre} ha ganado el combate por mayor salud restante!`)
        } else if (this.battleState.player2Health > this.battleState.player1Health) {
          this.battleState.logs.push(`¡${this.player2.nombre} ha ganado el combate por mayor salud restante!`)
        } else {
          this.battleState.logs.push("¡El combate ha terminado en empate!")
        }
      }
    }

    // Actualizar la UI
    this.render()
  }

  // Método para obtener la descripción del efecto de defensa
  getDefenseEffectDescription(effect) {
    switch (effect) {
      case "esquivar":
        return "Esquiva el próximo ataque"
      case "reducir":
        return "Reduce el daño del próximo ataque en un 50%"
      case "contraatacar":
        return "Devuelve un 30% del daño recibido"
      default:
        return "Efecto desconocido"
    }
  }

  // Método para mostrar el modal de efectos
  showEffectModal(characterName, actionType, actionName, callback = null) {
    const effectModal = document.createElement("effect-modal")
    effectModal.character = characterName
    effectModal.actionType = actionType
    effectModal.actionName = actionName

    // Si hay un callback, añadimos un event listener para cuando se cierre el modal
    if (callback) {
      effectModal.addEventListener("effect-complete", callback)
    }

    // Agregar el resultado al log antes de mostrar el efecto
    const currentPlayer = this.battleState.currentTurn === "player1" ? this.player1 : this.player2
    const actionTypeText = actionType === "defense" ? "utiliza" : "ataca con"
    const actionResult = `${currentPlayer.nombre} ${actionTypeText} ${actionName}.`
    this.battleState.logs.push(actionResult)

    document.body.appendChild(effectModal)
  }

  handleComputerTurn() {
    // No hacer nada si hay un efecto en curso
    if (this.battleState.effectInProgress) return

    // Verificar si la defensa está en cooldown
    const canUseDefense = this.battleState.player2DefenseCooldown === 0

    // La PC elige una acción aleatoria (70% ataque, 30% defensa si está disponible)
    let randomAction

    if (canUseDefense) {
      randomAction = Math.random() < 0.7 ? (Math.random() < 0.5 ? "attack1" : "attack2") : "defense"
    } else {
      // Si la defensa está en cooldown, solo puede atacar
      randomAction = Math.random() < 0.5 ? "attack1" : "attack2"
    }

    this.handleAction(randomAction)
  }

  handleCvcTurn() {
    // No hacer nada si hay un efecto en curso
    if (this.battleState.effectInProgress) return

    // Verificar si la defensa está en cooldown para el jugador actual
    const canUseDefense =
      this.battleState.currentTurn === "player1"
        ? this.battleState.player1DefenseCooldown === 0
        : this.battleState.player2DefenseCooldown === 0

    // Elegir acción aleatoria
    let randomAction

    if (canUseDefense) {
      randomAction = Math.random() < 0.7 ? (Math.random() < 0.5 ? "attack1" : "attack2") : "defense"
    } else {
      // Si la defensa está en cooldown, solo puede atacar
      randomAction = Math.random() < 0.5 ? "attack1" : "attack2"
    }

    this.handleAction(randomAction)
  }

  restartBattle() {
    this.battleState = {
      player1Health: 100,
      player2Health: 100,
      logs: [],
      currentTurn: "player1",
      round: 1,
      gameOver: false,
      // Reiniciar también los estados de defensa
      player1DefenseCooldown: 0,
      player2DefenseCooldown: 0,
      player1DefenseActive: false,
      player2DefenseActive: false,
      player1DefenseEffect: null,
      player2DefenseEffect: null,
      effectInProgress: false,
    }

    this.render()
  }

  close() {
    this.remove()
  }
}