package sudoku.userinterface.logic;

import sudoku.computationallogic.GameLogic;
import sudoku.constants.GameState;
import sudoku.constants.Message;
import sudoku.problemdomain.IStorage;
import sudoku.problemdomain.SudokuGame;
import sudoku.userinterface.IUserInterfaceContract;

import java.io.IOException;

public class ControlLogic implements IUserInterfaceContract.EventListener {

    private IStorage storage;

    private IUserInterfaceContract.View view;

    public ControlLogic(IStorage storage, IUserInterfaceContract.View view) {
        this.storage = storage;
        this.view = view;
    }

    @Override
    public void onSudokuInput(int x, int y, int input) {
        try {
            SudokuGame gameData = storage.getGameData();
            int[][] newGridState = gameData.getCopyOfGridState();
            newGridState[x][y] = input;

            gameData = new SudokuGame(newGridState, GameLogic.checkForCompletion(newGridState));
            storage.updateGameData((gameData));

            view.updateSquare(x,y,input);

            if (gameData.getGameState() == GameState.COMPLETE) {
                view.showDialog(Message.GAME_COMPLETE);
            } else if (gameData.getGameState() == GameState.LOST) {
                view.showError(Message.GAME_LOST);
            }
        } catch (IOException e ) {
            e.printStackTrace();
            view.showError(Message.ERROR);
        }
    }

    @Override
    public void onDilogClick() {
        try {
            storage.updateGameData(
                    GameLogic.getNewGame()
            );
            view.updateBoard(storage.getGameData());
        } catch (IOException e){
            view.showError(Message.ERROR);
        }
    }
}
