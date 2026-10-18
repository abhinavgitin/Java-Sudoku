const GRID_BOUNDARY = 9;

const GameState = Object.freeze({
    COMPLETE: 'COMPLETE',
    ACTIVE: 'ACTIVE',
    NEW: 'NEW',
    LOST: 'LOST'
});

const Message = Object.freeze({
    GAME_COMPLETE: "Congratulations you won the GAME!!!!!",
    GAME_LOST: "Game Over! You entered incorrect numbers.",
    ERROR: "There was an Error!"
});

const Rows = Object.freeze({
    TOP: 'TOP',
    MIDDLE: 'MIDDLE',
    BOTTOM: 'BOTTOM'
});

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() { return this.x; }
    getY() { return this.y; }
}

class SudokuUtilities {
    static copySudokuArrayValues(oldArray, newArray) {
        for (let xIndex = 0; xIndex < GRID_BOUNDARY; xIndex++) {
            for (let yIndex = 0; yIndex < GRID_BOUNDARY; yIndex++) {
                newArray[xIndex][yIndex] = oldArray[xIndex][yIndex];
            }
        }
    }

    static copyToNewArray(oldArray) {
        const newArray = Array.from({ length: GRID_BOUNDARY }, () => Array(GRID_BOUNDARY).fill(0));
        for (let xIndex = 0; xIndex < GRID_BOUNDARY; xIndex++) {
            for (let yIndex = 0; yIndex < GRID_BOUNDARY; yIndex++) {
                newArray[xIndex][yIndex] = oldArray[xIndex][yIndex];
            }
        }
        return newArray;
    }
}

class SudokuSolver {
    static puzzleIsSolvable(puzzle) {
        const emptyCells = this.typeWriterEnumerate(puzzle);
        let index = 0;
        let input;
        while (index < 10) {
            const current = emptyCells[index];
            if (!current) break;
            input = 1;
            while (input < 40) {
                puzzle[current.getX()][current.getY()] = input;
                if (GameLogic.sudokuIsInvalid(puzzle)) {
                    if (index === 0 && input === GRID_BOUNDARY) {
                        return false;
                    } else if (input === GRID_BOUNDARY) {
                        index--;
                    }
                    input++;
                } else {
                    index++;
                    if (index === 39) return true;
                    input = 10;
                }
            }
        }
        return false;
    }

    static typeWriterEnumerate(puzzle) {
        const emptyCells = [];
        let iterator = 0;
        for (let y = 0; y < GRID_BOUNDARY; y++) {
            for (let x = 0; x < GRID_BOUNDARY; x++) {
                if (puzzle[x][y] === 0) {
                    emptyCells[iterator] = new Coordinates(x, y);
                    if (iterator === 39) return emptyCells;
                    iterator++;
                }
            }
        }
        return emptyCells;
    }
}

class GameLogic {
    static getNewGame() {
        return {
            gridState: GameGenerator.getNewGameGrid(),
            gameState: GameState.NEW
        };
    }

    static checkForCompletion(grid) {
        if (this.tilesAreNotFilled(grid)) return GameState.ACTIVE;
        if (this.sudokuIsInvalid(grid)) return GameState.LOST;
        return GameState.COMPLETE;
    }

