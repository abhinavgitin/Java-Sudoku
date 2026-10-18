package sudoku.userinterface;

import sudoku.problemdomain.SudokuGame;

public interface IUserInterfaceContract {
    interface EventListener {
        void onSudokuInput(int x, int y, int input);
        void onDilogClick();
    }

    interface View {
        void setListener(EventListener listener);
        void updateSquare(int x, int y, int input);
        void updateBoard (SudokuGame game);
        void showDialog(String message);
        void showError(String message);
    }
}
