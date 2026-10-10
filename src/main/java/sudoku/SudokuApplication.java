package sudoku;

import javafx.application.Application;
import javafx.stage.Stage;

public class SudokuApplication extends Application {

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Sudoku");
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}