    static tilesAreNotFilled(grid) {
        for (let xIndex = 0; xIndex < GRID_BOUNDARY; xIndex++) {
            for (let yIndex = 0; yIndex < GRID_BOUNDARY; yIndex++) {
                if (grid[xIndex][yIndex] === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    static sudokuIsInvalid(grid) {
        if (this.rowAreInvalid(grid)) return true;
        if (this.columnAreInvalid(grid)) return true;
        return this.squareAreInvalid(grid);
    }

    static rowAreInvalid(grid) {
        for (let yIndex = 0; yIndex < GRID_BOUNDARY; yIndex++) {
            const row = [];
            for (let xIndex = 0; xIndex < GRID_BOUNDARY; xIndex++) {
                row.push(grid[xIndex][yIndex]);
            }
            if (this.collectionHasRepeats(row)) return true;
        }
        return false;
    }

    static columnAreInvalid(grid) {
        for (let xIndex = 0; xIndex < GRID_BOUNDARY; xIndex++) {
            const row = [];
            for (let yIndex = 0; yIndex < GRID_BOUNDARY; yIndex++) {
                row.push(grid[xIndex][yIndex]);
            }
            if (this.collectionHasRepeats(row)) return true;
        }
        return false;
    }

    static squareAreInvalid(grid) {
        if (this.rowOfSquaresIsInvalid(Rows.TOP, grid)) return true;
        if (this.rowOfSquaresIsInvalid(Rows.MIDDLE, grid)) return true;
        if (this.rowOfSquaresIsInvalid(Rows.BOTTOM, grid)) return true;
        return false;
    }

    static rowOfSquaresIsInvalid(value, grid) {
        switch (value) {
            case Rows.TOP:
                if (this.squareIsInvalid(0, 0, grid)) return true;
                if (this.squareIsInvalid(0, 3, grid)) return true;
                if (this.squareIsInvalid(0, 6, grid)) return true;
                return false;
            case Rows.MIDDLE:
                if (this.squareIsInvalid(3, 0, grid)) return true;
                if (this.squareIsInvalid(3, 3, grid)) return true;
                if (this.squareIsInvalid(3, 6, grid)) return true;
                return false;
            case Rows.BOTTOM:
                if (this.squareIsInvalid(6, 0, grid)) return true;
                if (this.squareIsInvalid(6, 3, grid)) return true;
                if (this.squareIsInvalid(6, 6, grid)) return true;
                return false;
            default:
                return false;
        }
    }

    static squareIsInvalid(xIndex, yIndex, grid) {
        const yIndexEnd = yIndex + 3;
        const xIndexEnd = xIndex + 3;
        const square = [];
        let curY = yIndex;
        while (curY < yIndexEnd) {
            let curX = xIndex;
            while (curX < xIndexEnd) {
                square.push(grid[curX][curY]);
                curX++;
            }
            curY++;
        }
        return this.collectionHasRepeats(square);
    }

    static collectionHasRepeats(collection) {
        for (let index = 1; index <= GRID_BOUNDARY; index++) {
            let count = 0;
            for (let i = 0; i < collection.length; i++) {
                if (collection[i] === index) count++;
            }
            if (count > 1) return true;
        }
        return false;
    }
}

class GameGenerator {
    static getNewGameGrid() {
        return this.unsolvedGame(this.getSolvedGame());
    }

    static unsolvedGame(solvedGame) {
        let solvable = false;
        const solvableArray = Array.from({ length: GRID_BOUNDARY }, () => Array(GRID_BOUNDARY).fill(0));
        while (!solvable) {
            SudokuUtilities.copySudokuArrayValues(solvedGame, solvableArray);
            let index = 0;
            while (index < 40) {
                const xCoordinate = Math.floor(Math.random() * GRID_BOUNDARY);
                const yCoordinate = Math.floor(Math.random() * GRID_BOUNDARY);
                if (solvableArray[xCoordinate][yCoordinate] !== 0) {
                    solvableArray[xCoordinate][yCoordinate] = 0;
                    index++;
                }
            }
            const tobeSolved = Array.from({ length: GRID_BOUNDARY }, () => Array(GRID_BOUNDARY).fill(0));
            SudokuUtilities.copySudokuArrayValues(solvableArray, tobeSolved);
            solvable = SudokuSolver.puzzleIsSolvable(tobeSolved);
        }
        return solvableArray;
    }

    static getSolvedGame() {
        const newGrid = Array.from({ length: GRID_BOUNDARY }, () => Array(GRID_BOUNDARY).fill(0));
        for (let value = 1; value <= GRID_BOUNDARY; value++) {
            let allocations = 0;
            let interrupt = 0;
            const allocTracker = [];
            let attempts = 0;
            while (allocations < GRID_BOUNDARY) {
                if (interrupt > 200) {
                    allocTracker.forEach(cord => {
                        newGrid[cord.getX()][cord.getY()] = 0;
                    });
                    interrupt = 0;
                    allocations = 0;
                    allocTracker.length = 0;
                    attempts++;
                    if (attempts > 500) {
                        this.clearArray(newGrid);
                        attempts = 0;
                        value = 1;
                    }
                }
                const xCoordinate = Math.floor(Math.random() * GRID_BOUNDARY);
                const yCoordinate = Math.floor(Math.random() * GRID_BOUNDARY);
                if (newGrid[xCoordinate][yCoordinate] === 0) {
                    newGrid[xCoordinate][yCoordinate] = value;
                    if (GameLogic.sudokuIsInvalid(newGrid)) {
                        newGrid[xCoordinate][yCoordinate] = 0;
                        interrupt++;
                    } else {
                        allocTracker.push(new Coordinates(xCoordinate, yCoordinate));
                        allocations++;
                    }
                }
            }
        }
        return newGrid;
    }

    static clearArray(grid) {
        for (let x = 0; x < GRID_BOUNDARY; x++) {
            for (let y = 0; y < GRID_BOUNDARY; y++) {
                grid[x][y] = 0;
            }
        }
    }
}

class LocalStorageImpl {
    static STORAGE_KEY = "Java-Sudoku-GameData";
    static INITIAL_KEY = "Java-Sudoku-InitialData";

    static updateGameData(game) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(game));
    }

    static getGameData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }

    static saveInitialClues(clues) {
        localStorage.setItem(this.INITIAL_KEY, JSON.stringify(clues));
    }

    static getInitialClues() {
        const data = localStorage.getItem(this.INITIAL_KEY);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
}

class ControlLogic {
    constructor(view) {
        this.view = view;
    }

    onSudokuInput(x, y, input) {
        try {
            const gameData = LocalStorageImpl.getGameData();
            const newGridState = SudokuUtilities.copyToNewArray(gameData.gridState);
            newGridState[x][y] = input;

            const nextGameState = GameLogic.checkForCompletion(newGridState);
            const updatedGame = {
                gridState: newGridState,
                gameState: nextGameState
            };
            LocalStorageImpl.updateGameData(updatedGame);

            this.view.updateSquare(x, y, input);

            if (nextGameState === GameState.COMPLETE) {
                this.view.showDialog(Message.GAME_COMPLETE);
            } else if (nextGameState === GameState.LOST) {
                this.view.showError(Message.GAME_LOST);
            }
        } catch (e) {
            this.view.showError(Message.ERROR);
        }
    }

    onDialogClick() {
        try {
            const newGame = GameLogic.getNewGame();
            const initialClues = SudokuUtilities.copyToNewArray(newGame.gridState);
            LocalStorageImpl.updateGameData(newGame);
            LocalStorageImpl.saveInitialClues(initialClues);
            this.view.updateBoard(newGame, initialClues);
        } catch (e) {
            this.view.showError(Message.ERROR);
        }
    }
}

class UserInterfaceImpl {
    constructor() {
        this.boardElement = document.getElementById("sudoku-board");
        this.dialogOverlay = document.getElementById("dialog-overlay");
        this.dialogBox = document.getElementById("dialog-box");
        this.dialogTitle = document.getElementById("dialog-title");
        this.dialogMessage = document.getElementById("dialog-message");
        this.dialogOkBtn = document.getElementById("dialog-ok-btn");
        this.tiles = new Map();
        this.listener = null;
        this.onDialogCloseCallback = null;

        this.dialogOkBtn.addEventListener("click", () => {
            this.dialogOverlay.classList.add("hidden");
            if (this.onDialogCloseCallback) {
                const cb = this.onDialogCloseCallback;
                this.onDialogCloseCallback = null;
                cb();
            }
        });

        this.initializeUserInterface();
    }

    setListener(listener) {
        this.listener = listener;
    }

    initializeUserInterface() {
        this.boardElement.innerHTML = "";
        for (let yIndex = 0; yIndex < GRID_BOUNDARY; yIndex++) {
            for (let xIndex = 0; xIndex < GRID_BOUNDARY; xIndex++) {
                const cell = document.createElement("div");
                cell.className = "sudoku-cell";
                cell.setAttribute("tabindex", "0");
                cell.setAttribute("role", "textbox");

                const key = `${xIndex},${yIndex}`;
                this.tiles.set(key, cell);

                cell.addEventListener("keydown", (event) => {
                    if (!cell.classList.contains("editable")) return;
                    if (event.key >= "0" && event.key <= "9") {
                        event.preventDefault();
                        const val = parseInt(event.key, 10);
                        if (this.listener) {
                            this.listener.onSudokuInput(xIndex, yIndex, val);
                        }
                    } else if (event.key === "Backspace" || event.key === "Delete") {
                        event.preventDefault();
                        if (this.listener) {
                            this.listener.onSudokuInput(xIndex, yIndex, 0);
                        }
                    }
                });

                this.boardElement.appendChild(cell);
            }
        }
    }

    updateSquare(x, y, input) {
        const cell = this.tiles.get(`${x},${y}`);
        if (!cell) return;
        const val = input === 0 ? "" : String(input);
        cell.textContent = val;
    }

    updateBoard(game, initialClues) {
        for (let xIndex = 0; xIndex < GRID_BOUNDARY; xIndex++) {
            for (let yIndex = 0; yIndex < GRID_BOUNDARY; yIndex++) {
                const cell = this.tiles.get(`${xIndex},${yIndex}`);
                const value = game.gridState[xIndex][yIndex];
                const textVal = value === 0 ? "" : String(value);
                cell.textContent = textVal;

                const isClue = initialClues[xIndex][yIndex] !== 0;
                if (isClue) {
                    cell.className = "sudoku-cell clue";
                    cell.removeAttribute("tabindex");
                } else {
                    cell.className = "sudoku-cell editable";
                    cell.setAttribute("tabindex", "0");
                }
            }
        }
    }

    showDialog(message) {
        this.dialogBox.className = "dialog-info";
        this.dialogTitle.textContent = "Information";
        this.dialogMessage.textContent = message;
        this.onDialogCloseCallback = () => {
            if (this.listener) {
                this.listener.onDialogClick();
            }
        };
        this.dialogOverlay.classList.remove("hidden");
        this.dialogOkBtn.focus();
    }

    showError(message) {
        this.dialogBox.className = "dialog-error";
        this.dialogTitle.textContent = "Error";
        this.dialogMessage.textContent = message;
        this.onDialogCloseCallback = null;
        this.dialogOverlay.classList.remove("hidden");
        this.dialogOkBtn.focus();
    }
}

class SudokuBuildLogic {
    static build(userInterface) {
        let initialState = LocalStorageImpl.getGameData();
        let initialClues = LocalStorageImpl.getInitialClues();

        if (!initialState || !initialClues) {
            initialState = GameLogic.getNewGame();
            initialClues = SudokuUtilities.copyToNewArray(initialState.gridState);
            LocalStorageImpl.updateGameData(initialState);
            LocalStorageImpl.saveInitialClues(initialClues);
        }

        const uiLogic = new ControlLogic(userInterface);
        userInterface.setListener(uiLogic);
        userInterface.updateBoard(initialState, initialClues);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const view = new UserInterfaceImpl();
    SudokuBuildLogic.build(view);
});
