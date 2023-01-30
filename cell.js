export const stateEnum = {
    HIDDEN: 0,
    SHOWN: 1,
    FLAGGED: 2
}
export const typeEnum = {
    NOTMINE: 0,
    MINE: 1
}
export class Cell {
    constructor(x, y) {
        this.state = stateEnum.HIDDEN
        this.type = typeEnum.NOTMINE
        this.x = x
        this.y = y
        this.adjCount = 0
    }
    setType(type) {
        this.type = type
    }
    setHTMLElement(el) {
        this.htmlElement = el
    }
    setAdjCount(cnt) {
        this.adjCount = cnt
    }
}