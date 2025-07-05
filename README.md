# 🟡 Custom Pac-Man Game (JavaScript Canvas Version)

This is a simplified browser-based implementation of the classic Pac-Man game using HTML5 Canvas and vanilla JavaScript. The game includes core elements such as a tile-based map, static ghosts, food dots, and a movable Pac-Man.

## 🔧 Main Features:
Tile-Based Grid:
The game board is a 21-row by 19-column grid, where each tile is 32×32 pixels. The layout is defined using a character map where:

- 'X' = Wall
- ' ' = Food
- 'P' = Pac-Man starting position
- 'b', 'o', 'p', 'r' = Blue, Orange, Pink, and Red ghosts
- 'O' = Skip tile (empty corridor space)

## 💟 Images and Graphics:
All visual elements (Pac-Man, ghosts, walls) are rendered using image files, and food pellets are drawn as small white rectangles.

### *Canvas Rendering:*
The game continuously draws the board at ~20 FPS using setTimeout(update, 50) for smooth animation.

### *Modular Object Representation:*

A Block class is used to model every drawable entity on the board with properties like position, size, and image. 
Each block stores its original position, which can help for resetting or respawning.

## 🎮 Game Mechanics:
### *Loading:*
On window.onload, the game initializes the canvas, loads images, parses the tile map, and starts the update loop.

### *Drawing Loop:*
Each frame redraws:

-Walls
-Food pellets
-Ghosts
-Pac-Man

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/minesweeper.git
   cd minesweeper

