const gridContainer = document.getElementById('grid-container');
const message = document.getElementById('message');
const startButton = document.getElementById('start-game');
const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');

let gridSize = 5;
let grid = [];
let playerPos = [0, 0];
let treasures = [];
let traps = [];
let gameActive = false;

function createGrid(size, treasureCount, trapCount) {
    grid = [];
    for (let i = 0; i < size; i++) {
        grid.push(Array(size).fill('empty'));
    }

    let positions = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            positions.push([i, j]);
        }
    }
    positions = shuffleArray(positions);

    treasures = positions.slice(0, treasureCount);
    traps = positions.slice(treasureCount, treasureCount + trapCount);

    treasures.forEach(([x, y]) => grid[x][y] = 'T');
    traps.forEach(([x, y]) => grid[x][y] = 'X');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderGrid() {
    gridContainer.innerHTML = '';
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('grid-cell');
            if (cell === 'T') {
                cellDiv.classList.add('T');
            } else if (cell === 'X') {
                cellDiv.classList.add('X');
            } else {
                cellDiv.classList.add('empty');
            }
            cellDiv.dataset.row = i;
            cellDiv.dataset.col = j;
            if (i === playerPos[0] && j === playerPos[1]) {
                cellDiv.classList.add('P');
            }
            gridContainer.appendChild(cellDiv);
        });
    });
}

function handleCellClick(row, col) {
    if (!gameActive) return;

    const cell = grid[row][col];
    if (cell === 'T') {
        grid[row][col] = 'P';
        renderGrid();
        message.textContent = 'You found a treasure!';
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('P');
    } else if (cell === 'X') {
        message.textContent = 'Game Over! You hit a trap.';
        gameActive = false;
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('X');
    } else if (cell === 'empty') {
        grid[row][col] = 'P';
        renderGrid();
    }
}

function movePlayer(direction) {
    if (!gameActive) return;

    let [x, y] = playerPos;

    if (direction === 'up' && x > 0) x--;
    if (direction === 'down' && x < gridSize - 1) x++;
    if (direction === 'left' && y > 0) y--;
    if (direction === 'right' && y < gridSize - 1) y++;

    if (grid[x][y] === 'X') {
        message.textContent = 'Game Over! You hit a trap.';
        gameActive = false;
    } else {
        playerPos = [x, y];
        handleCellClick(x, y);
    }
}

startButton.addEventListener('click', () => {
    createGrid(gridSize, 3, 3);
    renderGrid();
    playerPos = [0, 0];
    message.textContent = '';
    gameActive = true;
});

upButton.addEventListener('click', () => movePlayer('up'));
leftButton.addEventListener('click', () => movePlayer('left'));
rightButton.addEventListener('click', () => movePlayer('right'));
downButton.addEventListener('click', () => movePlayer('down'));
