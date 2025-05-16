// Componente para mostrar efectos visuales de ataques y defensas
export class EffectModal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this._effect = null
    this._character = null
    this._actionType = null
    this._actionName = null
    this._eventDispatched = false // Flag para controlar que el evento solo se dispare una vez
  }

  set effect(value) {
    this._effect = value
    this.render()
  }

  get effect() {
    return this._effect
  }

  set character(value) {
    this._character = value
    this.render()
  }

  get character() {
    return this._character
  }

  set actionType(value) {
    this._actionType = value
    this.render()
  }

  get actionType() {
    return this._actionType
  }

  set actionName(value) {
    this._actionName = value
    this.render()
  }

  get actionName() {
    return this._actionName
  }

  connectedCallback() {
    this.render()
    // Auto-cerrar después de 2 segundos
    setTimeout(() => {
      this.close()
    }, 2000)
  }

  render() {
    if (!this._character || !this._actionType) {
      this.shadowRoot.innerHTML = `<div>Error: Información de efecto incompleta</div>`
      return
    }

    // Determinar el color de fondo según el tipo de acción
    let bgColor = "#ff6b6b" // Rojo para ataques por defecto
    let actionTypeText = "ataca con"

    if (this._actionType === "defense") {
      bgColor = "#4d96ff" // Azul para defensas
      actionTypeText = "utiliza"
    }

    // Obtener un gif o imagen según el personaje y la acción
    const effectGif = this.getEffectGif()

    this.shadowRoot.innerHTML = `
      <style>
        :host { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          background-color: rgba(0, 0, 0, 0.7); 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          z-index: 1200;
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .effect-container {
          background-color: ${bgColor};
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          color: white;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          max-width: 90%;
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); }
          to { transform: scale(1); }
        }
        .effect-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .effect-gif {
          width: 100%;
          max-width: 350px;
          height: auto;
          margin: 1rem 0;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
      </style>
      
      <div class="effect-container">
        <div class="effect-title">${this._character} ${actionTypeText} ${this._actionName}!</div>
        <img class="effect-gif" src="${effectGif}" alt="${this._actionType} effect">
      </div>
    `
  }

  getEffectGif() {
    // Obtener GIFs personalizados desde localStorage si existen
    const customGifs = this.getCustomGifs()

    // Intentar obtener un GIF personalizado para este personaje y acción
    const actionCategory = this._actionType === "defense" ? "defense" : "attack"

    // Verificar si hay un GIF personalizado para este personaje y acción
    if (customGifs[this._character] && customGifs[this._character][actionCategory]) {
      return customGifs[this._character][actionCategory]
    }

    // Si no hay GIF personalizado, usar el predeterminado del mapeo
    const characterGifs = this.getDefaultGifs()

    if (characterGifs[this._character] && characterGifs[this._character][actionCategory]) {
      return characterGifs[this._character][actionCategory]
    }
  }

  // Método para obtener los GIFs personalizados desde localStorage
  getCustomGifs() {
    try {
      const customGifsJson = localStorage.getItem("customBrawlerGifs")
      return customGifsJson ? JSON.parse(customGifsJson) : {}
    } catch (error) {
      console.error("Error al cargar GIFs personalizados:", error)
      return {}
    }
  }

  // Método para obtener los GIFs predeterminados para todos los brawlers
  getDefaultGifs() {
    return {
      Mario: {
        attack:
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTdtMWx1cTk2dDY4b3M1OWhsYXFmc2ZjcjcyendzaG5hdGlqdXJ6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohfFxoLUgfHh88xcQ/giphy.gif",
        defense:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWxzMnR4MGNrcXZqaTIyOWZvYjh2MzFjbXBta3plMnZsc3U2amRvaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YTtqB2j5EN7IA/giphy.gif",
      },
      Sonic: {
        attack:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjR0cGh4bTdlc2h2ZnB6dWNtMWt2MW53Njd6ajNkYXdmc3FxOGdvOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mdfPpglf2c0QxED151/giphy.gifhttps://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjR0cGh4bTdlc2h2ZnB6dWNtMWt2MW53Njd6ajNkYXdmc3FxOGdvOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mdfPpglf2c0QxED151/giphy.gif",
        defense:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2ZudXJtdGgzcDVjcW1tNzg5MXRrZjFlMzMyNzczbmoxcDJrc3AxZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/miX0EGzQP4uZFaJUil/giphy.gif",
      },
      Bayonetta: {
        attack:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXo5bjNhaTczNWdtdXU3NmM3M3k1ZHpjd2dhYThjanA1a3NoZGVpeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6hIOTkFkmFNi8/giphy.gif",
        defense:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTBsM25qYjZqaGx0d3VwODM0bTB6cm15ZHN4ZXdnb2Z3N3J4MGdyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/flWV3kwNRnlxS/giphy.gif",
      },
      Kirby: {
        attack:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3BlcXNqZnoweWJ1cWZhc2hvdHRoNnF5ZTF5c2QzcGhmcXNyZzcyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NOalcASHiOGvC/giphy.gif",
        defense:
          "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHl2NHd3NWJiNHMwaW16MHA5ZWRmZzF2bnNuNzJvemxnc3p4bjZjMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kqNSiotchOmyI/giphy.gif",
      },
      Link: {
        attack:
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExczlpenhydHY5ajYzaWZkcXNsMW12OWZ0YW8zeTlqOXdxOTBxdGt0cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/107QsHzZW54hJC/giphy.gif",
        defense:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGozZml4N2s3aXo4aXl0eWd3MWJyY2w1N25jeDFsMGpmcXQ0OWZ5NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NVBR6cLvUjV9C/giphy.gif",
      },
      Samus: {
        attack:
          "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTN5ajZ2NzRvNzN6Ympveng2OXB0bnBzcHF3cGFiaDFjOWI5ZXhzaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LXlXqe1fJABuo/giphy.gif",
        defense:
          "https://64.media.tumblr.com/4171b4974f6d7c5fff3fda9f647b277a/tumblr_oae3oqBOGd1ulbjffo1_500.gif",
      },
      Peach: {
        attack:
          "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG90dnQzMjRwb3l6azRwdnpwbzlwZWZqeHhwdW1wbHI3YmVka3Z5aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tK1ZTCGtRy4NkXbzaj/giphy.gif",
        defense:
          "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHh0aW16bG85MjkzbGRieDI4Nmx4ancyNWYzNTdubXF2aGVramkycCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/e4jfRbYhDdpC/giphy.gif",
      },
      Pikachu: {
        attack:
          "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/xuXzcHMkuwvf2/giphy.gif",
        defense:
          "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/slVWEctHZKvWU/giphy.gif",
      },
      "Pac-Man": {
        attack:
          "https://media.tenor.com/vqIZEA2T1GgAAAAM/mechagrasa-sdlg.gif",
        defense:
          "https://media.tenor.com/5MZ_08izQOYAAAAM/mechagrasa-mecha.gif",
      },
      Sephiroth: {
        attack:
          "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG13d2JsbWE2czVmNDFxdml2anJrdHU5NHZ5N25uZThsZGRuNWdxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5676I3CH3sGe4/giphy.gif",
        defense:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExODhyMHkzMXpicnpkZmE0cDlhNXdnbGd4OWtoc2tleGFqdWNsNGFqcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tZFILAa6lnv9LhCcYO/giphy.gif",
      },
      Kazuya: {
        attack:
          "https://i.pinimg.com/originals/44/cd/b3/44cdb3404bda3a50e159f7890369f9c6.gif",
        defense:
          "https://64.media.tumblr.com/tumblr_m3sr9oG4oy1qivxzqo1_500.gif",
      },
      Yoshi: {
        attack:
          "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2VvdG9lM3UyMmg3dHp5NTdiZ2YzMDg4bmFxeGN0eXhiOXhpaG5xOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C51woXfgJdug/giphy.gif",
        defense:
          "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWlha243YmNzaGpwOWVmZjE2NHl1bWhvNWk1bjF6ejRvN2VtcGo1OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1ORxrBqFw1fVu/giphy.gif",
      },
    }
  }

  close() {
    // Evitar que se dispare el evento más de una vez
    if (this._eventDispatched) return

    // Añadir animación de salida
    const container = this.shadowRoot.querySelector(".effect-container")
    if (container) {
      container.style.animation = "scaleOut 0.3s ease-in forwards"

      // Crear keyframes para la animación de salida
      const style = document.createElement("style")
      style.textContent = `
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.8); opacity: 0; }
        }
      `
      this.shadowRoot.appendChild(style)

      // Esperar a que termine la animación antes de remover
      setTimeout(() => {
        // Marcar que el evento ya se disparó
        this._eventDispatched = true

        // Disparar un evento personalizado antes de remover el elemento
        this.dispatchEvent(new CustomEvent("effect-complete"))
        this.remove()
      }, 300)
    } else {
      // Marcar que el evento ya se disparó
      this._eventDispatched = true

      // Disparar un evento personalizado antes de remover el elemento
      this.dispatchEvent(new CustomEvent("effect-complete"))
      this.remove()
    }
  }
}

