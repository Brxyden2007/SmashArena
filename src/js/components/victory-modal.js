// Componente para mostrar el modal de victoria con un GIF del personaje ganador
export class VictoryModal extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: "open" })
      this._character = null
      this._eventDispatched = false // Flag para controlar que el evento solo se dispare una vez
    }
  
    set character(value) {
      this._character = value
      this.render()
    }
  
    get character() {
      return this._character
    }
  
    connectedCallback() {
      this.render()
      // Auto-cerrar después de 4 segundos (más tiempo que el effect-modal)
      setTimeout(() => {
        this.close()
      }, 4000)
    }
  
    render() {
      if (!this._character) {
        this.shadowRoot.innerHTML = `<div>Error: No se especificó el personaje ganador</div>`
        return
      }
  
      // Obtener el GIF de victoria para el personaje
      const victoryGif = this.getVictoryGif()
  
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
            z-index: 1500;
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .victory-container {
            background: linear-gradient(135deg, #ffcc00, #ff9900);
            border-radius: 20px;
            padding: 2.5rem;
            text-align: center;
            color: white;
            box-shadow: 0 0 40px rgba(255, 204, 0, 0.6);
            max-width: 90%;
            animation: victoryPulse 2s infinite alternate, scaleIn 0.5s ease-out;
            position: relative;
            overflow: hidden;
          }
          @keyframes victoryPulse {
            from { box-shadow: 0 0 40px rgba(255, 204, 0, 0.6); }
            to { box-shadow: 0 0 60px rgba(255, 204, 0, 0.8); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .victory-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            color: #fff;
          }
          .victory-subtitle {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #fff;
          }
          .victory-gif {
            width: 100%;
            max-width: 400px;
            height: auto;
            margin: 1rem auto;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #ffcc00;
            opacity: 0.8;
            animation: confettiFall 5s linear infinite;
          }
          @keyframes confettiFall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
          }
          .close-button {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s;
          }
          .close-button:hover {
            opacity: 1;
          }
        </style>
        
        <div class="victory-container">
          <button class="close-button" id="close-button">&times;</button>
          <div class="victory-title">¡VICTORIA!</div>
          <div class="victory-subtitle">${this._character} ha ganado el combate</div>
          <img class="victory-gif" src="${victoryGif}" alt="${this._character} victoria">
          
          ${this.generateConfetti()}
        </div>
      `
  
      // Agregar event listener para el botón de cerrar
      this.shadowRoot.getElementById("close-button").addEventListener("click", () => this.close())
    }
  
    // Generar elementos de confeti para el efecto visual
    generateConfetti() {
      let confettiHTML = ""
      const colors = ["#ffcc00", "#ff9900", "#ff6600", "#ffffff", "#ff3333"]
  
      for (let i = 0; i < 30; i++) {
        const left = Math.random() * 100
        const delay = Math.random() * 5
        const size = 5 + Math.random() * 10
        const color = colors[Math.floor(Math.random() * colors.length)]
  
        confettiHTML += `
          <div class="confetti" style="
            left: ${left}%;
            animation-delay: ${delay}s;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
          "></div>
        `
      }
  
      return confettiHTML
    }
  
    getVictoryGif() {
      // Obtener GIFs personalizados desde localStorage si existen
      const customGifs = this.getCustomVictoryGifs()
  
      // Verificar si hay un GIF personalizado para este personaje
      if (customGifs[this._character]) {
        return customGifs[this._character]
      }
  
      // Si no hay GIF personalizado, usar el predeterminado del mapeo
      const defaultVictoryGifs = this.getDefaultVictoryGifs()
  
      if (defaultVictoryGifs[this._character]) {
        return defaultVictoryGifs[this._character]
      }
  
      // Si no hay un GIF específico para el personaje, usar el genérico
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/l0MYt5jPR6QX5pnqM/giphy.gif"
    }
  
    // Método para obtener los GIFs de victoria personalizados desde localStorage
    getCustomVictoryGifs() {
      try {
        const customGifsJson = localStorage.getItem("customVictoryGifs")
        return customGifsJson ? JSON.parse(customGifsJson) : {}
      } catch (error) {
        console.error("Error al cargar GIFs de victoria personalizados:", error)
        return {}
      }
    }
  
    // Método para obtener los GIFs de victoria predeterminados para todos los brawlers
    getDefaultVictoryGifs() {
      return {
        Mario:
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmg0ZmR2Y25uNzNjZzF2NzRqcjg2OXVvd3h2ZHY2bGpmOW5vMDl5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2rACp9a8RJCq5q2aqN/giphy.gif",
  
        Bayonetta:
          "https://i.pinimg.com/originals/b5/d0/5d/b5d05dd009e1cc3c8def2654595d4586.gif",
  
        Sonic:
          "https://media.tenor.com/TvXrPyXZCGsAAAAM/sonic-sonic-the-hedgehog.gif",
  
        Kirby:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExajFhN3RtdnhoNHB0cGJhMWNiOHk2MnJzYmlxMWMyMDh2dTdrZTM1ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlIDueXmcWNTPO0/giphy.gif",
  
        Link:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYm5iZW40eXEwZm1sZjk5Z2E2aWF5ZG5wdG41enp3Nmdkczk5cmZuNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YWUpVw86AtIbe/giphy.gif",
  
        Samus:
          "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExamlscjJ1bjl6cXB4ZGk5eTViZWdiYTk4anl1bzhrbmVncWZ1NjlxciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iqHm288SkL8OncIWlx/giphy.gif",
  
        Kazuya:
          "https://i.makeagif.com/media/1-06-2018/E9j-se.gif",
  
        Pikachu:
          "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnFkNjMxazlkMGdqb3NzamthY3dpbjFzZTltanhoM3dwNm0yaWg0ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13QkXswf8TrYrK/giphy.gif",
  
        "Pac-Man":
          "https://media.tenor.com/sEsuKEwVjyUAAAAj/pac-man-pacman.gif",
  
        Sephiroth:
          "https://i.pinimg.com/originals/cc/17/76/cc17762dd59760b2cfb4afc49115d1c7.gif",
  

        Yoshi:
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHA4c3dteGZ5ZXVoeXkwb2xpcmh0cGExeGpoazBjcW1kbDZmOGd2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JkHBrePfE9PgY/giphy.gif",
  
        Peach: 
          "https://i.pinimg.com/originals/b9/26/13/b92613d123a9de3a005d224b8f8c69f7.gif",
      }
    }
  
    close() {
      // Evitar que se dispare el evento más de una vez
      if (this._eventDispatched) return
  
      // Añadir animación de salida
      const container = this.shadowRoot.querySelector(".victory-container")
      if (container) {
        container.style.animation = "fadeOut 0.5s ease-in forwards"
  
        // Crear keyframes para la animación de salida
        const style = document.createElement("style")
        style.textContent = `
          @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
          }
        `
        this.shadowRoot.appendChild(style)
  
        // Esperar a que termine la animación antes de remover
        setTimeout(() => {
          // Marcar que el evento ya se disparó
          this._eventDispatched = true
  
          // Disparar un evento personalizado antes de remover el elemento
          this.dispatchEvent(new CustomEvent("victory-complete"))
          this.remove()
        }, 500)
      } else {
        // Marcar que el evento ya se disparó
        this._eventDispatched = true
  
        // Disparar un evento personalizado antes de remover el elemento
        this.dispatchEvent(new CustomEvent("victory-complete"))
        this.remove()
      }
    }
  }
  
  // Función global para establecer GIFs de victoria personalizados
  window.setVictoryGif = (characterName, gifUrl) => {
    if (!characterName || !gifUrl) {
      console.error("Debes proporcionar el nombre del personaje y la URL del GIF")
      return false
    }
  
    try {
      // Obtener los GIFs personalizados actuales
      let customGifs = {}
      const customGifsJson = localStorage.getItem("customVictoryGifs")
      if (customGifsJson) {
        customGifs = JSON.parse(customGifsJson)
      }
  
      // Establecer el nuevo GIF
      customGifs[characterName] = gifUrl
  
      // Guardar en localStorage
      localStorage.setItem("customVictoryGifs", JSON.stringify(customGifs))
  
      console.log(`GIF de victoria para ${characterName} establecido correctamente`)
      return true
    } catch (error) {
      console.error("Error al guardar el GIF de victoria personalizado:", error)
      return false
    }
  }
  
  // Función para ver los GIFs de victoria personalizados actuales
  window.viewVictoryGifs = () => {
    try {
      const customGifsJson = localStorage.getItem("customVictoryGifs")
      const customGifs = customGifsJson ? JSON.parse(customGifsJson) : {}
      console.log("GIFs de victoria personalizados actuales:", customGifs)
      return customGifs
    } catch (error) {
      console.error("Error al cargar GIFs de victoria personalizados:", error)
      return {}
    }
  }
  
  // Función para eliminar un GIF de victoria personalizado
  window.removeVictoryGif = (characterName) => {
    if (!characterName) {
      console.error("Debes proporcionar el nombre del personaje")
      return false
    }
  
    try {
      // Obtener los GIFs personalizados actuales
      const customGifsJson = localStorage.getItem("customVictoryGifs")
      if (!customGifsJson) return false
  
      const customGifs = JSON.parse(customGifsJson)
  
      // Verificar si existe el personaje
      if (!customGifs[characterName]) {
        console.log(`No hay GIF de victoria personalizado para ${characterName}`)
        return false
      }
  
      // Eliminar el GIF
      delete customGifs[characterName]
  
      // Guardar en localStorage
      localStorage.setItem("customVictoryGifs", JSON.stringify(customGifs))
  
      console.log(`GIF de victoria para ${characterName} eliminado correctamente`)
      return true
    } catch (error) {
      console.error("Error al eliminar el GIF de victoria personalizado:", error)
      return false
    }
  }
  
  // Función para eliminar todos los GIFs de victoria personalizados
  window.clearAllVictoryGifs = () => {
    localStorage.removeItem("customVictoryGifs")
    console.log("Todos los GIFs de victoria personalizados han sido eliminados")
    return true
  }