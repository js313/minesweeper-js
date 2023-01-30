import { stateEnum, typeEnum } from "./cell.js";
import { cols, reset, revealCell, rows, board as logicBoard, gameOver } from "./logic.js";

const board = document.getElementById("board")
const game = document.getElementById("game")
const diff = document.getElementById("difficulty")
const statusHeading = document.getElementById("status")

diff.addEventListener("change", () => {
    reset(diff.value)
})

export function reRender() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = logicBoard[i][j]
            if (cell.state === stateEnum.SHOWN) {
                if (cell.type === typeEnum.MINE)
                    cell.htmlElement.style.setProperty("background-color", "red")
                else {
                    cell.htmlElement.style.setProperty("background-color", "darkgray")
                    cell.adjCount > 0 && (cell.htmlElement.innerHTML = cell.adjCount)
                    if (diff.value === "easy") {
                        cell.htmlElement.style.setProperty("line-height", "4rem")
                        cell.htmlElement.style.setProperty("font-size", "35px")
                    }
                    else if (diff.value === "medium") {
                        cell.htmlElement.style.setProperty("line-height", "2.2rem")
                        cell.htmlElement.style.setProperty("font-size", "26px")
                    }
                    else if (diff.value === "hard") {
                        cell.htmlElement.style.setProperty("line-height", "2rem")
                        cell.htmlElement.style.setProperty("font-size", "25px")
                    }
                }
            }
        }
    }

}

export function drawGrid() {
    board.innerHTML = ''
    let maxHeight = 550
    let maxWidth = 1000
    let cellSize = Math.min(maxWidth / cols, maxHeight / rows)
    for (let i = 0; i < rows; i++) {
        const row = document.createElement("div")
        row.classList.add("row")
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.style.setProperty("width", `${cellSize}px`)
            cell.style.setProperty("height", `${cellSize}px`)
            cell.setAttribute("row", i)
            cell.setAttribute("col", j)
            // if (logicBoard[i][j].type === typeEnum.MINE)
            //     cell.style.setProperty("background-color", "red")
            const clickEvent = cell.addEventListener("click", (event) => {
                if (logicBoard[i][j].state === stateEnum.HIDDEN && !gameOver)
                    revealCell(+event.target.attributes.row.value, +event.target.attributes.col.value)
            })
            cell.addEventListener("contextmenu", (event) => {
                event.preventDefault()
                if (gameOver) return
                if (logicBoard[i][j].state === stateEnum.HIDDEN) {
                    cell.style.setProperty("background-color", "yellow")
                    logicBoard[i][j].state = stateEnum.FLAGGED
                }
                else if (logicBoard[i][j].state === stateEnum.FLAGGED) {
                    cell.style.setProperty("background-color", "gray")
                    logicBoard[i][j].state = stateEnum.HIDDEN
                }

            })
            logicBoard[i][j].setHTMLElement(cell)
            row.appendChild(cell)
        }
        board.appendChild(row)
    }
}
drawGrid()

export function loseGame() {
    statusHeading.innerHTML = "Game Over."
    const button = document.createElement("button")
    button.innerText = "New Game"
    button.addEventListener("click", () => {
        statusHeading.innerHTML = ""
        reset(diff.value)
    })
    statusHeading.appendChild(button)
}

export function winGame() {
    statusHeading.innerHTML = "You won."
    const button = document.createElement("button")
    button.innerText = "New Game"
    button.addEventListener("click", () => {
        statusHeading.innerHTML = ""
        reset(diff.value)
    })
    statusHeading.appendChild(button)
}