// Función global para establecer GIFs personalizados para los brawlers
window.setBrawlerGif = (characterName, actionType, gifUrl) => {
  if (!characterName || !actionType || !gifUrl) {
    console.error("Debes proporcionar el nombre del personaje, tipo de acción (attack/defense) y URL del GIF")
    return false
  }

  if (actionType !== "attack" && actionType !== "defense") {
    console.error('El tipo de acción debe ser "attack" o "defense"')
    return false
  }

  try {
    // Obtener los GIFs personalizados actuales
    let customGifs = {}
    const customGifsJson = localStorage.getItem("customBrawlerGifs")
    if (customGifsJson) {
      customGifs = JSON.parse(customGifsJson)
    }

    // Crear la estructura si no existe
    if (!customGifs[characterName]) {
      customGifs[characterName] = {}
    }

    // Establecer el nuevo GIF
    customGifs[characterName][actionType] = gifUrl

    // Guardar en localStorage
    localStorage.setItem("customBrawlerGifs", JSON.stringify(customGifs))

    console.log(`GIF de ${actionType} para ${characterName} establecido correctamente`)
    return true
  } catch (error) {
    console.error("Error al guardar el GIF personalizado:", error)
    return false
  }
}

// Función para listar todos los brawlers disponibles
window.listBrawlers = () => {
  const effectModal = new EffectModal()
  const defaultGifs = effectModal.getDefaultGifs()
  console.log("Brawlers disponibles:")
  Object.keys(defaultGifs).forEach((brawler) => {
    console.log(`- ${brawler}`)
  })
  return Object.keys(defaultGifs)
}

