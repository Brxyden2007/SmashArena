// Componente para el modal de selección de brawlers
export class BrawlerSelectionModal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this._brawlers = []
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
    let brawlerCardsHTML = ""

    this.brawlers.forEach((brawler) => {
      const ataques = brawler.ataques && brawler.ataques.filter((a) => a.tipo === "ataque").slice(0, 2)

      let debilidadesHTML = ""
      if (brawler.debilidades && Array.isArray(brawler.debilidades)) {
        brawler.debilidades.forEach((debilidad) => {
          debilidadesHTML += `<span class="weakness-tag">${debilidad}</span>`
        })
      }

      let ataquesHTML = ""
      if (ataques && ataques.length) {
        ataques.forEach((ataque) => {
          ataquesHTML += `
            <div class="attack-item">
              <span>${ataque.nombre}</span>
              <span>${ataque.daño}</span>
            </div>
          `
        })
      }

      // Asegurarse de que la imagen tenga un valor predeterminado si no existe
      const imagenUrl = brawler.imagen || "https://via.placeholder.com/100"

      brawlerCardsHTML += `
        <div class="brawler-card" data-id="${brawler.id}">
          <div class="brawler-image-container">
            <img class="brawler-image" src="${imagenUrl}" alt="${brawler.nombre}" onerror="this.src='https://via.placeholder.com/100'">
          </div>
          <div class="brawler-name">${brawler.nombre}</div>
          <div class="brawler-codename">${brawler.nombreClave || ""}</div>
          
          <div class="brawler-stats">
            <div class="stat-row">
              <span class="stat-label">Fuerza:</span>
              <span class="stat-value">${brawler.fuerza || 0}</span>
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
      `
    })

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
          z-index: 1100; 
        }
        .modal { 
          background-color: white; 
          border-radius: 8px; 
          padding: 2rem; 
          width: 90%; 
          max-width: 900px; 
          max-height: 90vh; 
          overflow-y: auto; 
        }
        .modal-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 1.5rem; 
        }
        .modal-title { 
          font-size: 1.5rem; 
          font-weight: bold; 
          color: #ff3333;
        }
        .close-button { 
          background: none; 
          border: none; 
          font-size: 1.5rem; 
          cursor: pointer; 
        }
        .brawlers-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
          gap: 1.5rem; 
          padding: 1rem;
        }
        .brawler-card { 
          border: 1px solid #ddd; 
          border-radius: 12px; 
          padding: 1.5rem; 
          cursor: pointer; 
          transition: transform 0.2s, box-shadow 0.2s;
          background-color: #f9f9f9;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .brawler-card:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          background-color: #fff;
        }
        .brawler-image-container { 
          display: flex; 
          justify-content: center; 
          align-items: center;
          margin-bottom: 1rem;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          height: 150px;
          background-color: #f0f0f0;
        }
        .brawler-image { 
          max-width: 100%;
          max-height: 150px;
          object-fit: contain;
          transition: transform 0.3s;
        }
        .brawler-card:hover .brawler-image {
          transform: scale(1.05);
        }
        .brawler-name { 
          font-weight: bold; 
          font-size: 1.2rem; 
          text-align: center; 
          margin-bottom: 0.5rem;
          color: #ff3333;
        }
        .brawler-codename { 
          color: #666; 
          font-size: 0.9rem; 
          text-align: center; 
          margin-bottom: 1rem;
          font-style: italic;
        }
        .brawler-stats { 
          margin-top: 1rem;
          background-color: #f0f0f0;
          padding: 0.8rem;
          border-radius: 8px;
        }
        .stat-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #ddd;
        }
        .stat-label { 
          font-size: 0.9rem;
          font-weight: bold;
          color: #555;
        }
        .stat-value { 
          font-weight: bold; 
          font-size: 0.9rem;
          color: #333;
        }
        .attacks-list { 
          margin-top: 0.8rem;
        }
        .attack-item { 
          display: flex; 
          justify-content: space-between; 
          font-size: 0.85rem; 
          margin-bottom: 0.5rem;
          padding: 0.3rem 0.5rem;
          background-color: #e8e8e8;
          border-radius: 4px;
        }
        .weaknesses { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 0.4rem; 
          margin-top: 0.8rem;
        }
        .weakness-tag { 
          background-color: #ffeeee; 
          color: #ff3333; 
          font-size: 0.75rem; 
          padding: 0.2rem 0.4rem; 
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(255, 0, 0, 0.1);
        }
        .actions { 
          display: flex; 
          justify-content: flex-end; 
          margin-top: 1.5rem;
          padding: 1rem;
          border-top: 1px solid #eee;
        }
        button { 
          padding: 0.7rem 1.5rem; 
          border-radius: 6px; 
          border: none; 
          cursor: pointer; 
          font-weight: bold;
          transition: background-color 0.2s, transform 0.1s;
        }
        button:hover {
          transform: translateY(-2px);
        }
        .secondary-button { 
          background-color: #e2e2e2; 
          color: #333;
        }
        .secondary-button:hover {
          background-color: #d0d0d0;
        }
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
    `

    // Agregar event listeners
    this.shadowRoot.getElementById("close-button").addEventListener("click", () => this.close())
    this.shadowRoot.getElementById("cancel-button").addEventListener("click", () => this.close())

    // Agregar event listeners para las tarjetas de brawlers
    const brawlerCards = this.shadowRoot.querySelectorAll(".brawler-card")
    brawlerCards.forEach((card) => {
      card.addEventListener("click", () => {
        const brawlerId = Number.parseInt(card.dataset.id, 10)
        this.selectBrawler(brawlerId)
      })
    })
  }

  selectBrawler(brawlerId) {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { brawlerId },
      }),
    )
    this.close()
  }

  close() {
    this.remove()
  }
}