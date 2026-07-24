# TicTacToe - Classic Game Web Application

A classic Tic-Tac-Toe game with persistent game history tracking. Challenge your friends and keep track of all your wins, losses, and draws!

## Features

- **Classic Gameplay** - Traditional 3x3 Tic-Tac-Toe experience.
- **Game History** - View results of all games played during your session.
- **Persistent Storage** - Game history saved using localStorage.
- **Live Scoreboard** - Real-time tracking of wins, losses, and draws.
- **Split-Screen Layout** - Scoreboard on the left, game board on the right.
- **Reset Functionality** - Clear game history with a single button click.
- **Clean Interface** - Simple and intuitive design.

## Demo

🔗 [Live Demo on Netlify](https://crossroadclash.netlify.app)

## Tech Stack

- **HTML5** - Structure & Content
- **CSS3** - Styling & Layout
- **JavaScript** - Game Logic & localStorage Management
- **LocalStorage** - Persistent Game History Storage
- **Netlify** - Hosting & Deployment

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/Balsha98/Repository-TicTacToe.git
```

Navigate to the project directory:

```bash
cd Repository-TicTacToe/tic-tac-toe
```

Open the project in your browser:

```bash
# Simply open index.html in your preferred browser
# Or use a local server like Live Server in VS Code
```

## Usage

1. **Start Playing**: Open the game and the board is ready for play.
2. **Make Moves**: Players take turns clicking on empty squares.
3. **Track Progress**: The scoreboard on the left displays current statistics.
4. **View History**: All game results are automatically saved and displayed.
5. **Reset History**: Click the reset button to clear all saved game data.

## Project Structure

```
Repository-TicTacToe/
│
├── tic-tac-toe/        # Main application directory.
│   │
│   ├── assets/         # Assets directory
│   │   │
│   │   ├── css/
│   │   │   └── style.css       # Styling.
│   │   │
│   │   ├── javascript/
│   │   │   │
│   │   │   ├── helpers/        # Data management helper classes.
│   │   │   │
│   │   │   ├── views/          # UI component JS modules.
│   │   │   │
│   │   │   ├── config.js       # Game configuration data.
│   │   │   ├── controller.js   # Main game controller (connects model and view).
│   │   │   └── model.js        # Game model (data management & localStorage sync).
│   │   │
│   │   └── media/              # Site visuals.
│   │
│   └── index.html      # Main game page.
│
└── README.md           # Project documentation.
```

## How It Works

The game uses localStorage to persist data across sessions:

- Game results are automatically saved after each match.
- Scoreboard updates in real-time as games are played.
- History remains available even after closing the browser.
- Reset button clears all stored data and resets the scoreboard.

## Let's Connect

If you enjoyed this project or have any questions, feel free to reach out!

[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://bazovich.dev)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:balsa.bazovic@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/balsha-bazovich)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Balsha98)

⭐ If you found this project helpful, please consider giving it a star!

## License

Personal project - all rights reserved.
