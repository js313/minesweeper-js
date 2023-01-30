import { Cell, stateEnum, typeEnum } from "./cell.js"
import { drawGrid, loseGame, reRender, winGame } from "./draw.js"

export let rows = 9
export let cols = 9
export let noOfMines = 10
export let gameOver = false
export let board = []
let hiddenCells = rows * cols

function setGrid() {
    board = []
    let mines = {}
    for (let i = 0; i < noOfMines;) {
        const pos = Math.floor(Math.random() * rows * cols)
        if (!mines[pos]) {
            mines[pos] = true
            i++
        }
    }
    for (let i = 0; i < rows; i++) {
        let row = []
        for (let j = 0; j < cols; j++) {
            let cell = new Cell(i, j)
            if (mines[i * cols + j]) {
                cell.setType(typeEnum.MINE)
            }
            row.push(cell)
        }
        board.push(row)
    }
}
setGrid()

export function reset(difficulty) {
    if (difficulty === "easy") {
        rows = cols = 9
        noOfMines = 10
    }
    else if (difficulty === "medium") {
        rows = cols = 16
        noOfMines = 40
    }
    else if (difficulty === "hard") {
        rows = 16
        cols = 30
        noOfMines = 99
    }
    hiddenCells = rows * cols
    setGrid()
    drawGrid()
    gameOver = false
}

async function wait() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 5)
    })
}

function adjMine(x, y) {
    let adjCount = 0
    const cell1 = x > 0 && y > 0 ? board[x - 1][y - 1] : { type: typeEnum.NOTMINE }
    const cell2 = x > 0 ? board[x - 1][y] : { type: typeEnum.NOTMINE }
    const cell3 = x > 0 && y < cols - 1 ? board[x - 1][y + 1] : { type: typeEnum.NOTMINE }
    const cell4 = y > 0 ? board[x][y - 1] : { type: typeEnum.NOTMINE }
    const cell5 = y < cols - 1 ? board[x][y + 1] : { type: typeEnum.NOTMINE }
    const cell6 = x < rows - 1 && y > 0 ? board[x + 1][y - 1] : { type: typeEnum.NOTMINE }
    const cell7 = x < rows - 1 ? board[x + 1][y] : { type: typeEnum.NOTMINE }
    const cell8 = x < rows - 1 && y < cols - 1 ? board[x + 1][y + 1] : { type: typeEnum.NOTMINE }
    cell1.type === typeEnum.MINE && adjCount++
    cell2.type === typeEnum.MINE && adjCount++
    cell3.type === typeEnum.MINE && adjCount++
    cell4.type === typeEnum.MINE && adjCount++
    cell5.type === typeEnum.MINE && adjCount++
    cell6.type === typeEnum.MINE && adjCount++
    cell7.type === typeEnum.MINE && adjCount++
    cell8.type === typeEnum.MINE && adjCount++
    board[x][y].setAdjCount(adjCount)
    return adjCount
}

export async function revealCell(row, col) {
    const cell = board[row][col]
    const type = cell.type
    if (cell.type === typeEnum.MINE) {
        cell.state = stateEnum.SHOWN
        gameOver = true
        loseGame()
    }
    else await bfs(row, col)
    if (hiddenCells === noOfMines && gameOver !== true) {
        gameOver = true
        winGame()
    }
    reRender()
    return type
}

async function bfs(x, y) {
    const queue = [[x, y]]
    while (queue.length) {
        x = queue[0][0]
        y = queue[0][1]
        if (adjMine(x, y) === 0) {
            if (x > 0) {
                board[x - 1][y].state !== stateEnum.SHOWN && queue.push([x - 1, y]) && (board[x - 1][y].state = stateEnum.SHOWN)
                if (y > 0)
                    board[x - 1][y - 1].state !== stateEnum.SHOWN && queue.push([x - 1, y - 1]) && (board[x - 1][y - 1].state = stateEnum.SHOWN)
                if (y < cols - 1)
                    board[x - 1][y + 1].state !== stateEnum.SHOWN && queue.push([x - 1, y + 1]) && (board[x - 1][y + 1].state = stateEnum.SHOWN)

            }
            if (x < rows - 1) {
                board[x + 1][y].state !== stateEnum.SHOWN && queue.push([x + 1, y]) && (board[x + 1][y].state = stateEnum.SHOWN)
                if (y > 0)
                    board[x + 1][y - 1].state !== stateEnum.SHOWN && queue.push([x + 1, y - 1]) && (board[x + 1][y - 1].state = stateEnum.SHOWN)
                if (y < cols - 1)
                    board[x + 1][y + 1].state !== stateEnum.SHOWN && queue.push([x + 1, y + 1]) && (board[x + 1][y + 1].state = stateEnum.SHOWN)
            }
            if (y > 0)
                board[x][y - 1].state !== stateEnum.SHOWN && queue.push([x, y - 1]) && (board[x][y - 1].state = stateEnum.SHOWN)
            if (y < cols - 1)
                board[x][y + 1].state !== stateEnum.SHOWN && queue.push([x, y + 1]) && (board[x][y + 1].state = stateEnum.SHOWN)
        }
        board[x][y].state = stateEnum.SHOWN
        hiddenCells--
        queue.shift()
        // reRender()
        // await wait()
    }
}