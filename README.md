# Smash Arena 🎮,

#### Smash Arena es una aplicación web interactiva de combate entre personajes estilo Brawlers, donde puedes enfrentar a tus personajes favoritos en combates 1v1, 2v2, o incluso contra la computadora. ¡Escoge tu brawler, lucha y demuestra quién es el mejor en la arena!

### 🚀 Funcionalidades principales,
- Navegación SPA con menú interactivo (Home, Brawlers, Arena),

## Página de inicio (Home):
- Logo de la aplicación,

- Texto introductorio del juego (1v1, 2v2, PC vs Player, etc.)

## Brawlers:

- Tarjetas de personajes con nombre clave e imagen,

- Botón Info que voltea la tarjeta y muestra:

- Nombre completo,

- Descripción,

- Nombre clave,

- Trajes disponibles,

- Botón Close para volver al estado original,

## Arena:

- Modo Player vs Player, Player vs PC y PC vs PC,

- Selección de personajes o selección aleatoria (Random),

- Tarjetas con información: imagen, nombre, fuerza, ataque, debilidad,

- Sistema de combate:

- 2 ataques por personaje (2 ofensivos, 1 defensa),

- Barra de vida que se reduce con cada ataque,

- Botón Luchar con modal animado mostrando el efecto del ataque,

- Modal final con efecto de ¡VICTORIA! y nombre del GANADOR

### 📦 Tecnologías usadas,

- HTML5,

- CSS3 (Responsive Design),

- JavaScript (DOM, Web Components, eventos, modales, lógica de combate),

- JSON Server (simula backend de personajes),

- GitFlow (estructura de ramas de desarrollo),

- Git + GitHub para control de versiones,

## 📁 Estructura del Proyecto

```plaintext
SMASHARENA/
├── data/                      # Archivos de datos (no detallados en la imagen)
├── img/                       # Imágenes del proyecto
├── src/                       # Carpeta fuente
│   ├── css/                   # Estilos CSS
│   │   ├── arena.css
│   │   ├── brawlers.css
│   │   └── styles.css
│   └── js/                    # Lógica JavaScript
│       ├── components/        # Componentes reutilizables
│       │   ├── arena-app.js
│       │   ├── battle-modal.js
│       │   ├── brawler-selection-modal.js
│       │   ├── effect-modal.js
│       │   ├── player-selection-modal.js
│       │   ├── versus-screen.js
│       │   └── victory-modal.js
│       ├── api.js
│       ├── arena.js
│       ├── brawlers.js
│       └── main.js
├── .gitignore                 # Archivos/Directorios ignorados por Git
├── arena.html                 # Página del modo Arena
├── brawlers.html              # Página de selección de Brawlers
├── index.html                 # Página principal
└── README.md                  # Documentación del proyecto
```

### 🚀 Netlify (es necesario tener el JSON-SERVER activo.): 
- https://smasharena.netlify.app/brawlers
