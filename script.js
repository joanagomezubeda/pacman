// Board
let board;

const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context; // For join the canvas

// Images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set(); // Like a set in java
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'R', 'L']; // Directions for the ghosts
let score = 0;
let lives = 3;
let isGameOver = false;

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    loadImages();
    loadMap();

    for ( let ghost of ghosts.values()){
        const newDirection = directions[Math.floor(Math.random() * 4)]; // We have 4 directions
        ghost.updateDirection(newDirection);
    }

    update();

    document.addEventListener('keyup', movePacman);
}


function loadImages(){
    wallImage = new Image();
    wallImage.src = 'images/wall.png'

    blueGhostImage = new Image();
    blueGhostImage.src = 'images/blueGhost.png'

    orangeGhostImage = new Image();
    orangeGhostImage.src = 'images/orangeGhost.png'

    pinkGhostImage = new Image();
    pinkGhostImage.src = 'images/pinkGhost.png'

    redGhostImage = new Image();
    redGhostImage.src = 'images/redGhost.png'
    
    pacmanUpImage = new Image();
    pacmanUpImage.src = 'images/pacmanUp.png'

    pacmanDownImage = new Image();
    pacmanDownImage.src = 'images/pacmanDown.png'

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = 'images/pacmanLeft.png'

    pacmanRightImage = new Image();
    pacmanRightImage.src = 'images/pacmanRight.png'
    
}

function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if ( tileMapChar == 'X') { // Block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            } else if ( tileMapChar == 'b'){ // Blue ghost
                const ghost = new Block(blueGhostImage, x, y , tileSize, tileSize);
                ghosts.add(ghost);
            } else if ( tileMapChar == 'o'){ // Orange ghost
                const ghost = new Block(orangeGhostImage, x, y , tileSize, tileSize);
                ghosts.add(ghost);
            } else if ( tileMapChar == 'p'){ // Pink ghost
                const ghost = new Block(pinkGhostImage, x, y , tileSize, tileSize);
                ghosts.add(ghost);
            } else if ( tileMapChar == 'r'){ // Red ghost
                const ghost = new Block(redGhostImage, x, y , tileSize, tileSize);
                ghosts.add(ghost);
            } else if ( tileMapChar == 'P'){ // Pacman 
                pacman = new Block(pacmanRightImage, x, y , tileSize, tileSize);
            } else if ( tileMapChar == ' '){  // Food
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
            
        }
        
    }
}

function update(){
    if(isGameOver){
        return;
    }
    move();
    draw();
    setTimeout(update, 50); // Recursive 20 FPS 1 -> 1000ms/20 = 50
}

function draw(){
    context.clearRect(0,0, board.width, board.height);
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    
    for ( let ghost of ghosts.values()){
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    for ( let wall of walls.values()){
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    context.fillStyle = "white";

    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    // Score

    context.fillStyle = 'white';
    context.font = '14 px sans-serif';

    if (isGameOver) {
        context.fillText("Game Over: " + String(score), tileSize/2, tileSize/2);
    } else {
        context.fillText("x" + String(lives) + " " + String(score), tileSize/2, tileSize/2);
    }
}

function move() {
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    // Check wall collision for pacman
    for( let wall of walls.values()){
        if (collision(pacman, wall)){
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    // Check wall collistion for ghost
    for (let ghost of ghosts.values()){

        if(collision(pacman, ghost)){
            lives--;

            if(lives == 0){
                isGameOver = true;
            }

            resetPositions();
        }

        if(ghost.y == tileSize * 9 && ghost.direction != 'U' && ghost.direction != 'D'){
            ghost.updateDirection('U');
        }

        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        for(let wall of walls.values()){
            if(collision(ghost, wall) || ghost.x <= 0 || ghost.x + ghost.width >= boardWidth){
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection = directions[Math.floor(Math.random() * 4)];
                ghost.updateDirection(newDirection);
            }
        }
    }

    // Check food collision
    let foodEaten = null;

    for(let food of foods.values()){
        if(collision(pacman, food)){
            foodEaten = food;
            score += 10;
            break;
        }
    }
    foods.delete(foodEaten);

    if (foods.size == 0){
        loadMap();
        resetPositions();
    }
}

function movePacman(e){
    if(isGameOver){
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        isGameOver = false;
        update();
        return;
    }

    if( e.code == 'ArrowUp' || e.code == 'KeyW'){
        pacman.updateDirection('U');
    } else if ( e.code == 'ArrowDown' || e.code == 'KeyS') {
        pacman.updateDirection('D');
    } else if ( e.code == 'ArrowLeft' || e.code == 'KeyA') {
        pacman.updateDirection('L');
    } else if ( e.code == 'ArrowRight' || e.code == 'KeyD') {
        pacman.updateDirection('R');
    }

    // Update pacman images
    if ( pacman.direction == 'U'){
        pacman.image = pacmanUpImage;
    } else if (pacman.direction == 'D'){
        pacman.image = pacmanDownImage;
    } else if (pacman.direction == 'R'){
        pacman.image = pacmanRightImage;
    } else if (pacman.direction == 'L'){
        pacman.image = pacmanLeftImage;
    }
} 

function collision(a, b){
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function resetPositions(){
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;

    for (let ghost of ghosts.values()){
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
}

class Block {
    constructor(image, x, y , width, height){
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // To store the start x,y for the pacman and the ghost
        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction){
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();

        this.x += this.velocityX;
        this.y += this.velocityY;

        for ( let wall of walls.values()){
            if(collision(this, wall)){
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }

    updateVelocity(){
        if( this.direction == 'U'){
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        } else if ( this.direction == 'D'){
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        } else if ( this.direction == 'L'){
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        } else if ( this.direction == 'R'){
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        }
    }

    reset(){
        this.x = this.startX;
        this.y = this.startY;
    }


}