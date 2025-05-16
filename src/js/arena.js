// Importar los componentes
import { ArenaApp } from "./components/arena-app.js"
import { PlayerSelectionModal } from "./components/player-selection-modal.js"
import { BrawlerSelectionModal } from "./components/brawler-selection-modal.js"
import { BattleModal } from "./components/battle-modal.js"
import { EffectModal } from "./components/effect-modal.js"
import { VersusScreen } from "./components/versus-screen.js"
import { VictoryModal } from "./components/victory-modal.js"

// Registrar los componentes
customElements.define("arena-app", ArenaApp)
customElements.define("player-selection-modal", PlayerSelectionModal)
customElements.define("brawler-selection-modal", BrawlerSelectionModal)
customElements.define("battle-modal", BattleModal)
customElements.define("effect-modal", EffectModal)
customElements.define("versus-screen", VersusScreen)
customElements.define("victory-modal", VictoryModal)

// Inicializar la aplicación - MODIFICADO para evitar duplicación
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si ya existe un elemento arena-app para evitar duplicación
  if (!document.querySelector("arena-app")) {
    const arenaApp = document.createElement("arena-app")
    document.body.appendChild(arenaApp)
  }
});