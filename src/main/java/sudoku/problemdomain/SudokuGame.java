package sudoku.problemdomain;

import java.io.Serializable;
import sudoku.constants.GameState;

public class SudokuGame implements Serializable {
    private final GameState gameState;
    private final int[][] gridState;

    public static final int GRID_BOUNDARY = 9;

    public SudokuGame(int[][] gridState, GameState gameState) {
        this.gridState = gridState;
        this.gameState = gameState;
    }

    public GameState getGameState() {
        return gameState;
    }

    public int[][] getGridstate() {
        return SudokuUtilities.copyToNewArray(gridstate);
    }
}
