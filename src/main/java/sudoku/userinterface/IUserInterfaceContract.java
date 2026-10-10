package sudoku.userinterface;

import sudoku.problemdomain.SudokuGame;

public interface IUserInterfaceContract {
    interface EventListner {
        void onSudokuInput(int x, int y, int input);
        void onDilogClick();
    }

    interface View {
        void setListner(IUserInterfaceContract.EventListner listener);
        void updateSquare(int x, int y, int input);
        void updateBoard (SudokuGame game);
        void showDialog(String message);
        void showError(String message);
    }
}
