const API_URL = 'http://localhost:3000/brawlers';

// Componente principal de la Arena
class ArenaApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.brawlers = [];
  }

  async connectedCallback() {
    try {
      // Cargar los datos de los brawlers desde la API
      const response = await fetch(API_URL);
      this.brawlers = await response.json();
      this.render();
    } catch (error) {
      console.error('Error cargando los datos:', error ,'Asegurate de que tu JSON-SERVER este activo.');
      this.shadowRoot.innerHTML = `<div style="color: red; padding: 20px; font-size: 25px;">Error cargando los datos: ${error.message}. Asegurate de que tu JSON-SERVER este activo.</div>`;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { background-color: #ff3333; color: black; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 1rem; }
        .logo img { width: 50px; height: 50px; }
        nav { display: flex; gap: 2rem; }
        nav a { color: black; text-decoration: none; font-weight: bold; font-size: 1.2rem; }
        main { background-color: #f8e0e0; padding: 2rem; min-height: calc(100vh - 80px); }
        .game-modes { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
        .game-mode-card { background-color: #e9e9e9; border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .game-mode-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2); }
        .game-mode-card img { width: 100%; height: 200px; object-fit: cover; }
        .game-mode-title { background-color: rgba(0, 0, 0, 0.7); color: white; padding: 0.5rem; text-align: center; font-weight: bold; }
        .cvc-container { display: flex; justify-content: center; margin-top: 1rem; }
        .cvc-card { max-width: 400px; }
      </style>

        
        <main>
          <div class="game-modes">
            <div class="game-mode-card" id="pvp-mode">
              <img src="https://via.placeholder.com/400x200?text=PVP" alt="Player vs Player">
              <div class="game-mode-title">PLAYER VS PLAYER</div>
            </div>
            <div class="game-mode-card" id="pvc-mode">
              <img src="https://via.placeholder.com/400x200?text=PVC" alt="Player vs PC">
              <div class="game-mode-title">PLAYER VS PC</div>
            </div>
          </div>
          
          <div class="cvc-container">
            <div class="game-mode-card cvc-card" id="cvc-mode">
              <img src="https://via.placeholder.com/400x200?text=CVC" alt="PC vs PC">
              <div class="game-mode-title">PC VS PC</div>
            </div>
          </div>
        </main>
      </div>
    `;

    // Agregar event listeners para los modos de juego
    this.shadowRoot.getElementById('pvp-mode').addEventListener('click', () => this.openSelectionModal('pvp'));
    this.shadowRoot.getElementById('pvc-mode').addEventListener('click', () => this.openSelectionModal('pvc'));
    this.shadowRoot.getElementById('cvc-mode').addEventListener('click', () => this.startCvcBattle());
  }

  openSelectionModal(mode) {
    const selectionModal = document.createElement('player-selection-modal');
    selectionModal.mode = mode;
    selectionModal.brawlers = this.brawlers;
    selectionModal.addEventListener('battle', (e) => {
      this.startBattle(e.detail.player1Id, e.detail.player2Id);
    });
    document.body.appendChild(selectionModal);
  }

  startCvcBattle() {
    // Seleccionar dos brawlers aleatorios para el modo CvC
    const randomBrawler1 = this.getRandomBrawler();
    let randomBrawler2 = this.getRandomBrawler();
    // Asegurarse de que no sean el mismo
    while (randomBrawler2.id === randomBrawler1.id) {
      randomBrawler2 = this.getRandomBrawler();
    }
    
    this.startBattle(randomBrawler1.id, randomBrawler2.id);
  }

  startBattle(player1Id, player2Id) {
    const battleModal = document.createElement('battle-modal');
    battleModal.player1 = this.brawlers.find(b => b.id === player1Id);
    battleModal.player2 = this.brawlers.find(b => b.id === player2Id);
    document.body.appendChild(battleModal);
  }

  getRandomBrawler() {
    const randomIndex = Math.floor(Math.random() * this.brawlers.length);
    return this.brawlers[randomIndex];
  }
}

// Componente para el modal de selección de jugadores
class PlayerSelectionModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.player1Selection = null;
    this.player2Selection = null;
    this._brawlers = [];
  }

  get mode() {
    return this.getAttribute('mode');
  }

  set mode(value) {
    this.setAttribute('mode', value);
  }

  set brawlers(value) {
    this._brawlers = value;
    this.render();
  }

  get brawlers() {
    return this._brawlers;
  }

  connectedCallback() {
    this.render();
  }

  render() {
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
              ${this.player1Selection ? `
                <img class="character-image" src="${this.getCharacterById(this.player1Selection).imagen}" alt="${this.getCharacterById(this.player1Selection).nombre}">
                <div class="character-name">${this.getCharacterById(this.player1Selection).nombre}</div>
              ` : `
                <div class="no-character">Ningún personaje seleccionado</div>
              `}
            </div>
            <div class="button-group">
              <button class="primary-button" id="player1-select">Elegir Carta</button>
              <button class="secondary-button" id="player1-random">Random</button>
            </div>
          </div>
          
          ${this.mode === 'pvp' ? `
            <!-- Player 2 Selection (only for PVP mode) -->
            <div class="player-selection">
              <div class="player-title">Jugador 2</div>
              <div class="character-display" id="player2-display">
                ${this.player2Selection ? `
                  <img class="character-image" src="${this.getCharacterById(this.player2Selection).imagen}" alt="${this.getCharacterById(this.player2Selection).nombre}">
                  <div class="character-name">${this.getCharacterById(this.player2Selection).nombre}</div>
                ` : `
                  <div class="no-character">Ningún personaje seleccionado</div>
                `}
              </div>
              <div class="button-group">
                <button class="primary-button" id="player2-select">Elegir Carta</button>
                <button class="secondary-button" id="player2-random">Random</button>
              </div>
            </div>
          ` : `
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
          `}
        </div>
        
        <div class="actions">
          <button class="secondary-button" id="cancel-button">Cancelar</button>
          <button class="fight-button ${this.canFight() ? '' : 'disabled'}" id="fight-button" ${this.canFight() ? '' : 'disabled'}>
            ¡LUCHAR!
          </button>
        </div>
      </div>
    `;

    // Agregar event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    this.shadowRoot.getElementById('close-button').addEventListener('click', () => this.close());
    this.shadowRoot.getElementById('cancel-button').addEventListener('click', () => this.close());
    
    this.shadowRoot.getElementById('player1-select').addEventListener('click', () => this.openBrawlerSelection(1));
    this.shadowRoot.getElementById('player1-random').addEventListener('click', () => this.selectRandomBrawler(1));
    
    if (this.mode === 'pvp') {
      this.shadowRoot.getElementById('player2-select').addEventListener('click', () => this.openBrawlerSelection(2));
      this.shadowRoot.getElementById('player2-random').addEventListener('click', () => this.selectRandomBrawler(2));
    }
    
    const fightButton = this.shadowRoot.getElementById('fight-button');
    if (fightButton) {
      fightButton.addEventListener('click', () => this.startBattle());
    }
  }

  getCharacterById(id) {
    return this.brawlers.find(b => b.id === id) || {};
  }

  canFight() {
    if (this.mode === 'pvp') {
      return this.player1Selection && this.player2Selection;
    } else {
      return this.player1Selection;
    }
  }

  openBrawlerSelection(playerNumber) {
    const brawlerModal = document.createElement('brawler-selection-modal');
    brawlerModal.brawlers = this.brawlers;
    brawlerModal.addEventListener('select', (e) => {
      if (playerNumber === 1) {
        this.player1Selection = e.detail.brawlerId;
      } else {
        this.player2Selection = e.detail.brawlerId;
      }
      this.render();
    });
    document.body.appendChild(brawlerModal);
  }

  selectRandomBrawler(playerNumber) {
    const randomIndex = Math.floor(Math.random() * this.brawlers.length);
    const randomBrawlerId = this.brawlers[randomIndex].id;
    
    if (playerNumber === 1) {
      this.player1Selection = randomBrawlerId;
    } else {
      this.player2Selection = randomBrawlerId;
    }
    
    this.render();
  }

  startBattle() {
    if (!this.canFight()) return;
    
    let player2Id = this.player2Selection;
    
    // Si es modo PVC, seleccionar un brawler aleatorio para el PC
    if (this.mode === 'pvc') {
      const randomIndex = Math.floor(Math.random() * this.brawlers.length);
      player2Id = this.brawlers[randomIndex].id;
    }
    
    // Disparar evento para iniciar la batalla
    this.dispatchEvent(new CustomEvent('battle', {
      detail: {
        player1Id: this.player1Selection,
        player2Id: player2Id
      }
    }));
    
    this.close();
  }

  close() {
    this.remove();
  }
}

// Componente para el modal de selección de brawlers
class BrawlerSelectionModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._brawlers = [];
  }

  set brawlers(value) {
    this._brawlers = value;
    this.render();
  }

  get brawlers() {
    return this._brawlers;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    let brawlerCardsHTML = '';
    
    this.brawlers.forEach(brawler => {
      const ataques = brawler.ataques.filter(a => a.tipo === "ataque").slice(0, 2);
      
      let debilidadesHTML = '';
      brawler.debilidades.forEach(debilidad => {
        debilidadesHTML += `<span class="weakness-tag">${debilidad}</span>`;
      });
      
      let ataquesHTML = '';
      ataques.forEach(ataque => {
        ataquesHTML += `
          <div class="attack-item">
            <span>${ataque.nombre}</span>
            <span>${ataque.daño}</span>
          </div>
        `;
      });
      
      brawlerCardsHTML += `
        <div class="brawler-card" data-id="${brawler.id}">
          <div class="brawler-image-container">
            <img class="brawler-image" src="${brawler.imagen}" alt="${brawler.nombre}" onerror="this.src='https://via.placeholder.com/100'">
          </div>
          <div class="brawler-name">${brawler.nombre}</div>
          <div class="brawler-codename">${brawler.nombreClave}</div>
          
          <div class="brawler-stats">
            <div class="stat-row">
              <span class="stat-label">Fuerza:</span>
              <span class="stat-value">${brawler.fuerza}</span>
            </div>
            
            <div class="attacks-list">
              <div class="stat-label">Ataques:</div>
              ${ataquesHTML}
            </div>
            
            <div class="weaknesses">
              ${debilidadesHTML}
            </div>
          </div>
        </div>
      `;
    });

    this.shadowRoot.innerHTML = `
      <style>
        :host { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1100; }
        .modal { background-color: white; border-radius: 8px; padding: 2rem; width: 90%; max-width: 900px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-title { font-size: 1.5rem; font-weight: bold; }
        .close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        .brawlers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
        .brawler-card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .brawler-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
        .brawler-image-container { display: flex; justify-content: center; margin-bottom: 0.5rem; }
        .brawler-image { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; }
        .brawler-name { font-weight: bold; font-size: 1.1rem; text-align: center; margin-bottom: 0.5rem; }
        .brawler-codename { color: #666; font-size: 0.9rem; text-align: center; margin-bottom: 0.5rem; }
        .brawler-stats { margin-top: 0.5rem; }
        .stat-row { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }
        .stat-label { font-size: 0.9rem; }
        .stat-value { font-weight: bold; font-size: 0.9rem; }
        .attacks-list { margin-top: 0.5rem; }
        .attack-item { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem; }
        .weaknesses { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.5rem; }
        .weakness-tag { background-color: #ffeeee; color: #ff3333; font-size: 0.7rem; padding: 0.1rem 0.3rem; border-radius: 4px; }
        .actions { display: flex; justify-content: flex-end; margin-top: 1.5rem; }
        button { padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
        .secondary-button { background-color: #e2e2e2; color: #333; }
      </style>
      
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Selecciona un Brawler</div>
          <button class="close-button" id="close-button">&times;</button>
        </div>
        
        <div class="brawlers-grid">
          ${brawlerCardsHTML}
        </div>
        
        <div class="actions">
          <button class="secondary-button" id="cancel-button">Cancelar</button>
        </div>
      </div>
    `;

    // Agregar event listeners
    this.shadowRoot.getElementById('close-button').addEventListener('click', () => this.close());
    this.shadowRoot.getElementById('cancel-button').addEventListener('click', () => this.close());
    
    // Agregar event listeners para las tarjetas de brawlers
    const brawlerCards = this.shadowRoot.querySelectorAll('.brawler-card');
    brawlerCards.forEach(card => {
      card.addEventListener('click', () => {
        const brawlerId = parseInt(card.dataset.id);
        this.selectBrawler(brawlerId);
      });
    });
  }

  selectBrawler(brawlerId) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: { brawlerId }
    }));
    this.close();
  }

  close() {
    this.remove();
  }
}