// Función para ver los GIFs personalizados actuales
window.viewCustomGifs = () => {
  try {
    const customGifsJson = localStorage.getItem("customBrawlerGifs")
    const customGifs = customGifsJson ? JSON.parse(customGifsJson) : {}
    console.log("GIFs personalizados actuales:", customGifs)
    return customGifs
  } catch (error) {
    console.error("Error al cargar GIFs personalizados:", error)
    return {}
  }
}

// Función para eliminar un GIF personalizado
window.removeBrawlerGif = (characterName, actionType) => {
  if (!characterName || !actionType) {
    console.error("Debes proporcionar el nombre del personaje y tipo de acción (attack/defense)")
    return false
  }

  try {
    // Obtener los GIFs personalizados actuales
    const customGifsJson = localStorage.getItem("customBrawlerGifs")
    if (!customGifsJson) return false

    const customGifs = JSON.parse(customGifsJson)

    // Verificar si existe el personaje y la acción
    if (!customGifs[characterName] || !customGifs[characterName][actionType]) {
      console.log(`No hay GIF personalizado de ${actionType} para ${characterName}`)
      return false
    }

    // Eliminar el GIF
    delete customGifs[characterName][actionType]

    // Si no quedan acciones para el personaje, eliminar el personaje
    if (Object.keys(customGifs[characterName]).length === 0) {
      delete customGifs[characterName]
    }

    // Guardar en localStorage
    localStorage.setItem("customBrawlerGifs", JSON.stringify(customGifs))

    console.log(`GIF de ${actionType} para ${characterName} eliminado correctamente`)
    return true
  } catch (error) {
    console.error("Error al eliminar el GIF personalizado:", error)
    return false
  }
}

// Función para eliminar todos los GIFs personalizados
window.clearAllCustomGifs = () => {
  localStorage.removeItem("customBrawlerGifs")
  console.log("Todos los GIFs personalizados han sido eliminados")
  return true
}