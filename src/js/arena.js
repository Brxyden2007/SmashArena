// Importar los componentes
import { ArenaApp } from "./components/arena-app.js"
import { PlayerSelectionModal } from "./components/player-selection-modal.js"
import { BrawlerSelectionModal } from "./components/brawler-selection-modal.js"
import { BattleModal } from "./components/battle-modal.js"
import { EffectModal } from "./components/effect-modal.js"
import { VersusScreen } from "./components/versus-screen.js"

// Registrar los componentes
customElements.define("arena-app", ArenaApp)
customElements.define("player-selection-modal", PlayerSelectionModal)
customElements.define("brawler-selection-modal", BrawlerSelectionModal)
customElements.define("battle-modal", BattleModal)
customElements.define("effect-modal", EffectModal)
customElements.define("versus-screen", VersusScreen)

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  const arenaApp = document.createElement("arena-app")
  document.body.appendChild(arenaApp)
})