// Componente para el modal de batalla
class BattleModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.battleState = {
      player1Health: 100,
      player2Health: 100,
      logs: [],
      winner: null,
      round: 0
    };
    this.battleInterval = null;
  }

  set player1(value) {
    this._player1 = value;
  }

  get player1() {
    return this._player1;
  }

  set player2(value) {
    this._player2 = value;
  }

  get player2() {
    return this._player2;
  }

  connectedCallback() {
    this.render();
    this.startBattle();
  }

  disconnectedCallback() {
    if (this.battleInterval) {
      clearInterval(this.battleInterval);
    }
  }

  render() {
    if (!this.player1 || !this.player2) {
      this.shadowRoot.innerHTML = `<div>Error: No se encontraron los personajes</div>`;
      return;
    }

    // Generar HTML para los logs de batalla
    let logsHTML = '';
    this.battleState.logs.forEach(log => {
      logsHTML += `<div class="log-entry">${log}</div>`;
    });

    if (logsHTML === '') {
      logsHTML = `<div class="log-entry">El combate está a punto de comenzar...</div>`;
    }

    // Generar HTML para el anuncio del ganador
    let winnerHTML = '';
    if (this.battleState.winner) {
      const winnerName = this.battleState.winner === 'player1' ? this.player1.nombre : this.player2.nombre;
      winnerHTML = `
        <div class="winner-announcement">
          <div class="winner-text">¡${winnerName} ha ganado el combate!</div>
        </div>
      `;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal { background-color: white; border-radius: 8px; padding: 2rem; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-title { font-size: 1.5rem; font-weight: bold; }
        .close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        .battle-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
        .fighter { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; align-items: center; }
        .fighter-image { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem; }
        .fighter-name { font-weight: bold; font-size: 1.2rem; margin-bottom: 0.25rem; }
        .fighter-codename { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
        .health-bar-container { width: 100%; height: 20px; background-color: #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem; }
        .health-bar { height: 100%; background-color: #4caf50; transition: width 0.5s; }
        .health-text { font-size: 0.9rem; }
        .battle-log { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; max-height: 200px; overflow-y: auto; margin-bottom: 1.5rem; }
        .log-title { font-weight: bold; margin-bottom: 0.5rem; }
        .log-entry { font-size: 0.9rem; margin-bottom: 0.25rem; }
        .winner-announcement { background-color: #fff9c4; border-radius: 8px; padding: 1rem; text-align: center; margin-bottom: 1.5rem; }
        .winner-text { font-size: 1.2rem; font-weight: bold; }
        .actions { display: flex; justify-content: flex-end; gap: 1rem; }
        button { padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
        .primary-button { background-color: #4a90e2; color: white; }
        .secondary-button { background-color: #e2e2e2; color: #333; }
      </style>
      
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">¡Combate!</div>
          <button class="close-button" id="close-button">&times;</button>
        </div>
        
        <div class="battle-container">
          <!-- Player 1 -->
          <div class="fighter">
            <img class="fighter-image" src="${this.player1.imagen}" alt="${this.player1.nombre}" onerror="this.src='https://via.placeholder.com/120'">
            <div class="fighter-name">${this.player1.nombre}</div>
            <div class="fighter-codename">${this.player1.nombreClave}</div>
            
            <div class="health-bar-container">
              <div class="health-bar" id="player1-health-bar" style="width: ${this.battleState.player1Health}%"></div>
            </div>
            <div class="health-text" id="player1-health-text">Salud: ${this.battleState.player1Health}%</div>
          </div>
          
          <!-- Player 2 -->
          <div class="fighter">
            <img class="fighter-image" src="${this.player2.imagen}" alt="${this.player2.nombre}" onerror="this.src='https://via.placeholder.com/120'">
            <div class="fighter-name">${this.player2.nombre}</div>
            <div class="fighter-codename">${this.player2.nombreClave}</div>
            
            <div class="health-bar-container">
              <div class="health-bar" id="player2-health-bar" style="width: ${this.battleState.player2Health}%"></div>
            </div>
            <div class="health-text" id="player2-health-text">Salud: ${this.battleState.player2Health}%</div>
          </div>
        </div>
        
        <!-- Battle Log -->
        <div class="battle-log" id="battle-log">
          <div class="log-title">Registro de Combate</div>
          ${logsHTML}
        </div>
        
        ${winnerHTML}
        
        <div class="actions">
          <button class="secondary-button" id="restart-button" ${this.battleState.round < 10 && !this.battleState.winner ? 'disabled' : ''}>
            Reiniciar Combate
          </button>
          <button class="primary-button" id="close-battle-button">
            Cerrar
          </button>
        </div>
      </div>
    `;

    // Agregar event listeners
    this.shadowRoot.getElementById('close-button').addEventListener('click', () => this.close());
    this.shadowRoot.getElementById('close-battle-button').addEventListener('click', () => this.close());
    
    const restartButton = this.shadowRoot.getElementById('restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => this.restartBattle());
    }
  }

  startBattle() {
    if (!this.player1 || !this.player2) return;
    
    this.battleInterval = setInterval(() => {
      if (this.battleState.winner || this.battleState.round >= 10) {
        clearInterval(this.battleInterval);
        return;
      }
      
      // Calcular daño
      const player1Attack = this.player1.ataques.find(a => a.tipo === "ataque");
      const player2Attack = this.player2.ataques.find(a => a.tipo === "ataque");
      
      const player1Damage = player1Attack ? Math.floor(player1Attack.daño * (this.player1.fuerza / 100)) : 0;
      const player2Damage = player2Attack ? Math.floor(player2Attack.daño * (this.player2.fuerza / 100)) : 0;
      
      // Aplicar daño
      const newPlayer1Health = Math.max(0, this.battleState.player1Health - player2Damage);
      const newPlayer2Health = Math.max(0, this.battleState.player2Health - player1Damage);
      
      // Crear log
      const newLogs = [
        ...this.battleState.logs,
        `Ronda ${this.battleState.round + 1}: ${this.player1.nombre} ataca con ${player1Attack?.nombre} causando ${player1Damage} de daño.`,
        `Ronda ${this.battleState.round + 1}: ${this.player2.nombre} ataca con ${player2Attack?.nombre} causando ${player2Damage} de daño.`
      ];
      
      // Verificar ganador
      let winner = null;
      if (newPlayer1Health <= 0) {
        winner = 'player2';
        newLogs.push(`¡${this.player2.nombre} ha ganado el combate!`);
      } else if (newPlayer2Health <= 0) {
        winner = 'player1';
        newLogs.push(`¡${this.player1.nombre} ha ganado el combate!`);
      } else if (this.battleState.round >= 9) {
        // Determinar ganador basado en salud restante si se alcanza el máximo de rondas
        if (newPlayer1Health > newPlayer2Health) {
          winner = 'player1';
          newLogs.push(`¡${this.player1.nombre} ha ganado el combate por mayor salud restante!`);
        } else if (newPlayer2Health > newPlayer1Health) {
          winner = 'player2';
          newLogs.push(`¡${this.player2.nombre} ha ganado el combate por mayor salud restante!`);
        } else {
          newLogs.push("¡El combate ha terminado en empate!");
        }
      }
      
      // Actualizar estado
      this.battleState = {
        player1Health: newPlayer1Health,
        player2Health: newPlayer2Health,
        logs: newLogs,
        winner,
        round: this.battleState.round + 1
      };
      
      // Actualizar UI
      this.updateBattleUI();
    }, 1000);
  }

  updateBattleUI() {
    // Actualizar barras de salud
    const player1HealthBar = this.shadowRoot.getElementById('player1-health-bar');
    const player2HealthBar = this.shadowRoot.getElementById('player2-health-bar');
    const player1HealthText = this.shadowRoot.getElementById('player1-health-text');
    const player2HealthText = this.shadowRoot.getElementById('player2-health-text');
    
    if (player1HealthBar) player1HealthBar.style.width = `${this.battleState.player1Health}%`;
    if (player2HealthBar) player2HealthBar.style.width = `${this.battleState.player2Health}%`;
    if (player1HealthText) player1HealthText.textContent = `Salud: ${this.battleState.player1Health}%`;
    if (player2HealthText) player2HealthText.textContent = `Salud: ${this.battleState.player2Health}%`;
    
    // Actualizar log de batalla
    const battleLog = this.shadowRoot.getElementById('battle-log');
    if (battleLog) {
      let logsHTML = '<div class="log-title">Registro de Combate</div>';
      this.battleState.logs.forEach(log => {
        logsHTML += `<div class="log-entry">${log}</div>`;
      });
      battleLog.innerHTML = logsHTML;
      battleLog.scrollTop = battleLog.scrollHeight;
    }
    
    // Si hay un ganador, volver a renderizar para mostrar el anuncio
    if (this.battleState.winner) {
      this.render();
    }
  }

  restartBattle() {
    if (this.battleInterval) {
      clearInterval(this.battleInterval);
    }
    
    this.battleState = {
      player1Health: 100,
      player2Health: 100,
      logs: [],
      winner: null,
      round: 0
    };
    
    this.render();
    this.startBattle();
  }

  close() {
    if (this.battleInterval) {
      clearInterval(this.battleInterval);
    }
    this.remove();
  }
}

// Registrar los componentes
customElements.define('arena-app', ArenaApp);
customElements.define('player-selection-modal', PlayerSelectionModal);
customElements.define('brawler-selection-modal', BrawlerSelectionModal);
customElements.define('battle-modal', BattleModal);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  const arenaApp = document.createElement('arena-app');
  document.body.appendChild(arenaApp);
});