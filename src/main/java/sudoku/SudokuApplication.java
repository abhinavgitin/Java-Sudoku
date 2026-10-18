package sudoku;

import java.io.IOException;

import javafx.application.Application;
import javafx.scene.Group;
import javafx.stage.Stage;
import sudoku.buildlogic.SudokuBuildLogic;
import sudoku.userinterface.UserInterfaceImpl;

public class SudokuApplication extends Application {

    @Override
    public void start(Stage primaryStage) throws IOException {
        primaryStage.setTitle("Sudoku");

        UserInterfaceImpl view = new UserInterfaceImpl(primaryStage, new Group());
        SudokuBuildLogic.build(view);
    }

    public static void main(String[] args) {
        launch(args);
    }
}