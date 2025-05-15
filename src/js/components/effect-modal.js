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
      // Aquí usamos placeholders, pero podrías tener una lógica más compleja
      // para seleccionar gifs específicos según el personaje y la acción
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
      // Aquí podrías implementar una lógica más compleja para seleccionar
      // gifs específicos según el personaje y la acción
      // Por ahora, usamos placeholders basados en el tipo de acción
  
      // Mapeo básico de personajes a gifs (podrías expandir esto)
      const characterGifs = {
        Mario: {
          attack:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/12QMzVeF4QsqTC/giphy.gif",
          defense:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/l0HlQXkq9iY7gXkJ2/giphy.gif",
        },
        Sonic: {
          attack:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/5fBH6zodw7VMuR8uUnu/giphy.gif",
          defense:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/yXBqba0Zx8S4/giphy.gif",
        },
      }
  
      // Gifs genéricos por tipo de acción
      const defaultGifs = {
        attack:
          "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/3o7TKDt2tKDR6WnWMM/giphy.gif",
        defense:
          "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJtZnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcnRxZXJtZnRqcg/3o7TKVUn5rViBFGJDG/giphy.gif",
      }
  
      // Intentar obtener un gif específico para el personaje
      const actionCategory = this._actionType === "defense" ? "defense" : "attack"
  
      if (characterGifs[this._character] && characterGifs[this._character][actionCategory]) {
        return characterGifs[this._character][actionCategory]
      }
  
      // Si no hay un gif específico, usar el genérico
      return defaultGifs[actionCategory]
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